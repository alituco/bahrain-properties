import { RequestHandler } from "express";
import { pool }            from "../config/db";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

const mustHave = (cond: boolean, msg: string) => { if (!cond) throw new Error(msg); };

/* ────────────────────────────────────────────────────────────────── */
/* Helper – common validation rules                                  */
function validateBody(
  status: string,
  body: any,
  isInsert = true,
): string | null {
  const { title, asking_price, sold_price, sold_date } = body;

  //  title must always be present on INSERT
  if (isInsert && (!title || title.trim() === "")) {
    return "title is required.";
  }

  switch (status) {
    case "listed":
      if (!title || title.trim() === "") return "title is required.";
      if (asking_price == null)          return "asking_price is required when status=listed.";
      break;

    case "sold":
      if (!title || title.trim() === "") return "title is required.";
      if (sold_price == null)            return "sold_price is required when status=sold.";
      if (!sold_date)                    return "sold_date is required when status=sold.";
      break;
  }
  return null;
}

/* GET /firm-properties/geojson  — returns ALL firm properties as a mixed GeoJSON */
export const getFirmPropertiesGeojson: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized - No user context." });
      return;
    };

    const status = (req.query.status as string | undefined)?.toLowerCase();

    // LAND (polygon) ----------------------------------------------------
    const landSql = `
      SELECT
        fp.id AS fp_id,
        fp.status, fp.asking_price, fp.sold_price, fp.title, fp.description,
        fp.property_type, fp.parcel_no,
        ST_AsGeoJSON(ST_Transform(p.geometry, 4326)) AS geom,
        ST_X(ST_Transform(ST_Centroid(p.geometry), 4326)) AS longitude,
        ST_Y(ST_Transform(ST_Centroid(p.geometry), 4326)) AS latitude
      FROM firm_properties fp
      JOIN properties p ON p.parcel_no = fp.parcel_no
      WHERE fp.firm_id = $1
        AND fp.property_type = 'land'
        ${status && status !== 'all' ? `AND fp.status = $2` : ``}
    `;

    // APARTMENTS (point) -----------------------------------------------
    const aptSql = `
      SELECT
        fp.id AS fp_id,
        fp.status, fp.asking_price, fp.rent_price, fp.title, fp.description,
        fp.property_type, fp.unit_id,
        ST_AsGeoJSON(ST_SetSRID(ST_MakePoint(u.longitude::double precision, u.latitude::double precision), 4326)) AS geom,
        u.longitude::double precision AS longitude,
        u.latitude ::double precision AS latitude
      FROM firm_properties fp
      JOIN unit_properties u ON u.unit_id = fp.unit_id
      WHERE fp.firm_id = $1
        AND fp.property_type = 'apartment'
        ${status && status !== 'all' ? `AND fp.status = $2` : ``}
    `;

    // HOUSES (point) ---------------------------------------------------
    const houseSql = `
      SELECT
        fp.id AS fp_id,
        fp.status, fp.asking_price, fp.rent_price, fp.title, fp.description,
        fp.property_type, fp.house_id,
        ST_AsGeoJSON(ST_SetSRID(ST_MakePoint(h.longitude, h.latitude), 4326)) AS geom,
        h.longitude AS longitude,
        h.latitude  AS latitude
      FROM firm_properties fp
      JOIN house_properties h ON h.house_id = fp.house_id
      WHERE fp.firm_id = $1
        AND fp.property_type = 'house'
        ${status && status !== 'all' ? `AND fp.status = $2` : ``}
    `;

    const params = [user.firm_id, status];
    const [land, apts, houses] = await Promise.all([
      pool.query(landSql,  status && status !== 'all' ? params : [user.firm_id]),
      pool.query(aptSql,   status && status !== 'all' ? params : [user.firm_id]),
      pool.query(houseSql, status && status !== 'all' ? params : [user.firm_id]),
    ]);

    const toFeature = (r: any) => ({
      type: "Feature",
      geometry: JSON.parse(r.geom),
      properties: {
        fp_id       : r.fp_id,
        parcel_no   : r.parcel_no ?? null,
        property_type: r.property_type,             // 'land' | 'apartment' | 'house'
        status      : r.status,
        asking_price: r.asking_price,
        sold_price  : r.sold_price ?? null,
        rent_price  : r.rent_price ?? null,
        title       : r.title,
        description : r.description,
        longitude   : r.longitude,
        latitude    : r.latitude,
        firm_saved  : true,                         // your FE relies on this
      },
      id: r.parcel_no || `${r.property_type}-${r.fp_id}`,
    });

    const features = [
      ...land.rows.map(toFeature),
      ...apts.rows.map(toFeature),
      ...houses.rows.map(toFeature),
    ];

    res.json({ type: "FeatureCollection", features });
  } catch (err) {
    console.error("Error fetching firm properties as GeoJSON:", err);
    next(err);
  }
};


