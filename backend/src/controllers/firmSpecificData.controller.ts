import { Request, Response } from "express";
import { pool } from "../config/db";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

const pctChange = (curr: number | null, prev: number | null) => {
  if (prev == null) return null;              
  if (prev === 0)  return curr ? 100 : 0;     
  return ((curr! - prev) / prev) * 100;
};

const singleNumber = async (sql: string, params: unknown[]) => {
  const { rows } = await pool.query<{ v: string | null }>(sql, params);
  return rows[0]?.v ? Number(rows[0].v) : null;
};

const PERIOD_90 = 90;   // days
const PERIOD_30 = 30;

export const getMedianAskingPricePerSqFt = async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  };

  const firmId = Number(req.params.firmId ?? user.firm_id);

  const base = `
    FROM   firm_properties fp
    JOIN   properties p USING (parcel_no)
    WHERE  fp.firm_id       = $1
      AND  fp.status        = 'listed'
      AND  fp.asking_price IS NOT NULL
      AND  p.shape_area    IS NOT NULL
      AND  fp.updated_at  %C%;
  `;

  const sqlCurr = `
    SELECT percentile_cont(0.5) WITHIN GROUP
           (ORDER BY fp.asking_price / (p.shape_area * 10.7639)) AS v
    ${base.replace("%C%"," >= NOW() - INTERVAL '90 days'")}
  `;
  const sqlPrev = `
    SELECT percentile_cont(0.5) WITHIN GROUP
           (ORDER BY fp.asking_price / (p.shape_area * 10.7639)) AS v
    ${base.replace("%C%"," >= NOW() - INTERVAL '180 days' AND fp.updated_at < NOW() - INTERVAL '90 days'")}
  `;

  const [current, previous] = await Promise.all([
    singleNumber(sqlCurr,[firmId]),
    singleNumber(sqlPrev,[firmId]),
  ]);

  res.json({ periodDays: PERIOD_90, current, previous, percentChange: pctChange(current,previous) });
};


export const getVolumeSoldSeries = async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  };

  const firmId = Number(req.params.firmId ?? user.firm_id);

  /* ---------------- parameters ---------------- */
  const start = req.query.start as string | undefined;   // YYYY-MM-DD
  const end   = req.query.end   as string | undefined;   // YYYY-MM-DD

  // default range: last 24 months
  const sqlRange = `
    AND fp.sold_date >= COALESCE($2, NOW() - INTERVAL '24 months')
    AND fp.sold_date <  COALESCE($3, NOW())
  `;

  /* ---------------- query ---------------- */
  const sql = `
    WITH periodized AS (
      SELECT
        date_trunc('month', sold_date)
          - (EXTRACT(month FROM sold_date)::int % 3) * INTERVAL '1 month'
            AS period_start,
        sold_price
      FROM   firm_properties fp
      WHERE  fp.firm_id    = $1
        AND  fp.status     = 'sold'
        AND  fp.sold_price IS NOT NULL
        AND  fp.sold_date  IS NOT NULL
        ${sqlRange}
    )
    SELECT period_start::date,
           SUM(sold_price)::numeric AS volume_bhd
    FROM   periodized
    GROUP  BY period_start
    ORDER  BY period_start;
  `;

  const { rows } = await pool.query(sql, [firmId, start ?? null, end ?? null]);

  /* shape for the frontend */
  // [{period_start: '2024-01-01', volume_bhd: 250000}, …]
  res.json({ periodDays: 90, series: rows });
};

export const getMedianSoldPricePerSqFt = async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  };

  const firmId = Number(req.params.firmId ?? user.firm_id);

  const base = `
    FROM   firm_properties fp
    JOIN   properties p USING (parcel_no)
    WHERE  fp.firm_id    = $1
      AND  fp.status     = 'sold'
      AND  fp.sold_price IS NOT NULL
      AND  p.shape_area  IS NOT NULL
      AND  fp.sold_date %C%;
  `;

  const sqlCurr = `
    SELECT percentile_cont(0.5) WITHIN GROUP
           (ORDER BY fp.sold_price / (p.shape_area * 10.7639)) AS v
    ${base.replace("%C%"," >= NOW() - INTERVAL '90 days'")}
  `;
  const sqlPrev = `
    SELECT percentile_cont(0.5) WITHIN GROUP
           (ORDER BY fp.sold_price / (p.shape_area * 10.7639)) AS v
    ${base.replace("%C%"," >= NOW() - INTERVAL '180 days' AND fp.sold_date < NOW() - INTERVAL '90 days'")}
  `;

  const [current, previous] = await Promise.all([
    singleNumber(sqlCurr,[firmId]),
    singleNumber(sqlPrev,[firmId]),
  ]);

  res.json({ periodDays: PERIOD_90, current, previous, percentChange: pctChange(current,previous) });
};


export const getPipelineCounts = async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  };

  const firmId = Number(req.params.firmId ?? user.firm_id);

  const dateExpr = `(CASE WHEN status='sold'
                          THEN COALESCE(sold_date, updated_at)
                          ELSE updated_at END)`;

  const counts = async (window: string) => {
    const sql = `
      SELECT status, COUNT(*)::int AS c
      FROM   firm_properties
      WHERE  firm_id = $1
        AND  ${dateExpr} ${window}
      GROUP  BY status;
    `;
    const { rows } = await pool.query(sql, [firmId]);
    return Object.fromEntries(rows.map(row => [row.status, row.c]));
  };

  const [curr, prev] = await Promise.all([
    counts(">= NOW() - INTERVAL '30 days'"),
    counts(">= NOW() - INTERVAL '60 days' AND " + dateExpr + " < NOW() - INTERVAL '30 days'")
  ]);

  const statuses = Array.from(new Set([...Object.keys(curr), ...Object.keys(prev)]));
  const payload: Record<string, any> = { periodDays: PERIOD_30 };

  statuses.forEach(s => {
    const current  = curr[s] ?? 0;
    const previous = prev[s] ?? 0;
    payload[s] = { current, previous, percentChange: pctChange(current,previous) };
  });

  res.json(payload);
};
