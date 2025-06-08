import { RequestHandler } from 'express';
import { pool } from '../config/db';

export const getListedLand: RequestHandler = async (_req, res, next) => {
  try {
    const sql = `
      SELECT id, parcel_no, title, asking_price, latitude, longitude
        FROM firm_properties
       WHERE status        = 'listed'
         AND property_type = 'land'
       ORDER BY updated_at DESC
    `;
    const { rows } = await pool.query(sql);
    res.json({ land: rows });
  } catch (err) {
    next(err);
  }
};
