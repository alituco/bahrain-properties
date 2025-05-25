import { Request, Response, NextFunction } from "express";
import { pool } from "../config/db";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

// this is not complete!!! fix the updated and will need some database schema changes to truly reflect tbe period-sensitive data

const pctChange = (curr: number | null, prev: number | null) =>
  prev && prev !== 0 ? ((curr! - prev) / prev) * 100 : null;

const singleNumber = async (sql: string, params: unknown[]) => {
  const { rows } = await pool.query<{ v: string | null }>(sql, params);
  return rows[0]?.v ? Number(rows[0].v) : null;
};

const PERIOD_90 = 90; // days
const PERIOD_30 = 30; // days

// median asking price / ft²
export const getMedianAskingPricePerSqFt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    };

    const firmId = Number(req.params.firmId ?? user.firm_id);

    const baseSql = `
      FROM   firm_properties fp
      JOIN   properties p USING (parcel_no)
      WHERE  fp.firm_id = $1
        AND  fp.status = 'listed'
        AND  fp.asking_price IS NOT NULL
        AND  p.shape_area IS NOT NULL
        AND  fp.updated_at %CONDITION%;
    `;

    /* current 90-day window */
    const currSql = `
      SELECT percentile_cont(0.5) WITHIN GROUP
             (ORDER BY fp.asking_price / (p.shape_area * 10.7639)) AS v
      ${baseSql.replace("%CONDITION%", ">= NOW() - INTERVAL '90 days'")}
    `;

    /* previous 90-day window */
    const prevSql = `
      SELECT percentile_cont(0.5) WITHIN GROUP
             (ORDER BY fp.asking_price / (p.shape_area * 10.7639)) AS v
      ${baseSql.replace(
        "%CONDITION%",
        ">= NOW() - INTERVAL '180 days' AND fp.updated_at < NOW() - INTERVAL '90 days'"
      )}
    `;

    const [current, previous] = await Promise.all([
      singleNumber(currSql, [firmId]),
      singleNumber(prevSql, [firmId]),
    ]);

    res.status(200).json({
      periodDays: PERIOD_90,
      current,
      previous,
      percentChange: pctChange(current, previous),
    });
  } catch (error) {
    console.error("Error fetching median asking psf:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// median sold price / ft²
export const getMedianSoldPricePerSqFt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" })
      return;
    };

    const firmId = Number(req.params.firmId ?? user.firm_id);

    const baseSql = `
      FROM   firm_properties fp
      JOIN   properties p USING (parcel_no)
      WHERE  fp.firm_id = $1
        AND  fp.status = 'sold'
        AND  fp.sold_price IS NOT NULL
        AND  p.shape_area IS NOT NULL
        AND  fp.updated_at %CONDITION%;
    `;

    const currSql = `
      SELECT percentile_cont(0.5) WITHIN GROUP
             (ORDER BY fp.sold_price / (p.shape_area * 10.7639)) AS v
      ${baseSql.replace("%CONDITION%", ">= NOW() - INTERVAL '90 days'")}
    `;
    const prevSql = `
      SELECT percentile_cont(0.5) WITHIN GROUP
             (ORDER BY fp.sold_price / (p.shape_area * 10.7639)) AS v
      ${baseSql.replace(
        "%CONDITION%",
        ">= NOW() - INTERVAL '180 days' AND fp.updated_at < NOW() - INTERVAL '90 days'"
      )}
    `;

    const [current, previous] = await Promise.all([
      singleNumber(currSql, [firmId]),
      singleNumber(prevSql, [firmId]),
    ]);

    res.status(200).json({
      periodDays: PERIOD_90,
      current,
      previous,
      percentChange: pctChange(current, previous),
    });
  } catch (error) {
    console.error("Error fetching median sold psf:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// pipeline counts for last 30 and 60 days
export const getPipelineCounts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" })
      return;
    };

    const firmId = Number(req.params.firmId ?? user.firm_id);

    const countsByWindow = async (where: string) => {
      const sql = `
        SELECT status, COUNT(*)::int AS c
        FROM   firm_properties
        WHERE  firm_id = $1
          AND  ${where}
        GROUP  BY status;
      `;
      const { rows } = await pool.query<{ status: string; c: number }>(sql, [
        firmId,
      ]);
      return rows.reduce<Record<string, number>>((acc, r) => {
        acc[r.status] = r.c;
        return acc;
      }, {});
    };

    const [curr, prev] = await Promise.all([
      countsByWindow("updated_at >= NOW() - INTERVAL '30 days'"),
      countsByWindow(
        "updated_at >= NOW() - INTERVAL '60 days' AND updated_at < NOW() - INTERVAL '30 days'"
      ),
    ]);

    const statuses = Array.from(
      new Set([...Object.keys(curr), ...Object.keys(prev)])
    );

    const merged = statuses.reduce<Record<string, any>>((acc, s) => {
      const current = curr[s] ?? 0;
      const previous = prev[s] ?? 0;
      acc[s] = {
        current,
        previous,
        percentChange: pctChange(current, previous),
      };
      return acc;
    }, {});

    res.status(200).json({ periodDays: PERIOD_30, ...merged });
  } catch (error) {
    console.error("Error fetching pipeline counts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
