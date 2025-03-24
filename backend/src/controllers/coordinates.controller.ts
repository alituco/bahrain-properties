import { Request, Response } from 'express';
import { pool } from '../config/db';
import { config } from '../config/env';

export const getCoordinates = async (req: Request, res: Response) => {
  try {
    const { block_no, area_namee } = req.query;

    let baseQuery = `
      SELECT
        p.parcel_no,
        ST_AsGeoJSON(ST_Transform(p.geometry, 4326)) AS geojson,
        v.valuation_date,
        v.valuation_type,
        v.valuation_amount
      FROM properties p
      LEFT JOIN LATERAL (
        SELECT *
        FROM valuations v2
        WHERE v2.parcel_no = p.parcel_no
        ORDER BY v2.valuation_date DESC
        LIMIT 1
      ) v ON TRUE
      WHERE 1=1 
        AND p.nzp_code NOT IN ('PS', 'IS', 'SP', 'UP', 'US', 'FREEZE', 'AGI', 'ARC', 'IST', 'REC', 'S', 'TRN', 'CSA')
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (block_no) {
      baseQuery += ` AND p.block_no = $${paramIndex}`;
      params.push(block_no);
      paramIndex++;
    }

    if (area_namee) {
      baseQuery += ` AND p.area_namee ILIKE $${paramIndex}`;
      params.push(`%${area_namee}%`);
      paramIndex++;
    }

    baseQuery += ';';

    const result = await pool.query(baseQuery, params);

    interface GeojsonFeatureProperties {
        parcel_no: string;
        valuation_date: string | null;
        valuation_type: string | null;
        valuation_amount: number | null;
    }

    interface GeojsonFeature {
        type: 'Feature';
        geometry: any;
        properties: GeojsonFeatureProperties;
    }

    interface GeojsonData {
        type: 'FeatureCollection';
        features: GeojsonFeature[];
    }

            const geojsonData: GeojsonData = {
                type: 'FeatureCollection',
                features: result.rows.map((row: any) => ({
                    type: 'Feature',
                    geometry: JSON.parse(row.geojson),
                    properties: {
                        parcel_no: row.parcel_no,
                        valuation_date: row.valuation_date,
                        valuation_type: row.valuation_type,
                        valuation_amount: row.valuation_amount,
                        // Optional: row.nzp_code
                    },
                })),
            };

    res.json(geojsonData);
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    res.status(500).send('Server error');
  }
};
