import { RequestHandler } from "express";
import { pool }            from "../../../config/db";

/* ────────────────────────────────────────────────────────────────── */
/* Tiny helper – for dynamic WHERE building                          */
const add = (
  val: any,
  clause: string,
  where: string[],
  params: any[],
): void => {
  params.push(val);
  where.push(clause.replace("?", `$${params.length}`));
};

/* =====================================================================
   GET /firms   — public catalogue of firms
===================================================================== */
export const getFirms: RequestHandler = async (_req, res, next) => {
  try {
    const sql = `
      SELECT
        f.firm_id,
        f.firm_name,
        f.logo_url,

        COALESCE(
          (
            SELECT COUNT(*)
              FROM firm_properties fp
             WHERE fp.firm_id = f.firm_id
               AND fp.status  = 'available'      -- public marketplace rule
          ), 0
        ) AS listings_count

      FROM firms f
      ORDER BY f.firm_name;
    `;

    const { rows: firms } = await pool.query(sql);
    res.json({ firms });
  } catch (err) {
    console.error("Error fetching firms:", err);
    next(err);
  }
};


type BedRow  = { bedrooms: number };
type BathRow = { bathrooms: number };
type AreaRow = { area_name: string };
type TypeRow = { property_type: string };

export const getFirmPropertiesPublic: RequestHandler = async (req, res, next) => {
  try {
    const { firmId } = req.params;
    if (!firmId) {
      res.status(400).json({ message: 'Missing firmId parameter.' });
      return;
    }

    const {
      property_type,
      status,
      bedrooms,
      bathrooms,
      minPrice,
      maxPrice,
      area_name,
      sort = '',
    } = req.query as Record<string, string>;

    const where: string[] = [];
    const params: any[] = [];
    const push = (clauseWithQ: string, value: any) => {
      if (value === undefined || value === null || value === '') return;
      params.push(value);
      where.push(clauseWithQ.replace('?', `$${params.length}`));
    };

    // firm + public rule (include both 'available' and 'listed' by default)
    push('fp.firm_id = ?', Number(firmId));
    if (status && ['available', 'listed'].includes(status.toLowerCase())) {
      push('fp.status = ?', status.toLowerCase());
    } else {
      where.push(`(fp.status = 'available' OR fp.status = 'listed')`);
    }

    // filters
    if (property_type) push('fp.property_type = ?', property_type);
    if (bedrooms)      push('fp.bedrooms = ?', Number(bedrooms));
    if (bathrooms)     push('fp.bathrooms = ?', Number(bathrooms));
    if (area_name)     push("COALESCE(u.area_name_en, h.area_name_en, p.area_namee) = ?", area_name);
    if (minPrice)      push('COALESCE(fp.asking_price, fp.rent_price) >= ?', Number(minPrice));
    if (maxPrice)      push('COALESCE(fp.asking_price, fp.rent_price) <= ?', Number(maxPrice));

    const orderBy =
      sort === 'asc'
        ? 'COALESCE(fp.asking_price, fp.rent_price) ASC'
        : sort === 'desc'
        ? 'COALESCE(fp.asking_price, fp.rent_price) DESC'
        : 'fp.updated_at DESC';

    // NOTE:
    //  - properties.geometry is SRID 20439 → transform to 4326 for GeoJSON
    //  - fall back for lat/lon: use properties.longitude/latitude if present,
    //    else centroid(midpoint or geometry) transformed to 4326
    const sql = `
      SELECT
        fp.id,
        fp.property_type,
        fp.listing_type,
        fp.status,
        fp.title,
        fp.asking_price,
        fp.rent_price,
        fp.sold_price,
        fp.bedrooms,
        fp.bathrooms,
        fp.created_at,
        fp.updated_at,

        COALESCE(p.block_no, u.block_no, h.block_no)           AS block_no,
        COALESCE(p.area_namee, u.area_name_en, h.area_name_en) AS area_name,

        COALESCE(
          p.latitude,
          ST_Y(ST_Transform(COALESCE(p.midpoint, ST_Centroid(p.geometry)), 4326))::double precision,
          u.latitude,
          h.latitude
        ) AS latitude,

        COALESCE(
          p.longitude,
          ST_X(ST_Transform(COALESCE(p.midpoint, ST_Centroid(p.geometry)), 4326))::double precision,
          u.longitude,
          h.longitude
        ) AS longitude,

        CASE WHEN fp.property_type = 'land'
          THEN ST_AsGeoJSON(ST_Transform(p.geometry, 4326))
          ELSE NULL
        END AS geojson,

        CASE WHEN fp.property_type = 'land' THEN p.nzp_code  ELSE NULL END AS nzp_code,
        CASE WHEN fp.property_type = 'land'
          THEN COALESCE(p.shape_area, ST_Area(ST_Transform(p.geometry, 4326)::geography))
          ELSE NULL
        END AS shape_area,

        COALESCE(
          (SELECT json_agg(file_url ORDER BY id)
             FROM firm_property_images
            WHERE property_id = fp.id),
          '[]'
        ) AS images

      FROM firm_properties fp
      LEFT JOIN properties       p ON p.parcel_no = fp.parcel_no      -- land
      LEFT JOIN unit_properties  u ON u.unit_id   = fp.unit_id         -- apartment
      LEFT JOIN house_properties h ON h.house_id  = fp.house_id        -- house
      WHERE ${where.join(' AND ')}
      ORDER BY ${orderBy};
    `;

    const { rows: properties } = await pool.query(sql, params);

    const publicStatusClause = `(status = 'available' OR status = 'listed')`;

    const [beds, baths, areas, types] = await Promise.all([
      pool.query<BedRow>(`
        SELECT DISTINCT bedrooms
          FROM firm_properties
         WHERE firm_id = $1 AND ${publicStatusClause} AND bedrooms IS NOT NULL
         ORDER BY bedrooms
      `, [firmId]),
      pool.query<BathRow>(`
        SELECT DISTINCT bathrooms
          FROM firm_properties
         WHERE firm_id = $1 AND ${publicStatusClause} AND bathrooms IS NOT NULL
         ORDER BY bathrooms
      `, [firmId]),
      pool.query<AreaRow>(`
        SELECT DISTINCT COALESCE(u.area_name_en, h.area_name_en, p.area_namee) AS area_name
          FROM firm_properties fp
          LEFT JOIN properties       p ON p.parcel_no = fp.parcel_no
          LEFT JOIN unit_properties  u ON u.unit_id   = fp.unit_id
          LEFT JOIN house_properties h ON h.house_id  = fp.house_id
         WHERE fp.firm_id = $1
           AND (u.area_name_en IS NOT NULL OR h.area_name_en IS NOT NULL OR p.area_namee IS NOT NULL)
           AND (fp.status = 'available' OR fp.status = 'listed')
         ORDER BY area_name
      `, [firmId]),
      pool.query<TypeRow>(`
        SELECT DISTINCT property_type
          FROM firm_properties
         WHERE firm_id = $1 AND ${publicStatusClause}
         ORDER BY property_type
      `, [firmId]),
    ]);

    res.json({
      properties,
      options: {
        bedrooms : beds .rows.map(r => String(r.bedrooms)),
        bathrooms: baths.rows.map(r => String(r.bathrooms)),
        areas    : areas.rows.map(r => r.area_name),
        types    : types.rows.map(r => r.property_type),
      },
    });
  } catch (err) {
    console.error('Error fetching properties for firm:', err);
    next(err);
  }
};
