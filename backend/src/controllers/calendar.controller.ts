import { Request, Response } from 'express';
import { pool } from '../config/db';


export const addEvent = async (req: Request, res: Response) => {
  const { event_id, user_id, start_time, end_time, event_date } = req.body;

  const startTS = `${event_date} ${start_time}:00`;
  const endTS   = `${event_date} ${end_time}:00`;

  try {
    await pool.query(
      `INSERT INTO calendar_events (event_id, user_id, start_time, end_time, date_of_event)
       VALUES ($1, $2, $3, $4, $5)`,
      [event_id, user_id, startTS, endTS, event_date]
    );

    res.status(200).json({ message: 'Event added successfully' });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Failed to add event' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const event_id = Number(req.body.event_id);;

  try {
    await pool.query(
      `DELETE FROM calendar_events WHERE event_id = $1`,
      [event_id]
    );

    res.status(202).json({ message: 'Event was deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

export const getUserEvents= async (req: Request, res: Response) => {
  const { user_id, date } = req.query;

  try {
    const result = await pool.query(
      `SELECT start_time, end_time FROM calendar_events
       WHERE user_id = $1 AND date_of_event = $2`,
      [user_id, date]
    );
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch user events" });
  }
};
