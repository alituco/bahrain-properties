'use client';

import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Badge, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import Seo from '@/shared/layouts-components/seo/seo';
import MapDisplay from '@/components/marketplace/land/MapDisplay';
import { Land } from '@/components/marketplace/land/LandCard';

const API = process.env.NEXT_PUBLIC_API_URL!;

const Pill: React.FC<{ text: string; variant?: string }> = ({
  text,
  variant = 'light',
}) => <Badge bg={variant} className="fs-5 px-3 py-2 rounded-pill">{text}</Badge>;

export default function LandDetailPage() {
  const { query } = useRouter();
  const { id }   = query;

  const [land , setLand] = useState<Land | null>(null);
  const [geo  , setGeo ] = useState<any>(null);
  const [err  , setErr ] = useState<string|null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${API}/land/${id}`, { credentials:'include' });
        if (!res.ok) throw new Error('Listing not found');
        const { land } = await res.json();
        setLand(land);
        setGeo(JSON.parse(land.geojson));
      } catch (e:any) { setErr(e.message); }
    })();
  }, [id]);

  if (err)
    return <p className="text-center text-danger my-5">{err}</p>;

  if (!land || !geo)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );

  if (land.status !== 'listed')
    return (
      <>
        <Seo title="Listing unavailable" />
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center px-3">
          <h1 className="fw-semibold mb-3">This land is no longer available</h1>
          <p className="text-muted fs-5">The owner has removed or sold the listing.</p>
        </div>
      </>
    );

  const fmtArea  = `${Math.round(land.shape_area).toLocaleString()} m²`;
  const nzp_code  = land.nzp_code;
  const fmtPrice = land.asking_price != null
    ? `${Number(land.asking_price).toLocaleString()} BHD`
    : 'Price on request';

  return (
    <>
      <Seo title={land.title ?? 'Land Listing'} />

      <Container fluid className="pt-5 px-0 d-flex justify-content-center">
        <Card
          className="shadow-sm overflow-hidden"
          style={{
            width: 'min(92%, 840px)',
            borderRadius: '1rem',
            marginTop: '7rem',
          }}
        >
          <div style={{ }}>
            <div style={{ }} />
            <div style={{}}>
              <MapDisplay
                parcelFeature={geo}
                center={[land.longitude, land.latitude]}
                movable={false}
              />
            </div>
          </div>

          <Card.Body className="d-flex justify-content-between">
            <Pill text={fmtPrice} variant="danger" />
            <Pill text={fmtArea}  variant="secondary" />
          </Card.Body>
        </Card>
      </Container>

      <Container className="my-5 px-3 px-md-4 px-lg-5">
        <Row className="g-4">
          <Col lg={8}>
            <h2 className="fw-semibold mb-3">{land.title ?? 'Untitled Land'}</h2>

            <p className="text-muted mb-2">
              <i className="ti ti-map-pin me-1" />
              {land.area_namee || '—'}
              {land.block_no ? ` • Block ${land.block_no}` : ''}
              {land.nzp_code ? ` • Class: ${nzp_code}` : ''}
            </p>

            <p className="fs-5">
              {land.description?.trim() || 'No description provided.'}
            </p>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="fw-semibold mb-3">Contact</h5>
                <p className="mb-2">
                  <i className="ti ti-user me-2" />
                  <a href="tel:+97332000000" className="text-decoration-none">
                    {land.realtor_name}
                    
                  </a>
                </p>
                <p className="mb-2">
                  <i className="ti ti-phone me-2" />
                  <a href="tel:+97332000000" className="text-decoration-none">
                    {land.phone_number}
                  </a>
                </p>
                <p className="mb-0">
                  <i className="ti ti-mail me-2" />
                  <a href="mailto:info@example.com" className="text-decoration-none">
                    {land.email}
                  </a>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h4 className="fw-semibold mt-5 mb-3">Location</h4>
        <MapDisplay
          parcelFeature={geo}
          center={[land.longitude, land.latitude]}
          heightPx={400}
        />
      </Container>
    </>
  );
}

LandDetailPage.layout = 'BlankLayout';
