/* pages/marketplace/land/[id].tsx (LandDetailPage) */
'use client';

import { useRouter } from 'next/router';
import React, { useEffect, useState, useMemo } from 'react';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
import Image from 'next/image';
import Seo from '@/shared/layouts-components/seo/seo';
import MapThumb from '@/components/marketplace/land/MapThumb';
import { Land } from '@/components/marketplace/land/LandCard';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';

const API = process.env.NEXT_PUBLIC_API_URL!;

/* pill badge */
const Pill: React.FC<{ text: string; variant?: string }> = ({
  text,
  variant = 'light',
}) => (
  <Badge bg={variant} className="fs-5 px-3 py-2 rounded-pill">
    {text}
  </Badge>
);

export default function LandDetailPage() {
  const { query } = useRouter();
  const { id } = query;

  const [land, setLand] = useState<Land | null>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [err, setErr] = useState<string | null>(null);

  /* fetch listing ---------------------------------------------------- */
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${API}/land/${id}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Listing not found');
        const { land } = await res.json();
        setLand(land);
        setGeo(JSON.parse(land.geojson)); // Polygon geometry
      } catch (e: any) {
        setErr(e.message);
      }
    })();
  }, [id]);

  /* wrap geometry → Feature for MapThumb ---------------------------- */
  const parcelFeature: Feature<Geometry, GeoJsonProperties> | null = useMemo(
    () =>
      geo
        ? {
            type: 'Feature',
            geometry: geo,
            properties: {},
          }
        : null,
    [geo]
  );

  /* early states ---------------------------------------------------- */
  if (err)
    return <p className="text-center text-danger my-5">{err}</p>;

  if (!land || !parcelFeature)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Image
          src="/assets/images/media/loader.svg"
          width={64}
          height={64}
          alt="Loading…"
          priority
        />
      </div>
    );

  if (land.status !== 'listed')
    return (
      <>
        <Seo title="Listing unavailable" />
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center px-3">
          <h1 className="fw-semibold mb-3">This land is no longer available</h1>
          <p className="text-muted fs-5">
            The owner has removed or sold the listing.
          </p>
        </div>
      </>
    );

  /* derived text ---------------------------------------------------- */
  const fmtArea = `${Math.round(land.shape_area).toLocaleString()} m²`;
  const fmtPrice =
    land.asking_price != null
      ? `${Number(land.asking_price).toLocaleString()} BHD`
      : 'Price on request';

  /* render ---------------------------------------------------------- */
  return (
    <>
      <Seo title={land.title ?? 'Land Listing'} />

      {/* ---------------- hero card with map ---------------- */}
      <Container fluid className="pt-5 px-0 d-flex justify-content-center">
        <Card
          className="shadow-sm overflow-hidden"
          style={{
            width: 'min(92%, 840px)',
            borderRadius: '1rem',
            marginTop: '7rem',
          }}
        >
          <MapThumb
            parcelFeature={parcelFeature}
            center={[land.longitude, land.latitude]}
            movable={false}
            showMeasurements
            heightPx={300}
          />

          <Card.Body className="d-flex justify-content-between">
            <Pill text={fmtPrice} variant="danger" />
            <Pill text={fmtArea} variant="secondary" />
          </Card.Body>
        </Card>
      </Container>

      {/* ---------------- details & second map ---------------- */}
      <Container className="my-5 px-3 px-md-4 px-lg-5">
        <Row className="g-4">
          <Col lg={8}>
            <h2 className="fw-semibold mb-3">
              {land.title ?? 'Untitled Land'}
            </h2>

            <p className="text-muted mb-2">
              <i className="ti ti-map-pin me-1" />
              {land.area_namee || '—'}
              {land.block_no ? ` • Block ${land.block_no}` : ''}
              {land.nzp_code ? ` • Class: ${land.nzp_code}` : ''}
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
                  <a
                    href="tel:+97332000000"
                    className="text-decoration-none"
                  >
                    {land.realtor_name}
                  </a>
                </p>
                <p className="mb-2">
                  <i className="ti ti-phone me-2" />
                  <a
                    href="tel:+97332000000"
                    className="text-decoration-none"
                  >
                    {land.phone_number}
                  </a>
                </p>
                <p className="mb-0">
                  <i className="ti ti-mail me-2" />
                  <a
                    href="mailto:info@example.com"
                    className="text-decoration-none"
                  >
                    {land.email}
                  </a>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h4 className="fw-semibold mt-5 mb-3">Location</h4>
        <MapThumb
          parcelFeature={parcelFeature}
          center={[land.longitude, land.latitude]}
          heightPx={400}
          movable
        />
      </Container>
    </>
  );
}

LandDetailPage.layout = 'BlankLayout';
