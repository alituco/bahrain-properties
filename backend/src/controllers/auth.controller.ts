import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { pool } from '../config/db';
import { config } from '../config/env';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first'); 


function generateOTP(length = 6): string {
  let otp = '';
  const digits = '0123456789';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

// Configure nodemailer transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Login Endpoint
export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query(
      'SELECT user_id, email, password FROM users WHERE email = $1 LIMIT 1',
      [email]
    );
    if (userResult.rows.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }
    const user = userResult.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    await pool.query(
      `INSERT INTO email_verifications (user_id, otp, expires_at)
       VALUES ($1, $2, $3)`,
      [user.user_id, otp, expiresAt]
    );
    await transporter.sendMail({
      from: `"NPS Bahrain" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Login OTP',
      text: `Your OTP is ${otp}, it expires in 15 minutes.`,
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 15 minutes.</p>`
    });
    res.cookie("user_id", user.user_id.toString(), {
      httpOnly: false,
      maxAge: 15 * 60 * 1000,
    });
    res.json({ success: true, message: 'OTP sent to your email.' });
    return;
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ success: false, message: 'Server error' });
    return;
  }
};

// Verify OTP Endpoint
export const verifyOTP: RequestHandler = async (req, res) => {
  const { otp } = req.body;
  const user_id = req.cookies?.user_id;
  if (!user_id) {
    res.status(400).json({ success: false, message: 'User ID is missing. Please log in again.' });
    return;
  }
  try {
    const result = await pool.query(
      `SELECT * FROM email_verifications
       WHERE user_id = $1
         AND otp = $2
         AND used = FALSE
         AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [user_id, otp]
    );
    if (result.rows.length === 0) {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      return;
    }
    const record = result.rows[0];
    await pool.query('UPDATE email_verifications SET used = TRUE WHERE id = $1', [record.id]);
    const userResult = await pool.query(
      'SELECT "isVerified" FROM users WHERE user_id = $1',
      [user_id]
    );
    if (userResult.rows.length === 0 || userResult.rows[0].isVerified === false) {
      res.status(400).json({
        success: false,
        message: 'Account not verified. Please verify your account.'
      });
      return;
    }
    const token = jwt.sign(
      { user_id, email_verified: true },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ success: true, message: 'Logged in successfully.', token });
    return;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Server error' });
    return;
  }
};

// Registration Endpoint
export const register: RequestHandler = async (req, res) => {
  const { first_name, last_name, email, password, login_code } = req.body;
  try {
    const firmJoinQuery = `
      SELECT
        f.firm_id,
        f.firm_name,
        pt.max_number_of_users
      FROM firms f
      JOIN plan_tiers pt ON f.plan = pt.tier_name
      WHERE f.login_code = $1
      LIMIT 1;
    `;
    const firmResult = await pool.query(firmJoinQuery, [login_code]);
    if (firmResult.rows.length === 0) {
      res.status(400).json({ success: false, message: 'Invalid registration code.' });
      return;
    }
    const firm = firmResult.rows[0];
    const userCountResult = await pool.query(
      'SELECT COUNT(*) AS count FROM users WHERE firm_id = $1',
      [firm.firm_id]
    );
    const currentCount = parseInt(userCountResult.rows[0].count, 10);
    if (currentCount >= firm.max_number_of_users) {
      res.status(400).json({
        success: false,
        message: 'Maximum number of users reached for this firm.'
      });
      return;
    }
    const existingUser = await pool.query(
      'SELECT user_id FROM users WHERE email = $1 LIMIT 1',
      [email]
    );
    if (existingUser.rows.length > 0) {
      res.status(400).json({ success: false, message: 'Email already registered.' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `
      INSERT INTO users (
        first_name,
        last_name,
        phone_number,
        email,
        password,
        real_estate_firm,
        firm_id,
        role
      )
      VALUES ($1, $2, 'N/A', $3, $4, $5, $6, 'staff')
      RETURNING user_id;
    `;
    const userInsert = await pool.query(insertQuery, [
      first_name,
      last_name,
      email,
      hashedPassword,
      firm.firm_name,
      firm.firm_id
    ]);
    const newUserId = userInsert.rows[0].user_id;
    res.cookie("user_id", newUserId.toString(), {
      httpOnly: false,
      maxAge: 15 * 60 * 1000,
    });
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    await pool.query(
      `INSERT INTO email_verifications (user_id, otp, expires_at)
       VALUES ($1, $2, $3)`,
      [newUserId, otp, expiresAt]
    );
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Complete Registration with OTP',
      text: `Your registration OTP is ${otp}, valid for 15 min.`,
      html: `<p>Your registration OTP is <strong>${otp}</strong>, valid for 15 min.</p>`
    });
    res.json({ success: true, message: 'User registered. OTP sent to your email.', user_id: newUserId });
    return;
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ success: false, message: 'Server error' });
    return;
  }
};

// Verify Registration OTP Endpoint
export const verifyRegisterOTP: RequestHandler = async (req, res) => {
  const { user_id, otp } = req.body;
  try {
    const result = await pool.query(
      `SELECT * FROM email_verifications
       WHERE user_id = $1
         AND otp = $2
         AND used = FALSE
         AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [user_id, otp]
    );
    if (result.rows.length === 0) {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      return;
    }
    await pool.query('UPDATE email_verifications SET used = TRUE WHERE id = $1', [result.rows[0].id]);
    await pool.query('UPDATE users SET "isVerified" = TRUE WHERE user_id = $1', [user_id]);
    const token = jwt.sign({ user_id }, config.jwtSecret, { expiresIn: '1d' });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ success: true, message: 'Registration OTP verified, account active.', token });
    return;
  } catch (error) {
    console.error('Error in verifyRegisterOTP:', error);
    res.status(500).json({ success: false, message: 'Server error' });
    return;
  }
};

export const resendOTP: RequestHandler = async (req, res) => {
  const { user_id } = req.body;
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    await pool.query(
      `INSERT INTO email_verifications (user_id, otp, expires_at)
       VALUES ($1, $2, $3)`,
      [user_id, otp, expiresAt]
    );
    const userResult = await pool.query(
      'SELECT email FROM users WHERE user_id = $1',
      [user_id]
    );
    if (userResult.rows.length === 0) {
      res.status(400).json({ success: false, message: 'User not found.' });
      return;
    }
    const email = userResult.rows[0].email;
    await transporter.sendMail({
      from: `"NPS Bahrain" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your New OTP for Verification',
      text: `Your new OTP is ${otp}, valid for 15 minutes.`,
      html: `<p>Your new OTP is <strong>${otp}</strong>, valid for 15 minutes.</p>`
    });
    res.json({ success: true, message: 'OTP resent successfully.' });
    return;
  } catch (error) {
    console.error('Error in resendOTP:', error);
    res.status(500).json({ success: false, message: 'Server error' });
    return;
  }
};

export const logout: RequestHandler = async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("user_id");
  res.json({ success: true, message: 'Logged out successfully.' });
  return;
}
