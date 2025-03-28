import { RequestHandler, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

// GET /coordinates
export const getCoordinates: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized - No user context.' });
      return;
    }

    const { block_no, area_namee, min_min_go } = req.query;
    const firmId = user.firm_id;

    let baseQuery = `
      SELECT
        p.parcel_no,
        ST_AsGeoJSON(ST_Transform(p.geometry, 4326)) AS geojson,
        v.valuation_date,
        v.valuation_type,
        v.valuation_amount,
        CASE WHEN fp.id IS NOT NULL THEN true ELSE false END AS firm_saved
      FROM properties p
      LEFT JOIN LATERAL (
        SELECT *
        FROM valuations v2
        WHERE v2.parcel_no = p.parcel_no
        ORDER BY v2.valuation_date DESC
        LIMIT 1
      ) v ON TRUE
      LEFT JOIN firm_properties fp
             ON fp.parcel_no = p.parcel_no
            AND fp.firm_id = $1
      WHERE 1=1
        AND p.nzp_code NOT IN ('PS', 'IS', 'SP', 'UP', 'US', 'FREEZE', 'AGI', 'ARC', 'IST', 'REC', 'S', 'TRN', 'CSA')
    `;

    const params: any[] = [firmId];
    let paramIndex = 2;

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

    if (min_min_go) {
      baseQuery += ` AND p.min_min_go ILIKE $${paramIndex}`;
      params.push(`%${min_min_go}%`);
      paramIndex++;
    }

    baseQuery += ';';
    const result = await pool.query(baseQuery, params);

    interface GeojsonFeatureProperties {
      parcel_no: string;
      valuation_date: string | null;
      valuation_type: string | null;
      valuation_amount: number | null;
      firm_saved?: boolean;
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
          firm_saved: row.firm_saved,
        },
      })),
    };

    res.json(geojsonData);
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    res.status(500).send('Server error');
  }
};
