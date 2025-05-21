import { RequestHandler } from 'express';
import { pool } from '../config/db';
import axios from 'axios';
import { config } from '../config/env';


export const addValuation: RequestHandler = async (req, res) => {
  try {
    const {
      password,
      parcel_no,
      valuation_type,
      valuation_amount,
      agent_name,
      num_of_roads,
      listing_size,
    } = req.body;

    if (password !== '93939393') {
      res.status(403).json({ success: false, message: 'Invalid password.' });
      return; 
    }

    const propertyResult = await pool.query(
      'SELECT 1 FROM properties WHERE parcel_no = $1 LIMIT 1;',
      [parcel_no]
    );
    if (propertyResult.rows.length === 0) {
      const flaskFetchParcelUrl = `${config.flaskBaseUrl}/fetchParcel`;
      const flaskResponse = await axios.post(flaskFetchParcelUrl, { parcel_no }, { timeout: 10000 });
      if (!flaskResponse.data.success) {
        res.status(404).json({
          success: false,
          message: 'Property not found and could not be fetched.',
        });
        return;
      }
    }

    const existingVal = await pool.query(
      `
        SELECT 1
        FROM valuations
        WHERE parcel_no = $1
          AND valuation_type = $2
        LIMIT 1;
      `,
      [parcel_no, valuation_type]
    );

    if (existingVal.rows.length > 0) {
      res.status(400).json({
        success: false,
        message: 'This valuation already exists for that parcel.',
      });
      return;
    }

    await pool.query(
      `
        INSERT INTO valuations (
          parcel_no,
          valuation_type,
          valuation_amount,
          agent_name,
          num_of_roads,
          listing_size
        )
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [parcel_no, valuation_type, valuation_amount, agent_name, num_of_roads, listing_size]
    );

    res.json({
      success: true,
      message: 'Valuation inserted successfully.',
    });
  } catch (error) {
    console.error('Error in addValuation:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
