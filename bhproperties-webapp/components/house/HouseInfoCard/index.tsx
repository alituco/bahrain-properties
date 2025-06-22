'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import SpkAlert from '@/shared/@spk-reusable-components/reusable-uielements/spk-alert';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface Props { propertyId: number; }

export default function HouseInfoCard({ propertyId }: Props) {
  const [data, setData] = useState<any | null>(null);
  const [err , setErr ] = useState<string | null>(null);

  useEffect(() => { (async () => {
    try {
      const r = await fetch(`${API}/house/${propertyId}`, { credentials: 'include' });
      if (!r.ok) throw new Error(await r.text());
      const { property } = await r.json();
      setData(property);
    } catch (e: any) { setErr(e.message); }
  })(); }, [propertyId]);

  if (!data) return <Card body><Spinner animation="border" /></Card>;

  return (
    <Card className="custom-card mb-4">
      <Card.Header><div className="card-title">House Details</div></Card.Header>
      <Card.Body>
        <Row className="gy-2">
          <Col sm={6}><b>Bedrooms:</b> {data.bedrooms}</Col>
          <Col sm={6}><b>Bathrooms:</b> {data.bathrooms}</Col>
          <Col sm={6}><b>Floors:</b> {data.floors ?? '—'}</Col>
          <Col sm={6}><b>Plot Size (m²):</b> {data.plot_size_m2 ?? '—'}</Col>
          <Col sm={6}><b>Built-up (m²):</b> {data.built_up_m2 ?? '—'}</Col>
          <Col sm={6}><b>Parking Spots:</b> {data.parking_spots ?? '—'}</Col>
          <Col sm={6}><b>Furnished:</b> {data.furnished ? 'Yes' : 'No'}</Col>
          <Col sm={6}><b>Block:</b> {data.block_no ?? '—'}</Col>
          <Col sm={6}><b>Area:</b> {data.area_name_en ?? '—'}</Col>
        </Row>

        <hr className="my-3" />

        {err && (
          <SpkAlert
            variant="danger"
            CustomClass="mt-3"
            show
            onClose={() => setErr(null)}
          >
            {err}
          </SpkAlert>
        )}
      </Card.Body>
    </Card>
  );
}
