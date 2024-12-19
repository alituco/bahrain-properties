const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
})); // Enable CORS to allow requests from your React app
app.use(express.json()); // Allow the server to parse JSON bodies

// Configure PostgreSQL pool (use the DATABASE_URL from .env file)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // If SSL is forced, allow it but don't enforce strict verification
    },
  });
  

// Define a route to get coordinates from the database
app.get('/coordinates', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT parcel_no, ST_AsGeoJSON(ST_Transform(geometry, 4326)) AS geojson FROM properties;;
      `);
  
      const geojsonData = {
        type: 'FeatureCollection',
        features: result.rows.map(row => ({
          type: 'Feature',
          geometry: JSON.parse(row.geojson),
          properties: {
            parcel_no: row.parcel_no
          }, // Empty properties object (you can add data here)
        })),
      };
  
      res.json(geojsonData); // Return a valid GeoJSON object
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      res.status(500).send('Server error');
    }
  });



  // starting server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});