/* ------------------------------------------------------------------
   Residential controller – create | list | delete | amenity options
-------------------------------------------------------------------*/
import { RequestHandler } from 'express';
import { pool }           from '../../config/db';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';

const must = (c: boolean, m: string) => { if (!c) throw new Error(m); };

/* ──────────────────────────────────────────────────────────────────
   POST /residential
   – Creates a firm_properties row (and a unit stub when needed)
   – Always satisfies chk_locator_and_type:
       • unit_id  ➜ property_type = 'apartment'
       • parcelNo ➜ property_type = 'land'
   – Returns { id }
─────────────────────────────────────────────────────────────────── */
export const createResidentialProperty: RequestHandler = async (req, res, next) => {
  const client = await pool.connect();
  try {
    /* ── auth (falls back to body – handy for scripts / tests) ── */
    const sess      = (req as AuthenticatedRequest).user ?? undefined;
    const firm_id   = sess?.firm_id ?? req.body.firm_id;
    const user_id   = sess?.user_id ?? req.body.user_id;
    if (!firm_id || !user_id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    /* ── body fields ─────────────────────────────────────────── */
    const {
      parcel_no,               // locator for land
      unit_id,                 // existing unit
      listing_type,            // 'sale' | 'rent'
      status = 'draft',

      asking_price,
      rent_price,

      bedrooms,
      bathrooms,
      furnished,

      title         = '',
      description   = '',
      amenities     = [],      // string[]

      /* coordinate-based unit creation */
      latitude, longitude,
      block_no, area_name_en, area_name_ar = area_name_en,
      floor = 0, size_m2 = 0,
    } = req.body;

    /* ── validation ──────────────────────────────────────────── */
    must(listing_type,          '`listing_type` is required');
    must(parcel_no || unit_id || (latitude && longitude),
         'Either `parcel_no`, `unit_id`, or coordinates are required');
    must(!(parcel_no && unit_id),
         '`parcel_no` and `unit_id` are mutually exclusive');
    if (listing_type === 'sale')
      must(asking_price != null, '`asking_price` required for sale');
    if (listing_type === 'rent')
      must(rent_price   != null, '`rent_price` required for rent');
    must(+bedrooms  > 0, '`bedrooms` > 0');
    must(+bathrooms > 0, '`bathrooms` > 0');

    await client.query('BEGIN');

    /* ── 1. Create unit stub if we’re not supplied one ───────── */
    let finalUnitId: number | null = unit_id ?? null;

    if (!parcel_no && !unit_id) {
      must(block_no && area_name_en,
           '`block_no` and `area_name_en` are required when creating a new unit');

      const insertUnit = `
        INSERT INTO unit_properties (
          building_name , unit_no ,
          block_no , area_name_en , area_name_ar ,
          floor , latitude , longitude , size_m2
        )
        VALUES (
          '' , gen_random_uuid()::text ,
          $1 , $2 , $3 ,
          $4 , $5 , $6 , $7
        )
        RETURNING unit_id;
      `;
      const { rows:[u] } = await client.query(insertUnit, [
        block_no, area_name_en, area_name_ar,
        floor, latitude, longitude, size_m2,
      ]);
      finalUnitId = u.unit_id;                // now we have a unit
    }

    /* ── 2. Insert firm_properties row ───────────────────────── */
    // property_type must satisfy chk_locator_and_type
    const property_type = finalUnitId ? 'apartment' : 'land';

    const insertFP = `
      INSERT INTO firm_properties (
        firm_id , user_id ,
        parcel_no , unit_id ,
        property_type , listing_type , status ,
        asking_price , rent_price ,
        bedrooms , bathrooms , furnished ,
        title , description ,
        created_at , updated_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,$12,
        $13,$14,NOW(),NOW()
      )
      RETURNING id;
    `;
    const { rows:[fp] } = await client.query(insertFP, [
      firm_id, user_id,
      parcel_no ?? null,
      finalUnitId,
      property_type, listing_type, status,
      asking_price ?? null, rent_price ?? null,
      bedrooms, bathrooms, furnished ?? false,
      title, description,
    ]);
    const propertyId = fp.id;

    /* ── 3. Amenity flags (true/false columns) ───────────────── */
    const amenCols = [
      'maids_room','study','central_ac','balcony','private_garden','private_pool',
      'shared_pool','security','concierge','covered_parking','built_in_wardrobes',
      'walk_in_closet','kitchen_appliances','view_water','view_landmark',
      'pets_allowed','shared_gym','lobby_building','children_pool',
    ];
    const boolVals = amenCols.map(c => amenities.includes(c));
    const insertAmen = `
      INSERT INTO rental_amenities (
        property_id, ${amenCols.join(',')}
      )
      VALUES (
        $1, ${amenCols.map((_, i) => '$' + (i + 2)).join(',')}
      );
    `;
    await client.query(insertAmen, [propertyId, ...boolVals]);

    await client.query('COMMIT');
    res.status(201).json({ id: propertyId });
  } catch (err) {
    await pool.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

/* ------------------------------------------------------------------
   DELETE /residential/:id
-------------------------------------------------------------------*/
export const deleteResidentialProperty: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) { res.status(401).json({ message: 'Unauthorized' }); return; }

    const { id } = req.params;

    const { rows } = await pool.query(
      `DELETE FROM firm_properties
        WHERE id = $1 AND firm_id = $2
      RETURNING *`,
      [id, user.firm_id],
    );

    if (!rows.length) {
      res.status(404).json({ message: 'Residential property not found' });
      return;
    }

    res.json({ message: 'Property deleted', deleted: rows[0] });
  } catch (err) { next(err); }
};

