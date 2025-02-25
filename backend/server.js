const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios'); 
require('dotenv').config();     

const app = express();

app.use(cors({
  origin: [
    process.env.ORIGIN1 || 'http://localhost:3000',
    process.env.ORIGIN2 || 'http://localhost:3001',
    process.env.ORIGIN3 || 'http://192.168.100.147:3001',
    process.env.ORIGIN4 || 'http://147.182.185.158:3002'
  ]
}));

app.use(express.json()); 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ---------------------------------------------------------------------
// HELPER: Build the base URL from env, then append endpoints
// ---------------------------------------------------------------------
const flaskBaseUrl = process.env.FLASK_URL || 'http://localhost:5001';
const flaskPredictUrl = `${flaskBaseUrl}/predict`;
const flaskFetchParcelUrl = `${flaskBaseUrl}/fetchParcel`;

// ---------------------------------------------------------------------
// GET /coordinates
// ---------------------------------------------------------------------
app.get('/coordinates', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        parcel_no,
        ST_AsGeoJSON(ST_Transform(geometry, 4326)) AS geojson
      FROM properties;
    `);

    const geojsonData = {
      type: 'FeatureCollection',
      features: result.rows.map((row) => ({
        type: 'Feature',
        geometry: JSON.parse(row.geojson),
        properties: {
          parcel_no: row.parcel_no
        },
      })),
    };

    res.json(geojsonData);
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    res.status(500).send('Server error');
  }
});

// ---------------------------------------------------------------------
// GET /parcelData/:parcelNo
// ---------------------------------------------------------------------
app.get('/parcelData/:parcelNo', async (req, res) => {
  try {
    const { parcelNo } = req.params;
    
    const result = await pool.query(`
      SELECT
        parcel_no,
        ewa_edd,
        ewa_wdd,
        roads,
        sewer,
        nzp_code,
        shape_area,
        longitude,
        latitude
      FROM properties
      WHERE parcel_no = $1;
    `, [parcelNo]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Parcel not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching parcel data:', error);
    res.status(500).send('Server error');
  }
});

// ---------------------------------------------------------------------
// POST /predict (calls Flask /predict)
// ---------------------------------------------------------------------
app.post('/predict', async (req, res) => {
  try {
    const inputData = req.body;

    // Now calls something like http://localhost:5001/predict
    const flaskResponse = await axios.post(flaskPredictUrl, inputData, { timeout: 10000 });

    return res.json({
      success: true,
      ...flaskResponse.data,
    });

  } catch (error) {
    console.error('Error in /predict:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post('/addValuation', async (req, res) => {
  try {
    const {
      password,
      parcel_no,
      valuation_type,
      valuation_amount,
      agent_name,
      num_of_roads,
      listing_size
    } = req.body;

    // 1. Check password
    if (password !== '93939393') {
      return res.status(403).json({ success: false, message: 'Invalid password.' });
    }

    // 2. Check if the property exists in the "properties" table
    const propertyResult = await pool.query(
      "SELECT 1 FROM properties WHERE parcel_no = $1 LIMIT 1;",
      [parcel_no]
    );

    // 2a. If property doesn't exist, attempt to fetch it via the Flask endpoint
    if (propertyResult.rows.length === 0) {
      const flaskResponse = await axios.post(flaskFetchParcelUrl, { parcel_no }, { timeout: 10000 });
      if (!flaskResponse.data.success) {
         return res.status(404).json({
           success: false,
           message: 'Property not found and could not be fetched.'
         });
      }
    }

    // 3. Now that we know the property is in "properties",
    //    check if this EXACT valuation type for this parcel already exists.
    const existingValuation = await pool.query(`
      SELECT 1 
      FROM valuations 
      WHERE parcel_no = $1 AND valuation_type = $2
      LIMIT 1;
    `, [parcel_no, valuation_type]);

    if (existingValuation.rows.length > 0) {
      // The parcel + valuation_type combo is already in valuations table
      return res.status(400).json({
        success: false,
        message: 'This valuation already exists for that parcel.'
      });
    }

    // 4. Insert the valuation now that it's guaranteed to be unique
    const insertQuery = `
      INSERT INTO valuations (
        parcel_no,
        valuation_type,
        valuation_amount,
        agent_name,
        num_of_roads,
        listing_size
      )
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await pool.query(insertQuery, [
      parcel_no,
      valuation_type,
      valuation_amount,
      agent_name,
      num_of_roads,
      listing_size
    ]);

    return res.json({ success: true, message: 'Valuation inserted successfully.' });
  } catch (error) {
    console.error('Error in /addValuation:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// ---------------------------------------------------------------------
// GET /ensureParcel/:parcelNo
// Forcing the property fetch if not present
// ---------------------------------------------------------------------
app.get('/ensureParcel/:parcelNo', async (req, res) => {
  try {
    const { parcelNo } = req.params;
    // calls http://localhost:5001/fetchParcel
    const flaskResponse = await axios.post(flaskFetchParcelUrl, { parcel_no: parcelNo }, { timeout: 10000 });
    res.json(flaskResponse.data);
  } catch (error) {
    console.error('Error in /ensureParcel:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------------------------------------------------------------------
// START THE SERVER
// ---------------------------------------------------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
