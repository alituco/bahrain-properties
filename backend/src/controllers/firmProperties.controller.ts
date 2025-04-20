import { RequestHandler } from "express";
import { pool } from "../config/db";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

// GET /firm-properties/geojson
// Return a GeoJSON of all properties that the user's firm has saved.
export const getFirmPropertiesGeojson: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized - No user context." });
      return;
    }

    const { status } = req.query; // e.g. "sold", "listed", ...

    let query = `
      SELECT 
        fp.parcel_no,
        fp.status,
        fp.asking_price,
        fp.sold_price,
        ST_AsGeoJSON(ST_Transform(p.geometry, 4326))  AS geojson,
        ST_X(ST_Transform(ST_Centroid(p.geometry), 4326)) AS longitude,
        ST_Y(ST_Transform(ST_Centroid(p.geometry), 4326)) AS latitude
      FROM firm_properties fp
      LEFT JOIN properties p ON fp.parcel_no = p.parcel_no
      WHERE fp.firm_id = $1
    `;

    const params: any[] = [user.firm_id];

    if (status && typeof status === "string" && status.toLowerCase() !== "all") {
      query += ` AND fp.status = $2`;
      params.push(status);
    }

    const { rows } = await pool.query(query, params);

    const features = rows.map((r) => ({
      type: "Feature",
      geometry: JSON.parse(r.geojson),
      properties: {
        parcel_no:    r.parcel_no,
        status:       r.status,
        asking_price: r.asking_price,
        sold_price:   r.sold_price,
        firm_saved:   true,
        latitude:     r.latitude,
        longitude:    r.longitude,
      },
    }));

    res.json({ type: "FeatureCollection", features });
    return;
  } catch (err) {
    console.error("Error fetching firm properties as GeoJSON:", err);
    return next(err);
  }
};


export const createFirmProperty: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized - No user context." });
      return;
    }

    // Expect body fields:
    // { parcel_no, status, asking_price?, sold_price? }
    const { parcel_no, status, asking_price, sold_price } = req.body;

    if (!parcel_no || !status) {
      res.status(400).json({
        message: "parcel_no and status are required.",
      });
      return;
    }

    // Insert into firm_properties
    const insertQuery = `
      INSERT INTO firm_properties (
        firm_id,
        parcel_no,
        status,
        asking_price,
        sold_price,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *;
    `;
    const values = [
      user.firm_id,
      parcel_no,
      status,
      asking_price || null,
      sold_price || null,
    ];

    const { rows } = await pool.query(insertQuery, values);
    res.status(201).json({
      message: "Firm property record created successfully.",
      firmProperty: rows[0],
    });
    return;
  } catch (error) {
    console.error("Error creating firm property:", error);
    next(error);
  }
};

/**
 * GET /firm-properties
 * Fetch all firm_properties belonging to the authenticated user's firm.
 * Optionally filter by status (e.g. /firm-properties?status=sold).
 */
export const getFirmProperties: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized - No user context." });
      return;
    }

    const { status } = req.query;

    // Basic query to select from firm_properties for the user's firm.
    let baseQuery = `
      SELECT fp.id,
             fp.firm_id,
             fp.parcel_no,
             fp.status,
             fp.asking_price,
             fp.sold_price,
             fp.created_at,
             fp.updated_at,
             p.latitude,
             p.longitude,
             p.area_namee,
             p.block_no
        FROM firm_properties fp
   LEFT JOIN properties p ON fp.parcel_no = p.parcel_no
       WHERE fp.firm_id = $1
    `;

    const params: any[] = [user.firm_id];

    if (status) {
      params.push(status);
      baseQuery += ` AND fp.status = $${params.length}`;
    }

    baseQuery += " ORDER BY fp.created_at DESC";

    const { rows } = await pool.query(baseQuery, params);
    res.status(200).json({ firmProperties: rows });
    return;
  } catch (error) {
    console.error("Error fetching firm properties:", error);
    next(error);
  }
};


/**
 * GET /firm-properties/:parcelNo
 * Fetch a specific firm property by parcelNo.
 */
