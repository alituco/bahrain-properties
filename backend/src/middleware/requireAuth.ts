import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ message: 'Missing token cookie.' });
      return;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { user_id: number; role: string };

    // SELECT BOTH columns
    const { rows } = await pool.query(
      `SELECT user_id,
              role,
              firm_id,
              real_estate_firm
         FROM users
        WHERE user_id = $1`,
      [decoded.user_id]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: 'User not found in database.' });
      return;
    }

    const u = rows[0];

    (req as AuthenticatedRequest).user = {
      user_id: u.user_id,
      role: u.role,
      firm_id: u.firm_id,
      real_estate_firm: u.real_estate_firm,
    };

    return next();
  } catch (err) {
    console.error('JWT or DB lookup failed:', err);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