/* ------------------------------------------------------------------
   GET /residential  (list for one firm)
-------------------------------------------------------------------*/
export const getFirmResidentialProperties: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) { res.status(401).json({ message: 'Unauthorized' }); return; }

    const {
      status, block_no, area_namee, minPrice, maxPrice,
    } = req.query as Record<string, string>;

    let sql = `
      SELECT
        fp.*,
        COALESCE(p.area_namee , u.area_name_en) AS area_namee,
        COALESCE(p.block_no    , u.block_no)     AS block_no,
        COALESCE(p.latitude    , u.latitude)     AS latitude,
        COALESCE(p.longitude   , u.longitude)    AS longitude
      FROM firm_properties fp
      LEFT JOIN properties      p ON fp.parcel_no = p.parcel_no
      LEFT JOIN unit_properties u ON fp.unit_id   = u.unit_id
      WHERE fp.firm_id = $1
        AND fp.property_type IN ('apartment')  -- apartments & houses
    `;
    const params: any[] = [user.firm_id];

    const add = (val: any, clause: string) => {
      params.push(val);
      sql += ` AND ${clause.replace('?', '$' + params.length)}`;
    };

    if (status)     add(status,     'fp.status = ?');
    if (block_no)   add(block_no,   'COALESCE(p.block_no,u.block_no) = ?');
    if (area_namee) add(area_namee, 'COALESCE(p.area_namee,u.area_name_en) = ?');
    if (minPrice)   add(+minPrice,  'fp.asking_price >= ?');
    if (maxPrice)   add(+maxPrice,  'fp.asking_price <= ?');

    sql += ' ORDER BY fp.updated_at DESC';

    const { rows } = await pool.query(sql, params);
    res.json({ firmProperties: rows });
  } catch (err) { next(err); }
};

/* ------------------------------------------------------------------
   GET /residential/amenities
-------------------------------------------------------------------*/
export const getAmenityOptions: RequestHandler = async (_req, res, next) => {
  try {
    const { rows } = await pool.query<{ column_name: string }>(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name   = 'rental_amenities'
        AND column_name <> 'property_id'
      ORDER BY ordinal_position;
    `);

    res.json({
      amenities: rows.map(r => ({
        value: r.column_name,
        label: r.column_name
                 .replace(/_/g, ' ')
                 .replace(/\b\w/g, c => c.toUpperCase()),
      })),
    });
  } catch (err) { next(err); }
};
