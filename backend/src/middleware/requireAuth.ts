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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      user_id: number;
      role: string;
      iat: number;
      exp: number;
    };

    const query = `SELECT user_id, firm_id, role FROM users WHERE user_id = $1`;
    const { rows } = await pool.query(query, [decoded.user_id]);

    if (rows.length === 0) {
      res.status(404).json({ message: 'User not found in database.' });
      return;
    }

    const userFromDB = rows[0];
    // Attach to req.user
    (req as AuthenticatedRequest).user = {
      user_id: userFromDB.user_id,
      firm_id: userFromDB.firm_id,
      role: userFromDB.role,
    };

    next();
  } catch (error) {
    console.error('JWT or DB lookup failed:', error);
    res.status(401).json({ message: 'Invalid or expired token.' });
    return;
  }
};
