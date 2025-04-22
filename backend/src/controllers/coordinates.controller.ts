import { Request, Response, NextFunction, RequestHandler } from "express";
import { pool } from "../config/db";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

// GET /coordinates
export const getCoordinates: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    /* ------------------------------------------------------------------ */
    /* user context                                                        */
    /* ------------------------------------------------------------------ */
    const { user } = req as AuthenticatedRequest;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    /* ------------------------------------------------------------------ */
    /* query‑string params                                                 */
    /* ------------------------------------------------------------------ */
    const {
      block_no,
      area_namee,
      min_min_go,
      minSize: minSizeRaw,
      maxSize: maxSizeRaw,
    } = req.query as Record<string, string>;

    const minSize = minSizeRaw ? Number(minSizeRaw) : undefined;
    const maxSize = maxSizeRaw ? Number(maxSizeRaw) : undefined;

    /* apply size range **only** if any “real” filter is selected -------- */
    const hasPrimary = !!block_no || !!area_namee || !!min_min_go;

    /* ------------------------------------------------------------------ */
    /* dynamic SQL construction                                            */
    /* ------------------------------------------------------------------ */
    const params: Array<string | number> = [user.firm_id];
    let idx = 2;

    let sql = `
      SELECT
        p.parcel_no,
        ST_AsGeoJSON(ST_Transform(p.geometry,4326)) AS geojson,
        p.shape_area                              AS size_m2,
        v.valuation_date,
        v.valuation_type,
        v.valuation_amount,
        CASE WHEN fp.id IS NOT NULL THEN TRUE ELSE FALSE END AS firm_saved
      FROM properties p
      /* most‑recent valuation per parcel -------------------------------- */
      LEFT JOIN LATERAL (
        SELECT *
          FROM valuations v2
         WHERE v2.parcel_no = p.parcel_no
      ORDER BY v2.valuation_date DESC
         LIMIT 1
      ) v ON TRUE
      /* does this parcel belong to the user’s firm? --------------------- */
      LEFT JOIN firm_properties fp
             ON fp.parcel_no = p.parcel_no
            AND fp.firm_id   = $1
      WHERE p.nzp_code NOT IN ('PS','IS','SP','UP','US','FREEZE',
                               'AGI','ARC','IST','REC','S','TRN','CSA')
    `;

    if (block_no) {
      sql += ` AND p.block_no = $${idx}`;
      params.push(block_no);
      idx++;
    }
    if (area_namee) {
      sql += ` AND p.area_namee ILIKE $${idx}`;
      params.push(`%${area_namee}%`);
      idx++;
    }
    if (min_min_go) {
      sql += ` AND p.min_min_go ILIKE $${idx}`;
      params.push(`%${min_min_go}%`);
      idx++;
    }

    if (hasPrimary) {
      if (minSize !== undefined) {
        sql += ` AND p.shape_area >= $${idx}`;
        params.push(minSize);
        idx++;
      }
      if (maxSize !== undefined) {
        sql += ` AND p.shape_area <= $${idx}`;
        params.push(maxSize);
        idx++;
      }
    }

    sql += ";";

    /* ------------------------------------------------------------------ */
    /* DB query & GeoJSON assembly                                         */
    /* ------------------------------------------------------------------ */
    const { rows } = await pool.query(sql, params);

    const geojson = {
      type: "FeatureCollection" as const,
      features: rows.map((r) => ({
        type: "Feature" as const,
        geometry: JSON.parse(r.geojson),
        properties: {
          parcel_no:        r.parcel_no,
          valuation_date:   r.valuation_date,
          valuation_type:   r.valuation_type,
          valuation_amount: r.valuation_amount,
          firm_saved:       r.firm_saved,
          size_m2:          r.size_m2,          // ← comes from shape_area
        },
      })),
    };

    res.json(geojson);
  } catch (err) {
    console.error("Error fetching coordinates:", err);
    next(err);
  }
};
