import { Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DB_URL });

const pctChange = (curr: number | null, prev: number | null) =>
  prev && prev !== 0 ? ((curr! - prev) / prev) * 100 : null;

const singleNumber = async (sql: string, params: unknown[]) => {
  const { rows } = await pool.query<{ v: string | null }>(sql, params);
  return rows[0]?.v ? Number(rows[0].v) : null;
};

const PERIOD_90 = 90; // 3-month medians
const PERIOD_30 = 30; // 1-month pipeline snapshot

export default class FirmSpecificDataController {
  static async medianAskingPricePerSqFt(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const firmId = Number(req.params.firmId);

      const baseSql = `
        FROM   firm_properties fp
        JOIN   properties p USING (parcel_no)
        WHERE  fp.firm_id = $1
          AND  fp.status = 'listed'
          AND  fp.asking_price IS NOT NULL
          AND  p.shape_area IS NOT NULL
          AND  fp.updated_at %CONDITION%;
      `;

      /* current window: last 90 days */
      const currSql = `
        SELECT percentile_cont(0.5) WITHIN GROUP
               (ORDER BY fp.asking_price / p.shape_area * 10.7639) AS v
        ${baseSql.replace('%CONDITION%', '>= NOW() - INTERVAL \'90 days\'')}
      `;
      /* previous window: 90-180 days ago */
      const prevSql = `
        SELECT percentile_cont(0.5) WITHIN GROUP
               (ORDER BY fp.asking_price / p.shape_area * 10.7639) AS v
        ${baseSql.replace(
          '%CONDITION%',
          '>= NOW() - INTERVAL \'180 days\' AND fp.updated_at < NOW() - INTERVAL \'90 days\''
        )}
      `;

      const [curr, prev] = await Promise.all([
        singleNumber(currSql, [firmId]),
        singleNumber(prevSql, [firmId]),
      ]);

      res.json({
        periodDays: PERIOD_90,
        current: curr,
        previous: prev,
        percentChange: pctChange(curr, prev),
      });
    } catch (err) {
      next(err);
    }
  }

  static async medianSoldPricePerSqFt(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const firmId = Number(req.params.firmId);

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
               (ORDER BY fp.sold_price / p.shape_area * 10.7639) AS v
        ${baseSql.replace('%CONDITION%', '>= NOW() - INTERVAL \'90 days\'')}
      `;
      const prevSql = `
        SELECT percentile_cont(0.5) WITHIN GROUP
               (ORDER BY fp.sold_price / p.shape_area * 10.7639) AS v
        ${baseSql.replace(
          '%CONDITION%',
          '>= NOW() - INTERVAL \'180 days\' AND fp.updated_at < NOW() - INTERVAL \'90 days\''
        )}
      `;

      const [curr, prev] = await Promise.all([
        singleNumber(currSql, [firmId]),
        singleNumber(prevSql, [firmId]),
      ]);

      res.json({
        periodDays: PERIOD_90,
        current: curr,
        previous: prev,
        percentChange: pctChange(curr, prev),
      });
    } catch (err) {
      next(err);
    }
  }

  static async pipelineCounts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const firmId = Number(req.params.firmId);

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

      const allStatuses = Array.from(new Set([...Object.keys(curr), ...Object.keys(prev)]));

      const merged = allStatuses.reduce<Record<string, any>>((acc, status) => {
        const current = curr[status] ?? 0;
        const previous = prev[status] ?? 0;
        acc[status] = {
          current,
          previous,
          percentChange: pctChange(current, previous),
        };
        return acc;
      }, {});

      res.json({ periodDays: PERIOD_30, ...merged });
    } catch (err) {
      next(err);
    }
  }
}
