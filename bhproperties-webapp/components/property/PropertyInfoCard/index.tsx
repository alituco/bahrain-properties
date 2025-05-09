"use client";

import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import SpkAlert from "@/shared/@spk-reusable-components/reusable-uielements/spk-alert";

const API = process.env.NEXT_PUBLIC_API_URL!;

interface Props { parcelNo: string; }

const PropertyInfoCard: React.FC<Props> = ({ parcelNo }) => {
  const [data, setData] = useState<any | null>(null);
  const [roads,       setRoads]       = useState("");
  const [numRoads,    setNumRoads]    = useState<number>(0);
  const [predicting,  setPredicting]  = useState(false);
  const [prediction,  setPrediction]  = useState<number | null>(null);
  const [err,         setErr]         = useState<string | null>(null);

  // fetch basic parcel data ---------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/parcelData/${parcelNo}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const d  = await res.json();
        setData(d);
        setRoads(d.roads);                          // init local inputs
      } catch (e:any) { setErr(e.message); }
    })();
  }, [parcelNo]);

  async function handlePredict() {
    if (!data) return;
    setPredicting(true); setErr(null); setPrediction(null);
    try {
      const body = { ...data, parcelNo, roads, num_of_roads: numRoads };
      const res  = await fetch(`${API}/predict`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { prediction } = await res.json();
      setPrediction(prediction);
    } catch (e:any) { setErr(e.message); }
    finally        { setPredicting(false); }
  }

  if (!data) return <Card body><Spinner animation="border" /></Card>;

  return (
    <Card className="custom-card mb-4">
      <Card.Header><div className="card-title">Parcel Details</div></Card.Header>
      <Card.Body>
        <Row className="gy-2">
          <Col sm={6}><b>Parcel No:</b> {parcelNo}</Col>
          <Col sm={6}><b>Shape Area (m²):</b> {data.shape_area}</Col>
          <Col sm={6}><b>Latitude:</b> {data.latitude}</Col>
          <Col sm={6}><b>Longitude:</b> {data.longitude}</Col>
          <Col sm={6}><b>NZP Code:</b> {data.nzp_code}</Col>
          <Col sm={6}><b>Block No:</b> {data.block_no}</Col>
        </Row>

        <hr className="my-3"/>

        <Row className="gy-3">
          <Col md={4}>
            <Form.Label>Roads</Form.Label>
            <Form.Control value={roads} onChange={e=>setRoads(e.target.value)} />
          </Col>
          <Col md={4}>
            <Form.Label>Number of Roads</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={numRoads}
              onChange={e=>setNumRoads(+e.target.value)}
            />
          </Col>
          <Col md={4} className="d-flex align-items-end">
            <Button disabled={predicting} onClick={handlePredict}>
              {predicting && <Spinner size="sm" className="me-1"/>}
              Predict
            </Button>
          </Col>
        </Row>

        {prediction!==null && !err && (
          <SpkAlert variant="success" CustomClass="mt-3" show>
            Predicted valuation: <b>{prediction} BHD</b>
          </SpkAlert>
        )}
        {err && (
          <SpkAlert variant="danger" CustomClass="mt-3" show onClose={()=>setErr(null)}>
            {err}
          </SpkAlert>
        )}
      </Card.Body>
    </Card>
  );
};

export default PropertyInfoCard;
