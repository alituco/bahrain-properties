import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

/**
 * POST /property-notes
 * Add a new property note.
 */
export const addNote: RequestHandler = async (req, res, next) => {
  try {
    const { parcel_no, listing_id, note_text } = req.body;
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      res.status(401).json({ message: 'Not logged in or missing user context.' });
      return;
    }
    if (!note_text) {
      res.status(400).json({ message: 'note_text is required.' });
      return;
    }

    const noteId = uuidv4();

    const insertQuery = `
      INSERT INTO property_notes (
        note_id, parcel_no, firm_id, listing_id, user_id, note_text, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *;
    `;
    const values = [
      noteId,
      parcel_no || null,
      user.firm_id,        // ensures note belongs to the same firm
      listing_id || null,
      user.user_id,
      note_text
    ];

    const { rows } = await pool.query(insertQuery, values);
    res.status(201).json({
      message: 'Note created successfully.',
      note: rows[0],
    });
    return;
  } catch (error) {
    console.error('Error creating note:', error);
    next(error);
  }
};

/**
 * GET /property-notes
 * Returns notes for the user's firm,
 * optionally filtered by parcel_no or listing_id.
 */
/**
 * GET /property-notes
 * Returns notes for the user's firm,
 * optionally filtered by parcel_no or listing_id.
 */
/**
 * GET /property-notes
 * Returns notes for the user's firm,
 * optionally filtered by parcel_no or listing_id.
 */
export const getNotesByFirm: RequestHandler = async (req, res, next) => {
    try {
      const user = (req as AuthenticatedRequest).user;
      if (!user) {
        res.status(401).json({ message: 'Not logged in or missing user context.' });
        return;
      }
  
      const { parcel_no, listing_id } = req.query;
  
      // Updated query with JOIN to get user first_name, last_name
      let baseQuery = `
        SELECT pn.*,
               u.first_name,
               u.last_name
          FROM property_notes pn
          JOIN users u ON pn.user_id = u.user_id
         WHERE pn.firm_id = $1
      `;
      const queryParams: any[] = [user.firm_id];
  
      // Optional filters
      if (parcel_no) {
        queryParams.push(parcel_no);
        baseQuery += ` AND pn.parcel_no = $${queryParams.length}`;
      }
      if (listing_id) {
        queryParams.push(listing_id);
        baseQuery += ` AND pn.listing_id = $${queryParams.length}`;
      }
  
      baseQuery += ' ORDER BY pn.created_at DESC';
  
      const { rows } = await pool.query(baseQuery, queryParams);
      res.status(200).json({
        notes: rows // each note now has first_name, last_name
      });
      return;
    } catch (error) {
      console.error('Error fetching notes:', error);
      next(error);
    }
  };
  
  

/**
 * DELETE /property-notes/:noteId
 * Delete a note if user is admin.
 */
export const deleteNote: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    const { noteId } = req.params;

    if (!user) {
      res.status(401).json({ message: 'Not logged in or missing user context.' });
      return;
    }
    if (user.role !== 'admin') {
      res.status(403).json({ message: 'Only admins can delete notes.' });
      return;
    }

    const deleteQuery = `DELETE FROM property_notes WHERE note_id = $1 RETURNING *;`;
    const { rows } = await pool.query(deleteQuery, [noteId]);

    if (rows.length === 0) {
      res.status(404).json({ message: 'Note not found.' });
      return;
    }

    res.status(200).json({
      message: 'Note deleted successfully.',
      deletedNote: rows[0],
    });
    return;
  } catch (error) {
    console.error('Error deleting note:', error);
    next(error);
  }
};
