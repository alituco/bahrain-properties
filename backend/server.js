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
    process.env.ORIGIN3 || 'http://192.168.100.147:3001'
  ]
}));

app.use(express.json()); 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

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

app.post('/predict', async (req, res) => {
  try {
    const inputData = req.body;

    const flaskUrl = process.env.FLASK_URL || 'http://localhost:5001/predict';
    const flaskResponse = await axios.post(flaskUrl, inputData, { timeout: 10000 });

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
