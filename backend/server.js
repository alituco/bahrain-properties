const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios'); // <-- We’ll use axios to call the Flask service
require('dotenv').config();     // Load environment variables

const app = express();

// Enable CORS for specified origins
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://192.168.100.147:3001'
  ]
}));

app.use(express.json()); // Parse JSON bodies

// Configure PostgreSQL pool (use the DATABASE_URL from .env)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// -----------------------------------------------------------------------
// GET /coordinates
// -----------------------------------------------------------------------
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

// GET /parcelData/:parcelNo
app.get('/parcelData/:parcelNo', async (req, res) => {
  try {
    // Extract parcelNo from the URL params
    const { parcelNo } = req.params;
    
    // Use a parameterized query to avoid SQL injection
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
      // No matching parcel found
      return res.status(404).json({ error: "Parcel not found" });
    }

    // Return the single row that matches the parcel_no
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching parcel data:', error);
    res.status(500).send('Server error');
  }
});


// -----------------------------------------------------------------------
// POST /predict
// -----------------------------------------------------------------------
app.post('/predict', async (req, res) => {
  try {
    // 1. Extract user inputs from the request body
    // e.g., { parcelNo, shape_area, num_of_roads, longitude, latitude, ... }
    const inputData = req.body;

    // 2. Call your Flask model endpoint
    //    Make sure your Flask server is running on http://localhost:5000/predict
    const flaskUrl = 'http://localhost:5001/predict';
    const flaskResponse = await axios.post(flaskUrl, inputData, { timeout: 10000 });

    // 3. Return the Flask response back to the client
    //    This might look like { success: true, prediction: ..., input_used: {...} }
    return res.json({
      success: true,
      ...flaskResponse.data, // Spread the response from Flask
    });

  } catch (error) {
    console.error('Error in /predict:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// -----------------------------------------------------------------------
// Start the server
// -----------------------------------------------------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
