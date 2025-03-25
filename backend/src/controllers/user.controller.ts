import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import { config } from '../config/env';

export const getProfile: RequestHandler = async (req, res) => {
  try {
    // Retrieve token from HTTP-only cookie or Authorization header
    const token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }
    const decoded: any = jwt.verify(token, config.jwtSecret);
    const userResult = await pool.query(
      `SELECT user_id, first_name, last_name, email, real_estate_firm FROM users WHERE user_id = $1`,
      [decoded.user_id]
    );
    if (userResult.rows.length === 0) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.json({ success: true, user: userResult.rows[0] });
    return;
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ success: false, message: "Server error" });
    return;
  }
};

