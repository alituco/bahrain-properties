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
        block_no,
        area_namee,
        ST_AsGeoJSON(geometry) AS geojson
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

export const getParcelGeoData = async (req: Request, res: Response) => {
  try {
    const { parcelNo } = req.params;
    // Note the use of ST_AsGeoJSON(geometry) to get the full polygon shape
    const result = await pool.query(
      `
      SELECT
        parcel_no,
        ST_AsGeoJSON(ST_Transform(geometry, 4326)) AS geojson,
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
      `,
      [parcelNo]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Parcel not found" });
      return;
    }
    const row = result.rows[0];
    // Build a GeoJSON Feature using the polygon geometry
    const feature = {
      type: "Feature",
      geometry: JSON.parse(row.geojson), // Parse the returned GeoJSON string
      properties: {
        ...row,
      },
    };

    res.json(feature);
  } catch (error) {
    console.error("Error fetching parcel geo data:", error);
    res.status(500).send("Server error");
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
