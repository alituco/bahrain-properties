/* ------------------------------------------------------------------
   PUBLIC — Marketplace “Residential”  (apartments + houses)
-------------------------------------------------------------------*/
import { RequestHandler } from 'express';
import { pool }           from '../../config/db';

/* utility to append a dynamic clause -------------------------------- */
const add = (
  val: any, clause: string, where: string[], params: any[],
) => {
  params.push(val);
  where.push(clause.replace('?', `$${params.length}`));
};

/* option-set row shapes (for filter drop-downs) --------------------- */
interface BedRow  { bedrooms  : number }
interface BathRow { bathrooms : number }
interface AreaRow { area_name : string }

/* ===================================================================
   GET  /marketplace/residential
   → list every “available” apartment **and** house, with filters
=================================================================== */
export const getListedResidential: RequestHandler = async (req, res, next) => {
  try {
    const {
      type,                        // 'apartment' | 'house'
      listing_type,                // 'sale' | 'rent'
      bedrooms, bathrooms, area_name,
      minPrice,  maxPrice,
      sort = '',                   // '' | 'asc' | 'desc'
    } = req.query as Record<string, string>;

    /* ---------- WHERE clause assembly ------------------------ */
    const where:  string[] = [
      "fp.status = 'available'",
      "fp.property_type IN ('apartment','house')",
    ];
    const params: any[] = [];

    if (type)         add(type,         'fp.property_type = ?', where, params);
    if (listing_type) add(listing_type, 'fp.listing_type  = ?', where, params);
    if (bedrooms)     add(+bedrooms,    'fp.bedrooms      = ?', where, params);
    if (bathrooms)    add(+bathrooms,   'fp.bathrooms     = ?', where, params);
    if (area_name)    add(area_name,
                          'COALESCE(u.area_name_en, h.area_name_en) = ?',
                          where, params);
    if (minPrice)     add(minPrice,
                          'COALESCE(fp.asking_price, fp.rent_price) >= ?',
                          where, params);
    if (maxPrice)     add(maxPrice,
                          'COALESCE(fp.asking_price, fp.rent_price) <= ?',
                          where, params);

    /* ---------- main SELECT ---------------------------------- */
    const sql = `
      SELECT fp.id,
             fp.property_type,
             fp.title,
             fp.listing_type,
             fp.asking_price,
             fp.rent_price,
             fp.bedrooms,
             fp.bathrooms,
             COALESCE(u.area_name_en, h.area_name_en) AS area_name,
             COALESCE(u.latitude    , h.latitude   ) AS latitude,
             COALESCE(u.longitude   , h.longitude  ) AS longitude,

             /* all images (oldest → newest) ------------------- */
             COALESCE(
               (SELECT json_agg(file_url ORDER BY id)
                  FROM firm_property_images
                 WHERE property_id = fp.id),
               '[]'
             ) AS images

      FROM   firm_properties fp
      LEFT   JOIN unit_properties  u ON u.unit_id  = fp.unit_id   -- apartments
      LEFT   JOIN house_properties h ON h.house_id = fp.house_id  -- houses
      WHERE  ${where.join(' AND ')}
      ORDER  BY ${
        sort === 'asc'  ? 'COALESCE(fp.asking_price, fp.rent_price) ASC'  :
        sort === 'desc' ? 'COALESCE(fp.asking_price, fp.rent_price) DESC' :
                          'fp.updated_at DESC'
      };
    `;

    const { rows: listings } = await pool.query(sql, params);

    /* ---------- option-sets for the filter bar ---------------- */
    const [beds, baths, areas] = await Promise.all([
      pool.query<BedRow>(`
        SELECT DISTINCT bedrooms
          FROM firm_properties
         WHERE property_type IN ('apartment','house')
         ORDER  BY bedrooms;
      `),
      pool.query<BathRow>(`
        SELECT DISTINCT bathrooms
          FROM firm_properties
         WHERE property_type IN ('apartment','house')
         ORDER  BY bathrooms;
      `),
      pool.query<AreaRow>(`
        SELECT DISTINCT area_name
          FROM (
            SELECT COALESCE(area_name_en, area_name_ar) AS area_name
              FROM unit_properties
            UNION
            SELECT COALESCE(area_name_en, area_name_ar) AS area_name
              FROM house_properties
          ) AS t
         WHERE area_name IS NOT NULL
         ORDER  BY area_name;
      `),
    ]);

    /* ---------- response ------------------------------------- */
    res.json({
      listings,
      options: {
        bedrooms : beds .rows.map(b => String(b.bedrooms)),
        bathrooms: baths.rows.map(b => String(b.bathrooms)),
        areas    : areas.rows.map(a => a.area_name),
        types    : ['apartment', 'house'],
        deals    : ['sale', 'rent'],        // for “Buy / Rent” select
      },
    });
  } catch (err) {
    console.error('Error fetching residential listings:', err);
    next(err);
  }
};

/* ===================================================================
   GET  /marketplace/residential/:id
   → detail for a single apartment **or** house
=================================================================== */
export const getResidentialById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT fp.*,

             /* unit- vs house-specific extras ------------------- */
             u.floor, u.size_m2,
             h.floors, h.plot_size_m2, h.built_up_m2,

             COALESCE(u.area_name_en, h.area_name_en) AS area_name,
             COALESCE(u.block_no    , h.block_no    ) AS block_no,
             COALESCE(u.latitude    , h.latitude    ) AS latitude,
             COALESCE(u.longitude   , h.longitude   ) AS longitude,

             /* images ------------------------------------------ */
             COALESCE(
               (SELECT json_agg(file_url ORDER BY id)
                  FROM firm_property_images
                 WHERE property_id = fp.id),
               '[]'
             ) AS images,

             /* contact ----------------------------------------- */
             CONCAT(us.first_name,' ',us.last_name) AS realtor_name,
             us.phone_number,
             us.email,
             COALESCE(f.firm_name, us.real_estate_firm, '') AS firm_name

      FROM   firm_properties fp
      LEFT   JOIN unit_properties  u ON u.unit_id  = fp.unit_id
      LEFT   JOIN house_properties h ON h.house_id = fp.house_id
      JOIN   users            us ON us.user_id = fp.user_id
      LEFT   JOIN firms        f ON f.firm_id  = us.firm_id
      WHERE  fp.id = $1
        AND  fp.property_type IN ('apartment','house')
      LIMIT 1;
    `;

    const { rows } = await pool.query(sql, [id]);

    if (!rows.length) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json({ listing: rows[0] });
  } catch (err) { next(err); }
};
