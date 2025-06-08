import { RequestHandler } from 'express';
import { bucket } from '../config/firebase';
import { pool }  from '../config/db';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

// POST /firm-properties/:id/images
export const createFirmPropertyImage: RequestHandler =
async (req, res, next) => {
  try {
    const { id } = req.params;                             // firm_properties.id
    const user   = (req as AuthenticatedRequest).user!;
    const files  = (req.files as Express.Multer.File[]) ?? [];

    if (!files.length) {
      res.status(400).json({ message: 'No files uploaded.' });
    }

    const inserted: any[] = [];

    for (const file of files) {
      const dest = `firm-${user.firm_id}/${id}/${Date.now()}_${file.originalname}`;

      // upload from memory buffer
      const uploaded = await bucket.file(dest)
        .save(file.buffer, { contentType: file.mimetype });

      // make public & get URL (or use signed URLs if you prefer)
      await bucket.file(dest).makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${dest}`;

      // store in DB
      const { rows } = await pool.query(
        `INSERT INTO firm_property_images
           (property_id, file_name, file_url, uploaded_by)
         VALUES ($1,$2,$3,$4)
         RETURNING id, file_url AS url`,
        [id, file.originalname, publicUrl, user.user_id]
      );
      inserted.push(rows[0]);
    }

    res.status(201).json(inserted);   // array of {id,url}
  } catch (err) {
    next(err);
  }
};

// DELETE /firm-properties/:id/images/:imgId
export const deleteFirmPropertyImage: RequestHandler =
async (req, res, next) => {
  try {
    const { id: propertyId, imgId } = req.params;
    const user = (req as AuthenticatedRequest).user!;

    // 1･load row – confirm it belongs to same firm
    const { rows } = await pool.query(
      `SELECT fpi.file_url, fp.firm_id
         FROM firm_property_images fpi
    JOIN firm_properties fp ON fp.id = fpi.property_id
        WHERE fpi.id = $1`, [imgId]);

    if (!rows.length || rows[0].firm_id !== user.firm_id) {
      res.status(404).json({ message: 'Image not found.' });
    }

    // 2･delete from Firebase
    const path = rows[0].file_url.split(`/${bucket.name}/`)[1]; // after bucket/
    await bucket.file(path).delete().catch(() => {});           // ignore if missing

    // 3･delete from DB
    await pool.query(
      `DELETE FROM firm_property_images WHERE id = $1`, [imgId]);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};


export const listFirmPropertyImages: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized.' });
    }

    const { id } = req.params;          // firm_properties.id
    if (!id) {
      res.status(400).json({ message: 'Missing property id.' });
    }

    /* -------------------------------------------------------------
       1️⃣  Check the firm_property really belongs to this firm
    ----------------------------------------------------------------*/
    const propSQL =
      `SELECT id, firm_id
         FROM firm_properties
        WHERE id = $1`;
    const propRes = await pool.query(propSQL, [id]);

    if (propRes.rows.length === 0)
      res.status(404).json({ message: 'Property not found.' });

    if (propRes.rows[0].firm_id !== user.firm_id)
      res.status(403).json({ message: 'Not your property.' });

    /* -------------------------------------------------------------
       2️⃣  Fetch image rows
    ----------------------------------------------------------------*/
    const imgSQL =
      `SELECT id,
              file_name,
              file_url           -- this is the public URL you stored
         FROM firm_property_images
        WHERE property_id = $1
     ORDER BY id`;
    const { rows } = await pool.query(imgSQL, [id]);

    /* -------------------------------------------------------------
       3️⃣  (Optional) make signed URLs if bucket is private
    ----------------------------------------------------------------*/
    const images = await Promise.all(
      rows.map(async (r) => {
        let url = r.file_url;

        // If bucket is NOT public, uncomment below to issue a 1h signed URL
        // const [signedUrl] = await bucket
        //   .file(r.file_name)
        //   .getSignedUrl({
        //     action : 'read',
        //     expires: Date.now() + 60 * 60 * 1000   // 60 min
        //   });
        // url = signedUrl;

        return {
          id       : r.id,
          file_name: r.file_name,
          url
        };
      })
    );

    res.json({ images });

  } catch (err) {
    console.error('Error listing firm-property images:', err);
    next(err);
  }
};