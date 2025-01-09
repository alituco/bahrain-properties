"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Inline style objects ---
const containerStyle = {
  padding: "2rem",
  backgroundColor: "#fdfdfd",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  maxWidth: "600px",
  margin: "2rem auto",
  fontFamily: "'Arial', sans-serif",
};

const headingStyle = {
  fontSize: "1.8rem",
  marginBottom: "1rem",
  color: "#333",
  textAlign: "center" as const,
};

const infoContainerStyle = {
  marginBottom: "1.5rem",
};

const infoRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "0.75rem",
};

const labelStyle = {
  fontWeight: "bold",
  color: "#555",
};

const valueStyle = {
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  marginTop: "0.25rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  backgroundColor: "#0070f3",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontSize: "1rem",
  cursor: "pointer",
  marginTop: "1rem",
};

const errorStyle = {
  color: "red",
  marginTop: "1rem",
};

const predictionStyle = {
  marginTop: "1rem",
  fontSize: "1.2rem",
  color: "#006400",
};

const ParcelDetails: React.FC = () => {
  const params = useParams();
  const parcelNo = params.parcelNo as string;

  // State
  const [shapeArea, setShapeArea] = useState<number>(0);
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [roads, setRoads] = useState<string>("asphalt");
  const [ewaEdd, setEwaEdd] = useState<string>("abc");
  const [ewaWdd, setEwaWdd] = useState<string>("def");
  const [sewer, setSewer] = useState<string>("connected");
  const [nzpCode, setNzpCode] = useState<string>("RESIDENTIAL");
  const [numOfRoads, setNumOfRoads] = useState<number>(0);

  const [prediction, setPrediction] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch parcel data if we have a parcelNo
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
      } catch (err) {
        console.error("Error fetching parcel data:", err);
      }
    };

    fetchParcelData();
  }, [parcelNo]);

  // Handle prediction
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

  if (!parcelNo) {
    return <div>Invalid request. No parcel number in URL.</div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Parcel Details</h2>
      <p style={{ textAlign: "center", marginBottom: "2rem" }}>
        Parcel Number: <strong>{parcelNo}</strong>
      </p>

      {/* Info container */}
      <div style={infoContainerStyle}>
        {/* Shape Area */}
        <div style={infoRowStyle}>
          <div style={labelStyle}>Shape Area:</div>
          <div style={valueStyle}>{shapeArea}</div>
        </div>

        {/* Latitude */}
        <div style={infoRowStyle}>
          <div style={labelStyle}>Latitude:</div>
          <div style={valueStyle}>{latitude}</div>
        </div>

        {/* Longitude */}
        <div style={infoRowStyle}>
          <div style={labelStyle}>Longitude:</div>
          <div style={valueStyle}>{longitude}</div>
        </div>

        {/* Roads */}
        <div style={infoRowStyle}>
          <div style={labelStyle}>Roads:</div>
          <div style={valueStyle}>{roads}</div>
        </div>

        {/* EWA EDD */}
        <div style={infoRowStyle}>
          <div style={labelStyle}>EWA EDD:</div>
          <div style={valueStyle}>{ewaEdd}</div>
        </div>

        {/* EWA WDD */}
        <div style={infoRowStyle}>
          <div style={labelStyle}>EWA WDD:</div>
          <div style={valueStyle}>{ewaWdd}</div>
        </div>

        {/* Sewer */}
        <div style={infoRowStyle}>
          <div style={labelStyle}>Sewer:</div>
          <div style={valueStyle}>{sewer}</div>
        </div>

        {/* NZP Code */}
        <div style={infoRowStyle}>
          <div style={labelStyle}>NZP Code:</div>
          <div style={valueStyle}>{nzpCode}</div>
        </div>
      </div>

      {/* Number of Roads (Only editable input) */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>Number of Roads:</label>
        <input
          type="number"
          value={numOfRoads}
          onChange={(e) => setNumOfRoads(Number(e.target.value))}
          style={inputStyle}
        />
      </div>

      {/* Predict button */}
      <button onClick={handlePredict} style={buttonStyle}>
        Predict
      </button>

      {/* Error display */}
      {error && <div style={errorStyle}>Error: {error}</div>}

      {/* Prediction display */}
      {prediction !== null && !error && (
        <div style={predictionStyle}>
          <b>Predicted Valuation:</b> {prediction} BHD
        </div>
      )}
    </div>
  );
};

export default ParcelDetails;
