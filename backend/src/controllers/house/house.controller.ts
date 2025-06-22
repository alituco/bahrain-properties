/* ------------------------------------------------------------------
   House controller  –  create | list | delete | amenity options
-------------------------------------------------------------------*/
import { RequestHandler } from 'express';
import { pool }           from '../../config/db';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';

const must = (c: boolean, m: string) => { if (!c) throw new Error(m); };

/* ──────────────────────────────────────────────────────────────────
   POST /house
   – Creates a firm_properties row (and a house stub when needed)
   – Always satisfies chk_locator_and_type:
       • house_id ➜ property_type = 'house'
       • parcelNo ➜ property_type = 'land'
   – Returns { id }
─────────────────────────────────────────────────────────────────── */
/* ------------------------------------------------------------------
   POST /house   – create house or land row (with optional stub)
-------------------------------------------------------------------*/
export const createHouseProperty: RequestHandler = async (req, res, next) => {
  const client = await pool.connect();
  try {
    /* ---------- auth ------------------------------------------------ */
    const sess        = (req as AuthenticatedRequest).user ?? undefined;
    const firm_id     = sess?.firm_id ?? req.body.firm_id;
    const user_id     = sess?.user_id ?? req.body.user_id;
    if (!firm_id || !user_id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    /* ---------- body ------------------------------------------------ */
    const {
      parcel_no, house_id, listing_type, status = 'draft',
      asking_price, rent_price,
      bedrooms, bathrooms, furnished,
      title = '', description = '', amenities = [],

      /* stub-creation fields */
      latitude, longitude,
      block_no, area_name_en, area_name_ar = area_name_en,
      plot_size_m2 = 0, built_up_m2 = null,
      floors = 1, parking_spots = 0,
    } = req.body;

    /* ---------- validation ----------------------------------------- */
    must(listing_type, '`listing_type` is required');
    must(parcel_no || house_id || (latitude && longitude),
         'Provide either `parcel_no`, `house_id`, or map coordinates');
    must(!(parcel_no && house_id),
         '`parcel_no` and `house_id` are mutually exclusive');

    if (listing_type === 'sale') must(asking_price != null, '`asking_price` required');
    if (listing_type === 'rent') must(rent_price   != null, '`rent_price` required');
    must(+bedrooms  > 0, '`bedrooms` > 0');
    must(+bathrooms > 0, '`bathrooms` > 0');

    await client.query('BEGIN');

    /* ---------- 1. create / reuse house stub ----------------------- */
    let finalHouseId: number | null = house_id ?? null;

    if (!parcel_no && !house_id) {
      must(block_no && area_name_en,
           '`block_no` & `area_name_en` are required when creating a new house stub');

      const stubSQL = `
        INSERT INTO house_properties (
          house_no ,
          block_no , area_name_en , area_name_ar ,
          floors , latitude , longitude ,
          plot_size_m2 , built_up_m2 , parking_spots ,
          bedrooms , bathrooms
        )
        VALUES (
          gen_random_uuid()::text ,
          $1,$2,$3,
          $4,$5,$6,
          $7,$8,$9,
          $10,$11
        )
        RETURNING house_id;
      `;
      const { rows:[h] } = await client.query(stubSQL, [
        block_no, area_name_en, area_name_ar,
        floors, latitude, longitude,
        plot_size_m2, built_up_m2, parking_spots,
        bedrooms, bathrooms
      ]);
      finalHouseId = h.house_id;
    }

    /* ---------- 2. insert firm_properties row ---------------------- */
    const property_type = finalHouseId ? 'house' : 'land';

    const fpSQL = `
      INSERT INTO firm_properties (
        firm_id , user_id ,
        parcel_no , house_id ,
        property_type , listing_type , status ,
        asking_price , rent_price ,
        bedrooms , bathrooms , furnished ,
        parking_spots ,
        title , description ,
        created_at , updated_at
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,$12,
        $13,
        $14,$15,
        NOW(),NOW()
      )
      RETURNING id;
    `;
    const { rows:[fp] } = await client.query(fpSQL, [
      firm_id, user_id,
      parcel_no ?? null,
      finalHouseId,
      property_type, listing_type, status,
      asking_price ?? null, rent_price ?? null,
      bedrooms, bathrooms, furnished ?? false,
      parking_spots,
      title, description,
    ]);

    /* ---------- 3. amenities (only if we actually have a house) ---- */
    if (finalHouseId) {
      const amenCols = [
        'private_pool','private_garden','rooftop_terrace','maid_room','study',
        'central_ac','fireplace','solar_panels','balcony','walk_in_closet',
        'kitchen_appliances','security_system','pets_allowed'
      ];
      const boolVals = amenCols.map(c => amenities.includes(c));

      const amenSQL = `
        INSERT INTO house_amenities (
          house_id, ${amenCols.join(',')}
        )
        VALUES (
          $1, ${amenCols.map((_, i) => '$' + (i + 2)).join(',')}
        )
        ON CONFLICT (house_id) DO UPDATE SET
          ${amenCols.map((c,i)=>`${c} = EXCLUDED.${c}`).join(', ')};
      `;
      await client.query(amenSQL, [finalHouseId, ...boolVals]);
    }

    await client.query('COMMIT');
    res.status(201).json({ id: fp.id });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};


/* ------------------------------------------------------------------
   DELETE /house/:id
-------------------------------------------------------------------*/
export const deleteHouseProperty:RequestHandler = async (req,res,next)=>{
  try{
    const user=(req as AuthenticatedRequest).user;
    if(!user){ res.status(401).json({message:'Unauthorized'}); return; }

    const { id } = req.params;
    const { rows } = await pool.query(
      `DELETE FROM firm_properties
         WHERE id=$1 AND firm_id=$2
           AND property_type='house'
       RETURNING *`,
      [id,user.firm_id]
    );
    if(!rows.length){ res.status(404).json({message:'Not found'}); return; }
    res.json({ message:'Property deleted', deleted:rows[0] });
  }catch(err){ next(err); }
};

/* ------------------------------------------------------------------
   GET /house  (list for one firm)
-------------------------------------------------------------------*/
export const getFirmHouseProperties:RequestHandler = async (req,res,next)=>{
  try{
    const user=(req as AuthenticatedRequest).user;
    if(!user){ res.status(401).json({message:'Unauthorized'}); return; }

    const { status, block_no, area_namee, minPrice, maxPrice } =
          req.query as Record<string,string>;

    let sql = `
      SELECT fp.*,
             COALESCE(p.area_namee,h.area_name_en) AS area_namee,
             COALESCE(p.block_no   ,h.block_no   ) AS block_no,
             COALESCE(p.latitude   ,h.latitude   ) AS latitude,
             COALESCE(p.longitude  ,h.longitude  ) AS longitude
        FROM firm_properties fp
   LEFT JOIN properties       p ON p.parcel_no = fp.parcel_no
   LEFT JOIN house_properties h ON h.house_id  = fp.house_id
       WHERE fp.firm_id = $1
         AND fp.property_type = 'house'
    `;
    const params:any[]=[user.firm_id];
    const add=(v:any,cl:string)=>{ params.push(v); sql+=` AND ${cl.replace('?',`$${params.length}`)}`; };

    if(status   ) add(status   ,'fp.status=?');
    if(block_no ) add(block_no ,'COALESCE(p.block_no,h.block_no)=?');
    if(area_namee) add(area_namee,'COALESCE(p.area_namee,h.area_name_en)=?');
    if(minPrice ) add(+minPrice ,'fp.asking_price>=?');
    if(maxPrice ) add(+maxPrice ,'fp.asking_price<=?');

    sql+=' ORDER BY fp.updated_at DESC';
    const { rows } = await pool.query(sql,params);
    res.json({ firmProperties:rows });
  }catch(err){ next(err); }
};

/* ------------------------------------------------------------------
   GET /house/amenities
-------------------------------------------------------------------*/
export const getHouseAmenityOptions:RequestHandler = async (_req,res,next)=>{
  try{
    const { rows } = await pool.query<{column_name:string}>(`
      SELECT column_name
        FROM information_schema.columns
       WHERE table_schema='public'
         AND table_name   ='house_amenities'
         AND column_name <> 'property_id'
       ORDER BY ordinal_position;
    `);
    res.json({ amenities: rows.map(r=>({
      value:r.column_name,
      label:r.column_name.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())
    }))});
  }catch(err){ next(err); }
};

/* ------------------------------------------------------------------
   GET /house/:id  (single firm-owned house)
-------------------------------------------------------------------*/
export const getHouseProperty:RequestHandler = async (req,res,next)=>{
  try{
    const user=(req as AuthenticatedRequest).user;
    if(!user){ res.status(401).json({message:'Unauthorized'}); return; }

    const { id } = req.params;
    const { rows } = await pool.query(`
      SELECT fp.*,
             h.block_no, h.area_name_en, h.floors, h.plot_size_m2,
             h.latitude , h.longitude
        FROM firm_properties fp
        JOIN house_properties h ON fp.house_id = h.house_id
       WHERE fp.id = $1 AND fp.firm_id=$2
         AND fp.property_type='house';
    `,[id,user.firm_id]);
    if(!rows.length){ res.status(404).json({message:'Not found'}); return; }
    res.json({ property: rows[0] });
  }catch(err){ next(err); }
};

/* ------------------------------------------------------------------
   PATCH /house/:id
-------------------------------------------------------------------*/
export const updateHouseProperty:RequestHandler = async (req,res,next)=>{
  try{
    const user=(req as AuthenticatedRequest).user;
    if(!user){ res.status(401).json({message:'Unauthorized'}); return; }

    const { id } = req.params;
    const { status,title,description,asking_price,rent_price } = req.body;

    const { rows } = await pool.query(`
      UPDATE firm_properties SET
        status       = COALESCE($3,status),
        title        = COALESCE($4,title),
        description  = COALESCE($5,description),
        asking_price = COALESCE($6,asking_price),
        rent_price   = COALESCE($7,rent_price),
        updated_at   = NOW()
      WHERE id=$1 AND firm_id=$2
        AND property_type='house'
      RETURNING *;
    `,[id,user.firm_id,status,title,description,asking_price,rent_price]);

    if(!rows.length){ res.status(404).json({message:'Not found'}); return; }
    res.json({ updatedProperty:rows[0] });
  }catch(err){ next(err); }
};
