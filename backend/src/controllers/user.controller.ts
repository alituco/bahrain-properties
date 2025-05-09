import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import { config } from '../config/env';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import { ensureAdmin } from '../middleware/ensureAdmin';

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
      `SELECT user_id, first_name, last_name, email, real_estate_firm, role FROM users WHERE user_id = $1`,
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


export const getUsersByFirm: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const firmName = user!.real_estate_firm; 

    const { rows } = await pool.query(
      `SELECT user_id,
              first_name,
              last_name,
              email,
              role
         FROM users
        WHERE real_estate_firm = $1
        ORDER BY last_name, first_name`,
      [firmName]
    );

    res.json({ users: rows });
  } catch (err) {
    next(err);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const admin = (req as AuthenticatedRequest).user!;
    if (admin.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    const { userId } = req.params;
    const { rows } = await pool.query(
      `DELETE FROM users
         WHERE user_id = $1 AND firm_id = $2
         RETURNING user_id, email`,
      [userId, admin.firm_id]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted', user: rows[0] });
  } catch (err) {
    next(err);
  }
};