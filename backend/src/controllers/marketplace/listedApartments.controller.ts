// Public-marketplace apartments controller
import { RequestHandler } from 'express';
import { pool }           from '../../config/db';


const add = (
  val: any, clause: string, where: string[], params: any[],
) => { params.push(val); where.push(clause.replace('?', `$${params.length}`)); };

interface BedRow  { bedrooms  : number }
interface BathRow { bathrooms : number }
interface AreaRow { area_name : string }

/* ================================================================
   GET /apartment   – list “available” apartments
================================================================ */
export const getListedApartments: RequestHandler = async (req, res, next) => {
  try {
    const {
      bedrooms , bathrooms , area_name,
      minPrice , maxPrice , sort = '',
    } = req.query as Record<string,string>;

    const where : string[] = [
      "fp.status = 'available'",
      "fp.property_type = 'apartment'",
    ];
    const params: any[] = [];

    if (bedrooms ) add(+bedrooms , 'fp.bedrooms  = ?', where, params);
    if (bathrooms) add(+bathrooms, 'fp.bathrooms = ?', where, params);
    if (area_name) add(area_name , 'u.area_name_en = ?', where, params);
    if (minPrice ) add(minPrice  , 'COALESCE(fp.asking_price,fp.rent_price) >= ?', where, params);
    if (maxPrice ) add(maxPrice  , 'COALESCE(fp.asking_price,fp.rent_price) <= ?', where, params);

    /* ------------------ main SELECT --------------------------- */
    const sql = `
      SELECT fp.id,
             fp.title,
             fp.listing_type,
             fp.asking_price,
             fp.rent_price,
             fp.bedrooms,
             fp.bathrooms,
             u.area_name_en                           AS area_name,

             /* images (oldest → newest) ------------------------- */
             COALESCE(
               (SELECT json_agg(file_url ORDER BY id)
                FROM   firm_property_images
                WHERE  property_id = fp.id),
               '[]'
             )                                         AS images,

             /* amenities (array of TRUE flags) ------------------ */
             COALESCE(amen.amenities, '[]')            AS amenities

      FROM   firm_properties  fp
      JOIN   unit_properties  u  ON u.unit_id   = fp.unit_id

      LEFT  JOIN rental_amenities ra ON ra.property_id = fp.id

      /* turn boolean columns into json array ------------------ */
      LEFT JOIN LATERAL (
        SELECT json_agg(name) AS amenities
        FROM (
          VALUES
            ('maids_room',          ra.maids_room),
            ('study',               ra.study),
            ('central_ac',          ra.central_ac),
            ('balcony',             ra.balcony),
            ('private_garden',      ra.private_garden),
            ('private_pool',        ra.private_pool),
            ('shared_pool',         ra.shared_pool),
            ('security',            ra.security),
            ('concierge',           ra.concierge),
            ('covered_parking',     ra.covered_parking),
            ('built_in_wardrobes',  ra.built_in_wardrobes),
            ('walk_in_closet',      ra.walk_in_closet),
            ('kitchen_appliances',  ra.kitchen_appliances),
            ('view_water',          ra.view_water),
            ('view_landmark',       ra.view_landmark),
            ('pets_allowed',        ra.pets_allowed),
            ('shared_gym',          ra.shared_gym),
            ('lobby_building',      ra.lobby_building),
            ('children_pool',       ra.children_pool),
            ('children_play_area',  ra.children_play_area),
            ('barbecue_area',       ra.barbecue_area)
        ) AS v(name, flag)
        WHERE flag
      ) amen ON TRUE

      WHERE ${where.join(' AND ')}
      ORDER BY ${
        sort === 'asc'  ? 'COALESCE(fp.asking_price,fp.rent_price) ASC'  :
        sort === 'desc' ? 'COALESCE(fp.asking_price,fp.rent_price) DESC' :
                          'fp.updated_at DESC'
      };
    `;

    const { rows: apartments } = await pool.query(sql, params);

    /* ---------- option sets (for filters) --------------------- */
    const [beds, baths, areas] = await Promise.all([
      pool.query<BedRow >(`
        SELECT DISTINCT bedrooms
        FROM   firm_properties
        WHERE  property_type = 'apartment'
        ORDER  BY bedrooms
      `),
      pool.query<BathRow>(`
        SELECT DISTINCT bathrooms
        FROM   firm_properties
        WHERE  property_type = 'apartment'
        ORDER  BY bathrooms
      `),
      pool.query<AreaRow>(`
        SELECT DISTINCT area_name_en AS area_name
        FROM   unit_properties
        WHERE  area_name_en IS NOT NULL
        ORDER  BY area_name_en
      `),
    ]);

    res.json({
      apartments,
      options: {
        bedrooms : beds .rows.map(r => String(r.bedrooms)),
        bathrooms: baths.rows.map(r => String(r.bathrooms)),
        areas    : areas.rows.map(r => r.area_name),
      },
    });
  } catch (err) {
    console.error('Error fetching listed apartments:', err);
    next(err);
  }
};

/* ================================================================
   GET /apartment/:id   – single apartment detail
================================================================ */
export const getApartmentById: RequestHandler = async (req, res, next) => {
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
             u.floor,
             u.size_m2,
             u.area_name_en               AS area_name,
             u.block_no,
             u.latitude,
             u.longitude,

             /* images ------------------------------------------- */
             COALESCE(
               (SELECT json_agg(file_url ORDER BY id)
                FROM   firm_property_images
                WHERE  property_id = fp.id),
               '[]'
             )                                    AS images,

             /* amenities array (same trick) --------------------- */
             COALESCE(amen.amenities, '[]')       AS amenities,

             /* contact details ---------------------------------- */
             CONCAT(us.first_name,' ',us.last_name) AS realtor_name,
             us.phone_number,
             us.email,
             COALESCE(f.firm_name, us.real_estate_firm, '') AS firm_name

      FROM   firm_properties fp
      JOIN   unit_properties  u ON u.unit_id   = fp.unit_id
      JOIN   users            us ON us.user_id = fp.user_id
      LEFT   JOIN firms        f ON f.firm_id  = us.firm_id
      LEFT   JOIN rental_amenities ra ON ra.property_id = fp.id

      LEFT JOIN LATERAL (
        SELECT json_agg(name) AS amenities
        FROM (
          VALUES
            ('maids_room',          ra.maids_room),
            ('study',               ra.study),
            ('central_ac',          ra.central_ac),
            ('balcony',             ra.balcony),
            ('private_garden',      ra.private_garden),
            ('private_pool',        ra.private_pool),
            ('shared_pool',         ra.shared_pool),
            ('security',            ra.security),
            ('concierge',           ra.concierge),
            ('covered_parking',     ra.covered_parking),
            ('built_in_wardrobes',  ra.built_in_wardrobes),
            ('walk_in_closet',      ra.walk_in_closet),
            ('kitchen_appliances',  ra.kitchen_appliances),
            ('view_water',          ra.view_water),
            ('view_landmark',       ra.view_landmark),
            ('pets_allowed',        ra.pets_allowed),
            ('shared_gym',          ra.shared_gym),
            ('lobby_building',      ra.lobby_building),
            ('children_pool',       ra.children_pool),
            ('children_play_area',  ra.children_play_area),
            ('barbecue_area',       ra.barbecue_area)
        ) AS v(name, flag)
        WHERE flag
      ) amen ON TRUE

      WHERE fp.id = $1
        AND  fp.property_type = 'apartment';
    `;

    const { rows } = await pool.query(sql, [id]);

    if (!rows.length) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    res.json({ apartment: rows[0] });
  } catch (err) {
    next(err);
  }
};
