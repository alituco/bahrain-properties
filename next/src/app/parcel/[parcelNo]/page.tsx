"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ParcelDetails: React.FC = () => {
  const params = useParams();
  const parcelNo = params.parcelNo as string;

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

  if (!parcelNo) {
    return <div>Invalid request. No parcel number in URL.</div>;
  }

  useEffect(() => {
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
      } catch (err: any) {
        console.error("Error fetching parcel data:", err);
      }
    };

    fetchParcelData();
  }, [parcelNo]);

  const handlePredict = async () => {
    try {
      setError(null);
      setPrediction(null);

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
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Parcel Details</h2>
      <p>Parcel Number: {parcelNo}</p>

      <div style={{ marginTop: "1rem" }}>
        <label>
          Shape Area:
          <input
            type="number"
            value={shapeArea}
            onChange={(e) => setShapeArea(+e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>
          Latitude:
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(+e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>
          Longitude:
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(+e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>
          Roads:
          <input
            type="text"
            value={roads}
            onChange={(e) => setRoads(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>
          EWA EDD:
          <input
            type="text"
            value={ewaEdd}
            onChange={(e) => setEwaEdd(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>
          EWA WDD:
          <input
            type="text"
            value={ewaWdd}
            onChange={(e) => setEwaWdd(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>
          Sewer:
          <input
            type="text"
            value={sewer}
            onChange={(e) => setSewer(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>
          NZP Code:
          <input
            type="text"
            value={nzpCode}
            onChange={(e) => setNzpCode(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>
          Number of Roads:
          <input
            type="number"
            value={numOfRoads}
            onChange={(e) => setNumOfRoads(+e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>

      <button onClick={handlePredict} style={{ marginTop: "1rem" }}>
        Predict
      </button>

      {error && (
        <div style={{ color: "red", marginTop: "1rem" }}>
          Error: {error}
        </div>
      )}

      {prediction !== null && !error && (
        <div style={{ marginTop: "1rem" }}>
          <b>Predicted Valuation:</b> {prediction} BHD
        </div>
      )}
    </div>
  );
};

export default ParcelDetails;
