/* components/marketplace/land/LandCard.tsx */
'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from 'react-bootstrap';
import MapThumb from '../MapThumb';

import { Feature, Geometry, GeoJsonProperties } from 'geojson';

/* ------------ data model ------------ */
export interface Land {
  id            : number;
  title         : string | null;
  asking_price  : number | null;
  longitude     : number;          // WGS-84
  latitude      : number;          // WGS-84
  geojson       : string;          // polygon as JSON string
  area_namee    : string;
  nzp_code      : string;
  shape_area    : number;
  description   : string;
  block_no      : string;
  status        : string;
  realtor_name  : string;
  email         : string;
  phone_number ?: number | null;
}

/* ------------ component ------------ */
const LandCard: React.FC<{ land: Land }> = ({ land }) => {
  /* parse geojson → Feature */
  let parcelFeature: Feature<Geometry, GeoJsonProperties> | null = null;
  try {
    const geometry = JSON.parse(land.geojson) as Geometry;
    parcelFeature = {
      type: 'Feature',
      geometry,
      properties: { parcel_no: land.id.toString() },
    };
  } catch {
    parcelFeature = null;
  }

  const fmtArea = `${Math.round(land.shape_area).toLocaleString()} m²`;
  const href    = `/marketplace/land/${land.id}`;

  return (
    <Link href={href}>
      <Card className="h-100 shadow-sm">
        {/* ---------- map / placeholder ---------- */}
        <div className="position-relative border-bottom border-light-subtle">
          {parcelFeature ? (
            <MapThumb
              parcelFeature={parcelFeature}
              center={[land.longitude, land.latitude]}
              showMeasurements={true}                
            />
          ) : (
            <div
              className="d-flex justify-content-center align-items-center bg-light text-muted small"
              style={{ height: 180, borderRadius: 6 }}
            >
              No map
            </div>
          )}

          {/* ---------- price badge ---------- */}
          {land.asking_price != null && (
            <span
              className="badge px-3 py-2 position-absolute top-0 start-0 m-2 fs-6"
              style={{
                backgroundColor: '#f4f1f1',
                color: '#d12c2c',
                opacity: 0.8,
                borderRadius: '0.7rem',
              }}
            >
              {Number(land.asking_price).toLocaleString()} BHD
            </span>
          )}
        </div>

        {/* ---------- card body ---------- */}
        <Card.Body>
          <h6 className="fw-semibold mb-2">
            {land.title?.trim() || 'Untitled Land'}
          </h6>

          <p className="mb-3 text-muted">
            <i className="ti ti-map-pin me-1" />
            {land.area_namee || '—'}
          </p>

          <p className="mb-0">
            <span className="fw-medium">{fmtArea}</span>
            <span className="text-muted">
              {' '}
              • Class: {land.nzp_code || '—'}
            </span>
          </p>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default LandCard;
