import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

export const getDistinctAreas = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized - No user context." });
      return;
    }

    const query = `
      SELECT DISTINCT area_namee
      FROM properties
      WHERE area_namee IS NOT NULL
      ORDER BY area_namee;
    `;
    const { rows } = await pool.query(query);

    const areaNames = rows.map((r) => r.area_namee);

    res.status(200).json({ areaNames });
    return;
  } catch (error) {
    console.error("Error fetching distinct area names:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const getDistinctBlocks = async (req: Request, res: Response, nex: NextFunction) => {
    try {

      const user = (req as AuthenticatedRequest).user;
      if (!user){
        res.status(401).json({message: "Unauthorized - No user context."});
        return;
      }

        const query = `
            SELECT DISTINCT block_no
            FROM properties
            WHERE block_no IS NOT NULL
            ORDER BY block_no;
        `;

        const {rows} = await pool.query(query);

        const blockNumbers = rows.map((r) => r.block_no);

        res.status(200).json({blockNumbers});
        return;

    } catch (error) {
        console.error("Error fetching distinct block numbers:", error);
        res.status(500).json({message: "Internal server error"});
        return;
    }

}