/* ────────────────────────────────────────────────────────────────── */
/* POST /firm-properties                                             */
export const createFirmProperty: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) res.status(401).json({ message: "Unauthorised" });

    const {
      parcel_no, status,
      asking_price, sold_price, sold_date,
      title, description,
    } = req.body;

    /* ---- business-rules ----------------------------------------- */
    mustHave(parcel_no && status, "`parcel_no` and `status` are required");
    if (status === "listed") {
      mustHave(title?.trim(),        "`title` is required when status = listed");
      mustHave(asking_price != null, "`asking_price` is required when status = listed");
    }
    if (status === "sold") {
      mustHave(title?.trim(),      "`title` is required when status = sold");
      mustHave(sold_price != null, "`sold_price` is required when status = sold");
      mustHave(sold_date,          "`sold_date` is required when status = sold");
    }

    /* ---- INSERT -------------------------------------------------- */
    const sql = `
      INSERT INTO firm_properties (
        firm_id, user_id, parcel_no, status,
        asking_price, sold_price, sold_date,
        title, description,
        created_at,  updated_at
      ) VALUES (
        $1,$2,$3,$4,
        $5,$6,$7,
        $8,$9,
        NOW(), NOW()
      )
      RETURNING *;
    `;
    const params = [
      user.firm_id,           //  $1
      user.user_id,           //  $2 ▲  NEW – satisfies NOT NULL constraint
      parcel_no,              //  $3
      status,                 //  $4
      asking_price ?? null,   //  $5
      sold_price   ?? null,   //  $6
      sold_date    ?? null,   //  $7
      title,                  //  $8
      description ?? "",      //  $9
    ];

    const { rows } = await pool.query(sql, params);
    res.status(201).json({
      message: "Firm property created",
      firmProperty: rows[0],
    });
  } catch (err: any) {
    console.error("Error creating firm property:", err);
    next(err);                        // send **once** – no res.* before this
  }
};

/* ────────────────────────────────────────────────────────────────── */
/* GET /firm-properties                                              */
export const getFirmProperties: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) res.status(401).json({ message: "Unauthorized - No user context." });

    const {
      status, block_no, area_namee, minPrice, maxPrice,
    } = req.query as Record<string, string>;

    let sql = `
      SELECT fp.id, fp.firm_id, fp.parcel_no, fp.status,
             fp.asking_price, fp.sold_price, fp.sold_date,
             fp.title, fp.description,
             fp.created_at, fp.updated_at,
             p.latitude, p.longitude, p.area_namee, p.block_no, p.shape_area
        FROM firm_properties fp
   LEFT JOIN properties p ON fp.parcel_no = p.parcel_no
       WHERE fp.firm_id = $1
       AND fp.property_type = 'land'
    `;
    const params: any[] = [user.firm_id];

    if (status)      { params.push(status);      sql += ` AND fp.status = $${params.length}`; }
    if (block_no)    { params.push(block_no);    sql += ` AND p.block_no = $${params.length}`; }
    if (area_namee)  { params.push(area_namee);  sql += ` AND p.area_namee = $${params.length}`; }
    if (minPrice)    { params.push(Number(minPrice)); sql += ` AND fp.asking_price >= $${params.length}`; }
    if (maxPrice)    { params.push(Number(maxPrice)); sql += ` AND fp.asking_price <= $${params.length}`; }

    sql += " ORDER BY fp.created_at DESC";

    const { rows } = await pool.query(sql, params);
    res.status(200).json({ firmProperties: rows });
  } catch (err) {
    console.error("Error fetching firm properties:", err);
    next(err);
  }
};

