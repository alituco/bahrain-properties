import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";
import { config } from "../config/env";

/**
 * Helper to issue auth cookie
 */
function issueTokenCookie(res: any, user_id: number) {
  const token = jwt.sign({ user_id }, config.jwtSecret, { expiresIn: "1d" });
  // httpOnly keeps JS from reading it; adjust sameSite/secure for your deployment
  res.cookie("token", token, { httpOnly: true, maxAge: 864e5 });
  return token;
}

/* =========================================================
 * LOGIN — no OTP, (reCAPTCHA temporarily disabled) + password check -> token
 * ========================================================= */
export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  // reCAPTCHA temporarily disabled

  try {
    const u = await pool.query(
      `SELECT user_id, password FROM users WHERE email = $1 LIMIT 1`,
      [email]
    );
    if (!u.rowCount || !(await bcrypt.compare(password, u.rows[0].password))) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const token = issueTokenCookie(res, u.rows[0].user_id);
    res.json({ success: true, message: "Logged in", token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================================================
 * These OTP-related endpoints now do nothing (no-ops)
 * ========================================================= */
export const resendLoginOTP: RequestHandler = async (_req, res) => {
  res.json({ success: true, message: "OTP not required" });
};

export const verifyOTP: RequestHandler = async (_req, res) => {
  res.json({ success: true, message: "OTP not required" });
};

/* =========================================================
 * REGISTER — no OTP; create user immediately and log in
 * ========================================================= */
export const register: RequestHandler = async (req, res) => {
  const { first_name, last_name, email, password, login_code } = req.body;

  // reCAPTCHA temporarily disabled

  try {
    // Validate firm via login_code and capacity
    const firmQ = await pool.query(
      `SELECT f.firm_id,
              f.firm_name,
              pt.max_number_of_users
         FROM firms f
         JOIN plan_tiers pt ON f.plan = pt.tier_name
        WHERE f.login_code = $1
        LIMIT 1`,
      [login_code]
    );
    if (!firmQ.rowCount) {
      res.status(400).json({ success: false, message: "Invalid registration code." });
      return;
    }
    const firm = firmQ.rows[0];

    // Enforce user cap
    const cntQ = await pool.query(
      `SELECT COUNT(*)::int AS c FROM users WHERE firm_id = $1`,
      [firm.firm_id]
    );
    if (cntQ.rows[0].c >= firm.max_number_of_users) {
      res.status(400).json({ success: false, message: "Firm user limit reached." });
      return;
    }

    // Email uniqueness
    const exists = await pool.query(
      `SELECT 1 FROM users WHERE email = $1 LIMIT 1`,
      [email]
    );
    if (exists.rowCount) {
      res.status(400).json({ success: false, message: "Email already verified; please log in." });
      return;
    }

    // Hash password and create user immediately
    const hash = await bcrypt.hash(password, 10);
    const u = await pool.query(
      `INSERT INTO users
         (first_name, last_name, phone_number, email, password,
          real_estate_firm, firm_id, role, "isVerified")
       VALUES
         ($1,$2,'N/A',$3,$4,$5,$6,'staff',TRUE)
       RETURNING user_id`,
      [first_name, last_name, email, hash, firm.firm_name, firm.firm_id]
    );

    const userId = u.rows[0].user_id;
    const token = issueTokenCookie(res, userId);

    res.json({ success: true, message: "Account created", token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================================================
 * Registration OTP endpoints are no-ops now
 * ========================================================= */
export const verifyRegisterOTP: RequestHandler = async (_req, res) => {
  res.json({ success: true, message: "Registration OTP not required" });
};

export const resendRegisterOTP: RequestHandler = async (_req, res) => {
  res.json({ success: true, message: "Registration OTP not required" });
};

/* =========================================================
 * LOGOUT
 * ========================================================= */
export const logout: RequestHandler = (_req, res) => {
  res.clearCookie("token");
  res.clearCookie("otp_user");
  res.clearCookie("reg_id");
  res.json({ success: true, message: "Logged out" });
};
