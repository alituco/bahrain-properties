import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getParcelData = async (req: Request, res: Response) => {
  try {
    const { parcelNo } = req.params;

    const result = await pool.query(`
      SELECT
        parcel_no,
        ewa_edd,
        ewa_wdd,
        roads,
        sewer,
        nzp_code,
        shape_area,
        longitude,
        latitude,
        block_no
      FROM properties
      WHERE parcel_no = $1;
    `, [parcelNo]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Parcel not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching parcel data:', error);
    res.status(500).send('Server error');
  }
};

export const ensureParcel = async (req: Request, res: Response) => {
  try {
    const { parcelNo } = req.params;
    // Possibly call your Flask fetchParcel
    // ...
    // Example response
    return res.json({ success: true });
} catch (error: unknown) {
    console.error('Error in ensureParcel:', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};