/* ────────────────────────────────────────────────────────────────── */
/* GET /firm-properties/:parcelNo                                    */
export const getFirmPropertyByParcel: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) res.status(401).json({ message: "Unauthorized - No user context." });

    const { parcelNo } = req.params;
    if (!parcelNo) res.status(400).json({ message: "Missing parcelNo parameter." });

    const sql = `
      SELECT fp.*, p.latitude, p.longitude, p.area_namee, p.block_no
        FROM firm_properties fp
   LEFT JOIN properties p ON fp.parcel_no = p.parcel_no
       WHERE fp.firm_id = $1 AND fp.parcel_no = $2
      LIMIT 1;
    `;
    const { rows } = await pool.query(sql, [user.firm_id, parcelNo]);
    if (rows.length === 0)
      res.status(404).json({ message: `No firm_properties record for ${parcelNo}` });

    res.status(200).json({ firmProperty: rows[0] });
  } catch (err) {
    console.error("Error fetching firm property by parcelNo:", err);
    next(err);
  }
};

/* ────────────────────────────────────────────────────────────────── */
/* PATCH /firm-properties/:id                                        */
export const updateFirmProperty: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) res.status(401).json({ message: "Unauthorized - No user context." });

    const { id } = req.params;
    const {
      parcel_no, status, asking_price,
      sold_price, sold_date, title, description,
    } = req.body;

    if (!parcel_no)
      res.status(400).json({ message: "parcel_no is required." });

    // Validate business rules
    if (status) {
      const err = validateBody(status, req.body, /*insert*/ false);
      if (err) res.status(400).json({ message: err });
    }

    const updates: string[] = [];
    const vals:   any[]     = [];
    let i = 1;

    const push = (col: string, val: any) => {
      updates.push(`${col} = $${i}`);
      vals.push(val);
      i++;
    };

    if (status        !== undefined) push("status",        status);
    if (asking_price  !== undefined) push("asking_price",  asking_price);
    if (sold_price    !== undefined) push("sold_price",    sold_price);
    if (sold_date     !== undefined) push("sold_date",     sold_date);
    if (title         !== undefined) push("title",         title);
    if (description   !== undefined) push("description",   description);

    if (updates.length === 0)
      res.status(400).json({ message: "No valid fields to update." });

    updates.push(`updated_at = NOW()`);

    const sql = `
      UPDATE firm_properties
         SET ${updates.join(", ")}
       WHERE id = $${i}           -- pk
         AND firm_id   = $${i+1}  -- scope to firm
         AND parcel_no = $${i+2}
      RETURNING *;
    `;
    vals.push(id, user.firm_id, parcel_no);

    const { rows } = await pool.query(sql, vals);
    if (rows.length === 0)
      res.status(404).json({ message: "Firm property not found or not yours." });

    res.status(200).json({
      message: "Firm property updated successfully.",
      updatedProperty: rows[0],
    });
  } catch (err) {
    console.error("Error updating firm property:", err);
    next(err);
  }
};

/* ────────────────────────────────────────────────────────────────── */
/* DELETE /firm-properties/:id                                       */
export const deleteFirmProperty: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) res.status(401).json({ message: "Unauthorized - No user context." });

    const { id } = req.params;
    const sql = `
      DELETE FROM firm_properties
       WHERE id = $1 AND firm_id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(sql, [id, user.firm_id]);
    if (rows.length === 0)
      res.status(404).json({ message: "Firm property not found or not yours." });

    res.status(200).json({
      message: "Firm property deleted successfully.",
      deletedProperty: rows[0],
    });
  } catch (err) {
    console.error("Error deleting firm property:", err);
    next(err);
  }
};