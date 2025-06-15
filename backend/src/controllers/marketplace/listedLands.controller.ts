/* ------------------------------------------------------------------
   GET /land  –  listed land + full option lists
   -----------------------------------------------------------------*/
import { RequestHandler } from 'express';
import { pool }           from '../../config/db';

/* helper -----------------------------------------------------------*/
const add = (
  val: any,
  clause: string,
  where: string[],
  params: any[],
) => {
  params.push(val);
  where.push(clause.replace('?', `$${params.length}`));
};

/* row‐shapes for the option look-ups ------------------------------ */
interface CodeRow { nzp_code  : string }
interface GovRow  { min_min_go: string }
interface LocRow  { area_namee: string }

export const getListedLand: RequestHandler = async (req, res, next) => {
  try {
    const {
      nzp_code, governorate, location,
      minPrice, maxPrice, minArea, maxArea, sort,
    } = req.query as Record<string, string>;

    /* -------------------- main land query ----------------------- */
    const where: string[] = [
      "fp.status = 'listed'",
      "fp.property_type = 'land'",
    ];
    const params: any[] = [];

    if (nzp_code   ) add(nzp_code,    'p.nzp_code    = ?', where, params);
    if (governorate) add(governorate, 'p.min_min_go  = ?', where, params);
    if (location   ) add(location,    'p.area_namee  = ?', where, params);
    if (minPrice   ) add(minPrice,    'fp.asking_price >= ?', where, params);
    if (maxPrice   ) add(maxPrice,    'fp.asking_price <= ?', where, params);
    if (minArea    ) add(minArea,     'p.shape_area   >= ?', where, params);
    if (maxArea    ) add(maxArea,     'p.shape_area   <= ?', where, params);

    const landSql = `
      SELECT fp.id,
             fp.parcel_no,
             fp.title,
             fp.asking_price,
             p.longitude,
             p.latitude,
             p.shape_area,
             p.nzp_code,
             p.min_min_go   AS governorate,
             p.area_namee,
             ST_AsGeoJSON(ST_Transform(p.geometry,4326)) AS geojson
        FROM firm_properties fp
   LEFT JOIN properties p ON p.parcel_no = fp.parcel_no
       WHERE ${where.join(' AND ')}
      ORDER BY ${
        sort === 'asc'  ? 'fp.asking_price ASC'  :
        sort === 'desc' ? 'fp.asking_price DESC' :
                          'fp.updated_at DESC'
      };
    `;
    const { rows: land } = await pool.query(landSql, params);

    /* -------------------- full option lists --------------------- */
    const [codes, govs, locs] = await Promise.all([
      pool.query<CodeRow>("SELECT DISTINCT nzp_code   FROM properties WHERE nzp_code   IS NOT NULL ORDER BY nzp_code"),
      pool.query<GovRow >("SELECT DISTINCT min_min_go FROM properties WHERE min_min_go IS NOT NULL ORDER BY min_min_go"),
      pool.query<LocRow >("SELECT DISTINCT area_namee FROM properties WHERE area_namee IS NOT NULL ORDER BY area_namee"),
    ]);

    const options = {
      classifications: codes.rows.map(r => r.nzp_code),
      governorates   : govs.rows.map(r => r.min_min_go),
      locations      : locs.rows.map(r => r.area_namee),
    };

    res.json({ land, options });
  } catch (err) {
    console.error('Error fetching listed land:', err);
    next(err);
  }
};