export const getFirmPropertyByParcel: RequestHandler = async (req, res, next) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      if (!user) {
        res.status(401).json({ message: "Unauthorized - No user context." });
        return;
      }
  
      const { parcelNo } = req.params; // from the URL path
  
      if (!parcelNo) {
        res.status(400).json({ message: "Missing parcelNo parameter." });
        return;
      }
  
      const query = `
        SELECT fp.id,
               fp.firm_id,
               fp.parcel_no,
               fp.status,
               fp.asking_price,
               fp.sold_price,
               fp.created_at,
               fp.updated_at,
               p.latitude,
               p.longitude,
               p.area_namee,
               p.block_no
          FROM firm_properties fp
     LEFT JOIN properties p ON fp.parcel_no = p.parcel_no
         WHERE fp.firm_id = $1
           AND fp.parcel_no = $2
        LIMIT 1;
      `;
  
      const params = [user.firm_id, parcelNo];
      const { rows } = await pool.query(query, params);
  
      if (rows.length === 0) {
        res
          .status(404)
          .json({ message: `No firm_properties record found for parcelNo ${parcelNo}.` });
          return;
      }
  
      res.status(200).json({ firmProperty: rows[0] });
      return;
    } catch (error) {
      console.error("Error fetching firm property by parcelNo:", error);
      next(error);
    }
  };
  

/**
 * PATCH /firm-properties/:id
 * Update the status, asking_price, or sold_price (etc.) of a firm property record,
 * as long as it belongs to the authenticated user's firm.
 */

export const updateFirmProperty: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized - No user context." });
      return;
    }

    const { id } = req.params; // The firm_properties primary key
    const { parcel_no, status, asking_price, sold_price } = req.body;

    // If parcel_no isn't in the body, you can get it from the existing row,
    // but typically we expect the client to provide it for extra safety.
    if (!parcel_no) {
      res
        .status(400)
        .json({ message: "parcel_no is required to ensure we're updating the right record." });
      return;
    }

    const updates: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (status !== undefined) {
      updates.push(`status = $${index}`);
      values.push(status);
      index++;
    }
    if (asking_price !== undefined) {
      updates.push(`asking_price = $${index}`);
      values.push(asking_price);
      index++;
    }
    if (sold_price !== undefined) {
      updates.push(`sold_price = $${index}`);
      values.push(sold_price);
      index++;
    }

    if (updates.length === 0) {
      res.status(400).json({ message: "No valid fields to update." });
      return;
    }

    // Add updated_at
    updates.push(`updated_at = NOW()`);

    // We now check (id, firm_id, parcel_no) so we only update
    // the row that truly matches the user’s firm and the correct property.
    const updateQuery = `
      UPDATE firm_properties
         SET ${updates.join(", ")}
       WHERE id = $${index}            -- the firm_properties primary key
         AND firm_id = $${index + 1}   -- the user's firm
         AND parcel_no = $${index + 2} -- the correct property
      RETURNING *;
    `;

    values.push(id);
    values.push(user.firm_id);
    values.push(parcel_no);

    const { rows } = await pool.query(updateQuery, values);
    if (rows.length === 0) {
      res.status(404).json({
        message: "Firm property not found or not yours.",
      });
      return;
    }

    res.status(200).json({
      message: "Firm property updated successfully.",
      updatedProperty: rows[0],
    });
    return;
  } catch (error) {
    console.error("Error updating firm property:", error);
    next(error);
  }
};


/**
 * DELETE /firm-properties/:id
 * Remove a firm property record if it belongs to the user's firm.
 * If you only want admins to do this, add a role check.
 */
export const deleteFirmProperty: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized - No user context." });
      return;
    }

    const { id } = req.params;

    // (Optional) If you want only admins to delete, do a check:
    // if (user.role !== 'admin') {
    //   return res.status(403).json({ message: "Only admins can delete properties." });
    // }

    const deleteQuery = `
      DELETE FROM firm_properties
       WHERE id = $1
         AND firm_id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(deleteQuery, [id, user.firm_id]);

    if (rows.length === 0) {
      res.status(404).json({ message: "Firm property not found or not yours." });
      return;
    }

    res.status(200).json({
      message: "Firm property deleted successfully.",
      deletedProperty: rows[0],
    });
    return;
  } catch (error) {
    console.error("Error deleting firm property:", error);
    next(error);
  }
};
