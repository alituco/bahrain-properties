/* ------------------------------------------------------------------
   Public-marketplace – HOUSES
   GET /house         → list “available” houses (+ filter options)
   GET /house/:id     → single-house detail
-------------------------------------------------------------------*/
import { RequestHandler } from 'express';
import { pool }           from '../../config/db';

/* tiny helper to build parametrised WHERE */
const add = (val: any, clause: string, where: string[], params: any[]) => {
  params.push(val);
  where.push(clause.replace('?', `$${params.length}`));
};

/* for filter-drop-down option sets */
interface BedRow  { bedrooms  : number }
interface BathRow { bathrooms : number }
interface AreaRow { area_name : string }

/* ================================================================
   GET /house   — list “available” houses
================================================================ */
export const getListedHouses: RequestHandler = async (req, res, next) => {
  try {
    const {
      bedrooms , bathrooms , area_name,
      minPrice , maxPrice  , sort = '',
    } = req.query as Record<string, string>;

    /* ---------- dynamic WHERE ---------------------------------- */
    const where  : string[] = [
      "fp.status = 'available'",
      "fp.property_type = 'house'",
    ];
    const params : any[] = [];

    if (bedrooms ) add(+bedrooms , 'fp.bedrooms  = ?', where, params);
    if (bathrooms) add(+bathrooms, 'fp.bathrooms = ?', where, params);
    if (area_name) add(area_name , 'h.area_name_en = ?', where, params);
    if (minPrice ) add(minPrice  , 'COALESCE(fp.asking_price, fp.rent_price) >= ?', where, params);
    if (maxPrice ) add(maxPrice  , 'COALESCE(fp.asking_price, fp.rent_price) <= ?', where, params);

    /* ---------- main SELECT ------------------------------------ */
    const sql = `
      SELECT fp.id,
             fp.title,
             fp.listing_type,
             fp.asking_price,
             fp.rent_price,
             fp.bedrooms,
             fp.bathrooms,
             h.area_name_en                         AS area_name,
             h.floors,
             h.plot_size_m2,
             h.parking_spots,

             /* --- images -------------------------------------- */
             COALESCE(
               (SELECT json_agg(file_url ORDER BY id)
                  FROM firm_property_images
                 WHERE property_id = fp.id),
               '[]'
             ) AS images,

             /* --- amenities array (TRUE flags only) ----------- */
             COALESCE(amen.amenities, '[]')         AS amenities

      FROM   firm_properties  fp
      JOIN   house_properties h  ON h.house_id  = fp.house_id
      LEFT   JOIN house_amenities ha ON ha.house_id = h.house_id

      /* — LATERAL: convert boolean cols to text array — */
      LEFT JOIN LATERAL (
        SELECT json_agg(name) AS amenities
        FROM (
          VALUES
            ('private_pool'     , ha.private_pool),
            ('private_garden'   , ha.private_garden),
            ('rooftop_terrace'  , ha.rooftop_terrace),
            ('maid_room'        , ha.maid_room),
            ('study'            , ha.study),
            ('central_ac'       , ha.central_ac),
            ('fireplace'        , ha.fireplace),
            ('solar_panels'     , ha.solar_panels),
            ('balcony'          , ha.balcony),
            ('walk_in_closet'   , ha.walk_in_closet),
            ('kitchen_appliances',ha.kitchen_appliances),
            ('security_system'  , ha.security_system),
            ('pets_allowed'     , ha.pets_allowed)
        ) AS v(name, flag)
        WHERE flag
      ) amen ON TRUE

      WHERE ${where.join(' AND ')}
      ORDER BY ${
        sort === 'asc'  ? 'COALESCE(fp.asking_price,fp.rent_price) ASC'
      : sort === 'desc' ? 'COALESCE(fp.asking_price,fp.rent_price) DESC'
                        : 'fp.updated_at DESC'}
    `;

    const { rows: houses } = await pool.query(sql, params);

    /* ---------- option sets (for filters) --------------------- */
    const [beds, baths, areas] = await Promise.all([
      pool.query<BedRow >(`
        SELECT DISTINCT bedrooms
          FROM firm_properties
         WHERE property_type = 'house'
         ORDER BY bedrooms
      `),
      pool.query<BathRow>(`
        SELECT DISTINCT bathrooms
          FROM firm_properties
         WHERE property_type = 'house'
         ORDER BY bathrooms
      `),
      pool.query<AreaRow>(`
        SELECT DISTINCT area_name_en AS area_name
          FROM house_properties
         WHERE area_name_en IS NOT NULL
         ORDER BY area_name_en
      `),
    ]);

    res.json({
      houses,
      options: {
        bedrooms : beds .rows.map(r => String(r.bedrooms)),
        bathrooms: baths.rows.map(r => String(r.bathrooms)),
        areas    : areas.rows.map(r => r.area_name),
      },
    });
  } catch (err) {
    console.error('Error fetching listed houses:', err);
    next(err);
  }
};

/* ================================================================
   GET /house/:id   — single-house detail
================================================================ */
export const getHouseById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT fp.id,
             fp.title,
             fp.description,
             fp.listing_type,
             fp.asking_price,
             fp.rent_price,
             fp.status,
             fp.bedrooms,
             fp.bathrooms,

             h.floors,
             h.plot_size_m2,
             h.built_up_m2,
             h.parking_spots,
             h.area_name_en                     AS area_name,
             h.block_no,
             h.latitude,
             h.longitude,

             /* --- images -------------------------------------- */
             COALESCE(
               (SELECT json_agg(file_url ORDER BY id)
                  FROM firm_property_images
                 WHERE property_id = fp.id),
               '[]'
             ) AS images,

             /* --- amenities array ----------------------------- */
             COALESCE(amen.amenities, '[]')      AS amenities,

             /* --- contact ------------------------------------- */
             CONCAT(us.first_name,' ',us.last_name) AS realtor_name,
             us.phone_number,
             us.email,
             COALESCE(f.firm_name, us.real_estate_firm, '') AS firm_name

      FROM   firm_properties fp
      JOIN   house_properties h ON h.house_id  = fp.house_id
      JOIN   users            us ON us.user_id = fp.user_id
      LEFT   JOIN firms        f ON f.firm_id  = us.firm_id
      LEFT   JOIN house_amenities ha ON ha.house_id = h.house_id

      /* lateral amenities (same trick) ------------------------ */
      LEFT JOIN LATERAL (
        SELECT json_agg(name) AS amenities
        FROM (
          VALUES
            ('private_pool'     , ha.private_pool),
            ('private_garden'   , ha.private_garden),
            ('rooftop_terrace'  , ha.rooftop_terrace),
            ('maid_room'        , ha.maid_room),
            ('study'            , ha.study),
            ('central_ac'       , ha.central_ac),
            ('fireplace'        , ha.fireplace),
            ('solar_panels'     , ha.solar_panels),
            ('balcony'          , ha.balcony),
            ('walk_in_closet'   , ha.walk_in_closet),
            ('kitchen_appliances',ha.kitchen_appliances),
            ('security_system'  , ha.security_system),
            ('pets_allowed'     , ha.pets_allowed)
        ) AS v(name, flag)
        WHERE flag
      ) amen ON TRUE

      WHERE fp.id = $1
        AND fp.property_type = 'house';
    `;

    const { rows } = await pool.query(sql, [id]);

    if (!rows.length) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    res.json({ house: rows[0] });
  } catch (err) {
    next(err);
  }
};
