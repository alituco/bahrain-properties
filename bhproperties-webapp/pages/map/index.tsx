"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Row, Col, Modal, Button as BsButton, Spinner,
} from "react-bootstrap";
import Seo from "@/shared/layouts-components/seo/seo";
import SpkBreadcrumb from "@/shared/@spk-reusable-components/reusable-uielements/spk-breadcrumb";
import MapFilter, { MapFilters } from "@/components/map/MapFilter";
import SpkAlert from "@/shared/@spk-reusable-components/reusable-uielements/spk-alert";

/* map only rendered client‑side ---------------------------------------- */
const MapContainer = dynamic(() => import("@/components/map/MapContainer"), {
  ssr: false,
});

const PublicMapPage = () => {
  const API = process.env.NEXT_PUBLIC_API_URL!;
  const [areas, setAreas] = useState<string[]>([]);
  const [govs,  setGovs]  = useState<string[]>([]);
  const [filters, setFilters] = useState<MapFilters>({});
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [flyTo, setFlyTo] = useState<{ lat: number; lon: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);     // ← avoids hydration mismatch

  /* fetch dropdown options once --------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const [a, g] = await Promise.all([
          fetch(`${API}/propertyFilters/areas`,        { credentials:"include"}).then(r => r.json()),
          fetch(`${API}/propertyFilters/governorates`, { credentials:"include"}).then(r => r.json()),
        ]);
        setAreas(a.areaNames);
        setGovs (g.governorates);
      } catch (e:any) { setErr(e.message); }
    })();
  }, [API]);

  /* mark mounted to silence hydration mismatch ------------------------ */
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;              // server ≠ client → wait

  if (err) {
    return (
      <SpkAlert variant="danger" CustomClass="m-4" dismissible show>
        {err}
      </SpkAlert>
    );
  }

  /* at least one filter other than size? ------------------------------ */
  const hasPrimary = filters.block || filters.area || filters.governorate;

  return (
    <>
      <Seo title="All Properties Map" />

      {/* breadcrumb / header ------------------------------------------- */}
      <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
        <div>
          <SpkBreadcrumb Customclass="mb-1">
            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
            <li className="breadcrumb-item active">Map</li>
          </SpkBreadcrumb>
          <h1 className="page-title fw-medium fs-18 mb-0">Properties Map</h1>
        </div>
        <Col className="text-end">
          <BsButton variant="primary" onClick={() => setShowFilter(true)}>
            <i className="ri-filter-3-line me-1" />
            Filter
          </BsButton>
        </Col>
      </div>

      {/* filter modal --------------------------------------------------- */}
      <Modal
        show={showFilter}
        onHide={() => setShowFilter(false)}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Filter Properties</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {areas.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <MapFilter
              areas={areas}
              governorates={govs}
              values={filters}               /* ← keep current selections */
              onApply={(f) => { setFilters(f); setShowFilter(false); }}
              onClear={()  => { setFilters({}); setShowFilter(false); }}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* map or placeholder -------------------------------------------- */}
      {hasPrimary ? (
        <Row>
          <Col xl={12}>
            <MapContainer filters={filters} flyTo={flyTo} />
          </Col>
        </Row>
      ) : (
        <Row>
          <Col xl={12} className="text-center py-5">
            <p className="fs-5 text-muted">
              Select at least one filter (block, area or governorate) to show
              the map.
            </p>
          </Col>
        </Row>
      )}
    </>
  );
};

PublicMapPage.layout = "ContentLayout";
export default PublicMapPage;
