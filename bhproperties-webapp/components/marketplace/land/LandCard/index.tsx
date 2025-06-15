/* ------------------------------------------------------------------
   LAND – card with mini-map, meta info & price badge
   -----------------------------------------------------------------*/
'use client';

import React from 'react';
import { Card } from 'react-bootstrap';
import MapThumb from '../MapThumb';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';

export interface Land {
  id           : number;
  parcel_no    : string;
  title        : string | null;
  asking_price : number | null;
  longitude    : number;
  latitude     : number;
  geojson      : string;     // polygon as GeoJSON text
  area_namee   : string;     // location
  nzp_code     : string;     // classification
  shape_area   : number;     // m²
}

const LandCard: React.FC<{ land: Land }> = ({ land }) => {
  /* ── parse polygon safely ─────────────────────────────────────── */
  let parcelFeature: Feature<Geometry, GeoJsonProperties> | null = null;
  try { parcelFeature = JSON.parse(land.geojson); } catch { /* ignore */ }

  /* helper -------------------------------------------------------- */
  const fmtArea = `${Math.round(land.shape_area).toLocaleString()} m²`;

  return (
    <Card className="h-100 shadow-sm">
      {/* ── THUMB (with subtle border + price badge) ─────────────── */}
      <div className="position-relative border-bottom border-light-subtle">
        {parcelFeature ? (
          <MapThumb
            parcelFeature={parcelFeature}
            center={[land.longitude, land.latitude]}
          />
        ) : (
          <div
            className="d-flex justify-content-center align-items-center bg-light text-muted small"
            style={{ height: 180, borderRadius: 6 }}
          >
            No map
          </div>
        )}

        {land.asking_price != null && (
          <span
            className="badge px-3 py-2 br-1 position-absolute top-0 start-0 m-2 fs-6"
            style={{ 
              backgroundColor: ' #f4f1f1',
              color: '#d12c2c',
              opacity: '0.8',
              borderRadius: '0.7rem'
            }}      /* red badge */
          >
            {Number(land.asking_price).toLocaleString()} BHD
          </span>
        )}
      </div>

      {/* ── BODY ─────────────────────────────────────────────────── */}
      <Card.Body>
        {/* title */}
        <h6 className="fw-semibold mb-2">
          {land.title?.trim() || 'Untitled Land'}
        </h6>

        {/* location with pin icon */}
        <p className="mb-3 text-muted">
          <i className="ti ti-map-pin me-1" />
          {land.area_namee || '—'}
        </p>

        {/* area + classification */}
        <p className="mb-0">
          <span className="fw-medium">{fmtArea}</span>
          <span className="text-muted"> • Class: {land.nzp_code || '—'}</span>
        </p>
      </Card.Body>
    </Card>
  );
};

export default LandCard;
