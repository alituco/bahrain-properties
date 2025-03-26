"use client";

import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  AlertTitle,
} from "@mui/material";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ParcelInfoProps {
  parcelNo: string;
}

const ParcelInfo: React.FC<ParcelInfoProps> = ({ parcelNo }) => {
  const [shapeArea, setShapeArea] = useState<number>(0);
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [roads, setRoads] = useState<string>("asphalt");
  const [ewaEdd, setEwaEdd] = useState<string>("abc");
  const [ewaWdd, setEwaWdd] = useState<string>("def");
  const [sewer, setSewer] = useState<string>("connected");
  const [nzpCode, setNzpCode] = useState<string>("RESIDENTIAL");
  const [blockNo, setBlockNo] = useState<number>(0);
  const [numOfRoads, setNumOfRoads] = useState<number>(0);

  // Prediction states
  const [prediction, setPrediction] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch parcel details
  useEffect(() => {
    if (!parcelNo) return;
    const fetchParcelData = async () => {
      try {
        const response = await fetch(`${API_URL}/parcelData/${parcelNo}`);
        if (!response.ok) {
          throw new Error(`Fetch error: ${response.status}`);
        }
        const data = await response.json();
        setShapeArea(data.shape_area);
        setLatitude(data.latitude);
        setLongitude(data.longitude);
        setRoads(data.roads);
        setEwaEdd(data.ewa_edd);
        setEwaWdd(data.ewa_wdd);
        setSewer(data.sewer);
        setNzpCode(data.nzp_code);
        setBlockNo(data.block_no);
      } catch (err) {
        console.error("Error fetching parcel data:", err);
      }
    };
    fetchParcelData();
  }, [parcelNo]);

  // Predict Valuation
  const handlePredict = async () => {
    try {
      setError(null);
      setPrediction(null);

      if (!parcelNo) {
        setError("Invalid request. No parcel number.");
        return;
      }

      const requestBody = {
        parcelNo,
        shape_area: shapeArea,
        latitude,
        longitude,
        roads,
        ewa_edd: ewaEdd,
        ewa_wdd: ewaWdd,
        sewer,
        nzp_code: nzpCode,
        num_of_roads: numOfRoads,
        block_no: blockNo,
      };

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Parcel Details
      </Typography>
      <Typography align="center" paragraph>
        Parcel Number: <strong>{parcelNo}</strong>
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1"><strong>Shape Area:</strong> {shapeArea}</Typography>
        <Typography variant="subtitle1"><strong>Latitude:</strong> {latitude}</Typography>
        <Typography variant="subtitle1"><strong>Longitude:</strong> {longitude}</Typography>
        <Typography variant="subtitle1"><strong>Roads:</strong> {roads}</Typography>
        <Typography variant="subtitle1"><strong>EWA EDD:</strong> {ewaEdd}</Typography>
        <Typography variant="subtitle1"><strong>EWA WDD:</strong> {ewaWdd}</Typography>
        <Typography variant="subtitle1"><strong>Sewer:</strong> {sewer}</Typography>
        <Typography variant="subtitle1"><strong>NZP Code:</strong> {nzpCode}</Typography>
        <Typography variant="subtitle1"><strong>Block No:</strong> {blockNo}</Typography>
      </Box>

      <TextField
        label="Number of Roads"
        type="number"
        value={numOfRoads}
        onChange={(e) => setNumOfRoads(Number(e.target.value))}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={handlePredict}>
        Predict
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      {prediction !== null && !error && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <AlertTitle>Predicted Valuation</AlertTitle>
          {prediction} BHD
        </Alert>
      )}
    </Paper>
  );
};

export default ParcelInfo;
