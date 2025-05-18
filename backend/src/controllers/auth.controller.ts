import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Mailgun from "mailgun.js";
import FormData from "form-data";
import { pool } from "../config/db";
import { config } from "../config/env";

function generateOTP(len = 6) {
  const d = "0123456789";
  return Array.from({ length: len }, () => d[Math.random() * d.length | 0]).join("");
}

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
  url: process.env.MAILGUN_API_URL || undefined,
});

async function sendMail(opts: {
  from: string; to: string | string[]; subject: string;
  text?: string; html?: string; template?: string;
}) {
  await mg.messages.create(process.env.MAILGUN_DOMAIN!, opts);
}

export const login: RequestHandler = async (req, res) => {
  const { email, password, recaptchaToken } = req.body;

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    res.status(500).json({ success: false, message: "Server error" });
    return;
  }
  const recaptchaResponse = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptchaToken}`,
    { method: "POST" }
  );

  const success = await recaptchaResponse.json();
  if (!success.success) {
    res.status(400).json({ success: false, message: "CAPTCHA failed" });
    return;
  }
  try {
    const u = await pool.query(
      `SELECT user_id,password FROM users WHERE email=$1 LIMIT 1`, [email]
    );
    if (!u.rowCount || !(await bcrypt.compare(password, u.rows[0].password))) {
      res.status(401).json({ success: false, message: "Invalid credentials" }); return;
    }
    const otp = generateOTP();
    await pool.query(
      `INSERT INTO email_verifications (user_id,otp,expires_at)
       VALUES ($1,$2,NOW()+INTERVAL '15 min')`,
      [u.rows[0].user_id, otp]
    );
    await sendMail({
      from: `"NPS Bahrain" <${process.env.MAILGUN_FROM}>`,
      to: email,
      subject: "Login OTP",
      text: `Your OTP is ${otp}`,
      html: `<p>Your OTP is <b>${otp}</b></p>`,
    });
    res.cookie("otp_user", u.rows[0].user_id.toString(), { httpOnly: false, maxAge: 9e5 });
    res.json({ success: true, message: "OTP sent" });
  } catch (e) {
    console.error(e); res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resendLoginOTP: RequestHandler = async (req, res) => {
  const user_id = req.cookies?.otp_user;    
  if (!user_id) {
    res.status(400).json({ success: false, message: "Login expired." });
    return;
  }

  try {
    const emailQ = await pool.query(
      `SELECT email FROM users WHERE user_id = $1 LIMIT 1`,
      [user_id]
    );
    if (!emailQ.rowCount) {
      res.status(400).json({ success: false, message: "User not found." });
      return;
    }
    const email = emailQ.rows[0].email;

    const otp = generateOTP();
    await pool.query(
      `INSERT INTO email_verifications (user_id, otp, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '15 min')`,
      [user_id, otp]
    );

    await sendMail({
      from: `"NPS Bahrain" <${process.env.MAILGUN_FROM}>`,
      to: email,
      subject: "New login OTP",
      text: `Your new OTP is ${otp}`,
      html: `<p>Your new OTP is <strong>${otp}</strong></p>`,
    });

    res.cookie("otp_user", user_id.toString(), { httpOnly: false, maxAge: 9 * 60 * 1000 });

    res.json({ success: true, message: "OTP resent." });
  } catch (err) {
      console.error("resendLoginOTP error:", err);
      res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyOTP: RequestHandler = async (req, res) => {
  const { otp } = req.body;
  const user_id = req.cookies?.otp_user;
  if (!user_id) { res.status(400).json({ success:false, message:"Login expired" }); return; }

  try {
    const v = await pool.query(
      `UPDATE email_verifications
         SET used=TRUE
       WHERE user_id=$1 AND otp=$2 AND used=FALSE AND expires_at>NOW()
       RETURNING id`, [user_id, otp]
    );
    if (!v.rowCount) { res.status(400).json({ success:false,message:"OTP invalid" }); return; }

    const token = jwt.sign({ user_id }, config.jwtSecret, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly:true, maxAge: 864e5 });
    res.json({ success:true, message:"Logged in", token });
  } catch (e) {
    console.error(e); res.status(500).json({ success:false, message:"Server error" });
  }
};

export const register: RequestHandler = async (req, res) => {
  const { first_name, last_name, email, password, login_code, recaptchaToken } = req.body;

  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    res.status(500).json({ success: false, message: "Please verify CAPTCHA." });
    return;
  }
  const recaptchaResponse = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptchaToken}`,
    { method: "POST" }
  );

  const success = await recaptchaResponse.json();
  if (!success.success) {
    res.status(400).json({ success: false, message: "CAPTCHA failed" });
    return;
  }

  try {
    const firmQ = await pool.query(
      `SELECT f.firm_id,
              f.firm_name,
              pt.max_number_of_users
         FROM firms f
         JOIN plan_tiers pt ON f.plan = pt.tier_name
        WHERE f.login_code = $1
        LIMIT 1`,
      [login_code],
    );
    if (!firmQ.rowCount) {
      res.status(400).json({ success: false, message: "Invalid registration code." });
      return;
    }
    const firm = firmQ.rows[0];

    // Checking if firm user limit is reached
    const cntQ = await pool.query(
      `SELECT COUNT(*)::int AS c FROM users WHERE firm_id = $1`,
      [firm.firm_id],
    );
    if (cntQ.rows[0].c >= firm.max_number_of_users) {
      res.status(400).json({ success: false, message: "Firm user limit reached." });
      return;
    }

    const exists = await pool.query(
      `SELECT 1 FROM users WHERE email = $1 LIMIT 1`,
      [email],
    );
    if (exists.rowCount) {
      res.status(400).json({ success: false, message: "Email already verified; please log in." });
      return;
    }

    const otp   = generateOTP();
    const hash  = await bcrypt.hash(password, 10);

    const tokenRow = await pool.query(
      `INSERT INTO registration_tokens
        (first_name, last_name, email, password,
          firm_id, firm_name, role, otp, expires_at)
      VALUES ($1,$2,$3,$4,$5,$6,'staff',$7, NOW() + INTERVAL '15 min')
      ON CONFLICT (email)
      DO UPDATE
          SET otp        = EXCLUDED.otp,
              password   = EXCLUDED.password,
              expires_at = NOW() + INTERVAL '15 min',
              used      = FALSE
      RETURNING id`,        
      [ first_name, last_name, email, hash,
        firm.firm_id, firm.firm_name, otp ]
    );

    // id is the primary key of the registration_tokens table
    const regId = tokenRow.rows[0].id;

    res.cookie("reg_id", regId.toString(), { httpOnly: false, maxAge: 9 * 60 * 1000 });

    await sendMail({
      from: `"NPS Bahrain" <${process.env.MAILGUN_FROM}>`,
      to: email,
      subject: "Complete Registration",
      text: `Your OTP is ${otp}, valid for 15 minutes.`,
      html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 15 minutes.</p>`,
    });

    res.json({ success: true, message: "OTP sent to your email." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const verifyRegisterOTP: RequestHandler = async (req,res)=>{
  const { otp } = req.body;
  const reg_id  = req.cookies?.reg_id;
  if (!reg_id) { res.status(400).json({success:false,message:"Expired"}); return; }

  try {
    const tok = await pool.query(
      `UPDATE registration_tokens
         SET used=TRUE
       WHERE id=$1 AND otp=$2 AND used=FALSE AND expires_at>NOW()
       RETURNING *`, [reg_id, otp]
    );
    if (!tok.rowCount) { res.status(400).json({success:false,message:"OTP invalid"}); return; }

    const r = tok.rows[0];


    const c = await pool.query(
      `SELECT COUNT(*)::int AS c FROM users WHERE firm_id=$1`, [r.firm_id]
    );
    const limitQ = await pool.query(
      `SELECT pt.max_number_of_users
         FROM plan_tiers pt
         JOIN firms f ON f.plan=pt.tier_name
        WHERE f.firm_id=$1`, [r.firm_id]
    );
    if (c.rows[0].c >= limitQ.rows[0].max_number_of_users) {
      res.status(400).json({success:false,message:"Firm limit reached"}); return;
    }

    const u = await pool.query(
      `INSERT INTO users
       (first_name,last_name,phone_number,email,password,
        real_estate_firm,firm_id,role,"isVerified")
       VALUES ($1,$2,'N/A',$3,$4,$5,$6,$7,TRUE)
       RETURNING user_id`, [
         r.first_name, r.last_name, r.email, r.password,
         r.firm_name,  r.firm_id,   r.role
       ]
    );
    const userId = u.rows[0].user_id;
    const token  = jwt.sign({ user_id:userId }, config.jwtSecret, { expiresIn:"1d" });

    res.cookie("token", token, { httpOnly:true, maxAge: 864e5 });
    res.json({ success:true, message:"Account verified", token });
  } catch(e){
    console.error(e); res.status(500).json({success:false,message:"Server error"});
  }
};


export const resendRegisterOTP: RequestHandler = async (req,res)=>{
  const reg_id = req.cookies?.reg_id;
  if (!reg_id) { res.status(400).json({success:false,message:"Expired"}); return; }

  try {
    const emailQ = await pool.query(
      `SELECT email FROM registration_tokens WHERE id=$1 AND used=FALSE`, [reg_id]
    );
    if (!emailQ.rowCount) {
      res.status(400).json({success:false,message:"Registration not pending"}); return;
    }
    const otp = generateOTP();
    await pool.query(
      `UPDATE registration_tokens
          SET otp=$1, expires_at=NOW()+INTERVAL '15 min'
        WHERE id=$2`, [otp, reg_id]
    );
    await sendMail({
      from: `"NPS Bahrain" <${process.env.MAILGUN_FROM}>`,
      to: emailQ.rows[0].email,
      subject: "New OTP",
      text: `Your new OTP is ${otp}`,
      html: `<p>Your new OTP is <b>${otp}</b></p>`,
    });
    res.json({ success:true, message:"OTP resent" });
  } catch(e){
    console.error(e); res.status(500).json({success:false,message:"Server error"});
  }
};

export const logout: RequestHandler = (req,res)=>{
  res.clearCookie("token"); res.clearCookie("otp_user"); res.clearCookie("reg_id");
  res.json({ success:true, message:"Logged out" });
};
