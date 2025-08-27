/* ------------------------------------------------------------------
   Firm – House Properties list  (dash)
-------------------------------------------------------------------*/
'use client';

import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, Col, Row, Modal, Form, InputGroup, Button as BsButton } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Seo from '@/shared/layouts-components/seo/seo';
import SpkBreadcrumb from '@/shared/@spk-reusable-components/reusable-uielements/spk-breadcrumb';
import SpkTables from '@/shared/@spk-reusable-components/reusable-tables/tables-component';
import SpkAlert from '@/shared/@spk-reusable-components/reusable-uielements/spk-alert';

const MapContainer = dynamic(() => import('@/components/map/MapContainer'), { ssr: false });

/* -------------------------------------------------- */
/*  Row-shape coming from  GET /house  for one firm   */
/* -------------------------------------------------- */
interface HouseRow {
  id: number;
  title: string | null;
  bedrooms: number;
  bathrooms: number;
  floors: number | null;
  plot_size_m2: number | null;
  area_namee: string | null;
  status: string;
  listing_type: 'sale' | 'rent';
  asking_price: number | null;
  rent_price: number | null;
  latitude: number | null;
  longitude: number | null;
  updated_at: string;
}

/* Status options (covers both sale & rent flows) */
const STATUS_OPTIONS = [
  { value: 'saved', label: 'Saved' },
  { value: 'listed', label: 'Listed' },
  { value: 'available', label: 'Available' },
  { value: 'potential buyer', label: 'Potential Buyer' },
  { value: 'closing deal', label: 'Closing Deal' },
  { value: 'paperwork', label: 'Paperwork' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'leased', label: 'Leased' },
  { value: 'sold', label: 'Sold' },
];

export default function FirmHousesPage() {
  const API = process.env.NEXT_PUBLIC_API_URL!;
  const router = useRouter();

  /* -------------------- state -------------------- */
  const [rows, setRows] = useState<HouseRow[]>([]);
  const [loading, setLoad] = useState(true);
  const [error, setErr] = useState<string | null>(null);

  // filters & search
  const [areas, setAreas] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchText, setSearchText] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  // map
  const [flyTo, setFlyTo] = useState<{ lat: number; lon: number } | null>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());
  const statusForMap = (filters.status ?? 'all') as string;

  const smoothScrollTo = (el: HTMLElement, duration = 800, offsetPx = 120) => {
    const startY = window.scrollY;
    const targetY = el.getBoundingClientRect().top + startY - offsetPx;
    const distance = targetY - startY;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (startTime === null) startTime = ts;
      const elapsed = ts - startTime;
      const prog = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * prog);
      if (elapsed < duration) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  };

  /* -------------------- auth guard --------------- */
  useEffect(() => {
    (async () => {
      const r = await fetch(`${API}/user/me`, { credentials: 'include' });
      if (!r.ok) {
        router.replace('/');
        return;
      }
    })();
  }, [API, router]);

  /* -------------------- load areas ---------------- */
  const loadAreas = async () => {
    try {
      const res = await fetch(`${API}/propertyFilters/areas`, { credentials: 'include' });
      const { areaNames } = await res.json();
      setAreas(areaNames || []);
    } catch {
      setAreas([]);
    }
  };

  /* -------------------- data load (server-side filters) -- */
  const loadRows = async (f: Record<string, string> = {}) => {
    try {
      setLoad(true);
      const qs = new URLSearchParams();
      if (f.area) qs.append('area_namee', f.area);
      if (f.status && f.status !== 'all') qs.append('status', f.status);
      if (f.minPrice) qs.append('minPrice', f.minPrice);
      if (f.maxPrice) qs.append('maxPrice', f.maxPrice);
      // (Optional) you could also add min/max bedrooms/bathrooms if your API supports:
      // if (f.minBeds) qs.append('minBeds', f.minBeds);
      // if (f.minBaths) qs.append('minBaths', f.minBaths);

      const url = `${API}/house${qs.toString() ? `?${qs.toString()}` : ''}`;
      const r = await fetch(url, { credentials: 'include' });
      if (!r.ok) throw new Error(await r.text());
      const { firmProperties } = await r.json();
      setRows(Array.isArray(firmProperties) ? firmProperties : []);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    loadAreas();
    loadRows({});
  }, [API]);

  /* -------------------- client-side search ---------- */
  const filteredRows = useMemo(() => {
    const q = appliedQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const idStr = String(r.id);
      const title = (r.title || '').toLowerCase();
      const area = (r.area_namee || '').toLowerCase();
      const status = (r.status || '').toLowerCase();
      const beds = String(r.bedrooms);
      const baths = String(r.bathrooms);
      return (
        idStr.includes(q) ||
        title.includes(q) ||
        area.includes(q) ||
        status.includes(q) ||
        beds.includes(q) ||
        baths.includes(q)
      );
    });
  }, [rows, appliedQuery]);

  /* -------------------- pagination (simple) ---------- */
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const currentPage = Math.min(page, totalPages);
  const pageRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  /* -------------------- flyTo → scroll map --------- */
  useEffect(() => {
    if (flyTo && mapSectionRef.current) {
      smoothScrollTo(mapSectionRef.current);
    }
  }, [flyTo]);

  /* -------------------- search handlers ------------- */
  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedQuery(searchText);
    setPage(1);
  };

  const onSearchClear = () => {
    setSearchText('');
    setAppliedQuery('');
    setPage(1);
  };

  /* -------------------- modal handlers -------------- */
  const applyFilters = (f: Record<string, string>) => {
    setFilters(f);
    setShowFilter(false);
    loadRows(f);
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({});
    setShowFilter(false);
    loadRows({});
    setPage(1);
  };

  /* -------------------- ui ----------------------- */
  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Image src="/assets/images/media/loader.svg" width={64} height={64} alt="Loading" priority />
      </div>
    );
  }

  return (
    <Fragment>
      <Seo title="Firm Houses" />

      {/* ---- breadcrumb / heading ---- */}
      <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
        <div>
          <SpkBreadcrumb Customclass="mb-1">
            <li className="breadcrumb-item">
              <Link href="#!">Dashboards</Link>
            </li>
            <li className="breadcrumb-item active">Houses</li>
          </SpkBreadcrumb>
          <h1 className="page-title fw-medium fs-18 mb-0">Houses</h1>
        </div>
      </div>

      {error && (
        <SpkAlert variant="danger" CustomClass="mb-3" show>
          {error}
        </SpkAlert>
      )}

      {/* ---- Search toolbar ---- */}
      <div className="d-flex justify-content-center my-3">
        <div className="w-100" style={{ maxWidth: 980 }}>
          <Form onSubmit={onSearchSubmit} className="w-100">
            <div className="d-flex flex-wrap gap-2 align-items-stretch">
              <div className="flex-grow-1">
                <InputGroup>
                  <Form.Control
                    placeholder="Search by ID, title, beds, baths, area, or status…"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    aria-label="Search houses"
                  />
                </InputGroup>
              </div>
              <div className="d-flex gap-2">
                <BsButton type="submit" className="btn-solid">
                  <i className="ri-search-line me-1" />
                  Search
                </BsButton>
                <BsButton type="button" variant="outline-secondary" onClick={onSearchClear}>
                  Clear
                </BsButton>
                <BsButton type="button" variant="outline-primary" onClick={() => setShowFilter(true)}>
                  <i className="ri-filter-3-line me-1" />
                  More Filters
                </BsButton>
                <BsButton type="button" variant="outline-secondary" onClick={resetFilters}>
                  Reset All
                </BsButton>
              </div>
            </div>
          </Form>
        </div>
      </div>

      {/* ---- Filter modal ---- */}
      <Modal show={showFilter} onHide={() => setShowFilter(false)} backdrop="static" size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Filter Houses</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="house-filters-form" onSubmit={(e) => e.preventDefault()}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>Area</Form.Label>
                <Form.Select
                  value={filters.area ?? ''}
                  onChange={(e) => setFilters((p) => ({ ...p, area: e.target.value }))}
                >
                  <option value="">All</option>
                  {areas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={6}>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filters.status ?? 'all'}
                  onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="all">All</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={6}>
                <Form.Label>Min Price (BHD)</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={filters.minPrice ?? ''}
                  onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))}
                  placeholder="e.g. 500"
                />
              </Col>
              <Col md={6}>
                <Form.Label>Max Price (BHD)</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={filters.maxPrice ?? ''}
                  onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
                  placeholder="e.g. 250000"
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <BsButton variant="secondary" onClick={() => setShowFilter(false)}>
            Close
          </BsButton>
          <BsButton
            variant="outline-secondary"
            onClick={resetFilters}
          >
            Reset
          </BsButton>
          <BsButton
            variant="primary"
            onClick={() => applyFilters(filters)}
          >
            Apply Filters
          </BsButton>
        </Modal.Footer>
      </Modal>

      {/* ---- main table ---- */}
      <Row>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">
                List{' '}
                {appliedQuery ? (
                  <span className="text-muted ms-2">({filteredRows.length} results)</span>
                ) : null}
              </div>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <SpkTables
                  tableClass="text-nowrap table-bordered"
                  showCheckbox={false}
                  header={[
                    { title: 'ID' },
                    { title: 'Title' },
                    { title: 'Beds' },
                    { title: 'Baths' },
                    { title: 'Floors' },
                    { title: 'Plot (m²)' },
                    { title: 'Area' },
                    { title: 'Status' },
                    { title: 'Price' },
                    { title: 'Updated' },
                    { title: 'Map' },
                  ]}
                >
                  {pageRows.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <Link href={`/dashboard/house/${r.id}`} className="text-blue">
                          {r.id}
                        </Link>
                      </td>
                      <td className="text-truncate" style={{ maxWidth: 200 }}>
                        {r.title || '—'}
                      </td>
                      <td>{r.bedrooms}</td>
                      <td>{r.bathrooms}</td>
                      <td>{r.floors ?? '—'}</td>
                      <td>{r.plot_size_m2 != null ? Math.round(r.plot_size_m2).toLocaleString() : '—'}</td>
                      <td>{r.area_namee ?? '—'}</td>
                      <td>
                        <span className="badge bg-primary-transparent">{titleCase(r.status)}</span>
                      </td>
                      <td>
                        {r.listing_type === 'rent'
                          ? `${(r.rent_price ?? 0).toLocaleString()} BHD/mo`
                          : `${(r.asking_price ?? 0).toLocaleString()} BHD`}
                      </td>
                      <td>{new Date(r.updated_at).toLocaleDateString()}</td>
                      <td>
                        {r.latitude && r.longitude ? (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setFlyTo({ lat: +r.latitude!, lon: +r.longitude! })}
                            title="Focus on map"
                          >
                            <i className="ri-focus-3-line" />
                          </button>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))}
                </SpkTables>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-3">
                  <ul className="pagination justify-content-center mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                        « Prev
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setPage(p)}>
                          {p}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                        Next »
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ---- map (always visible) ---- */}
      <div ref={mapSectionRef}>
        <Row className="mt-4">
          <Col xl={12}>
            <Card className="custom-card">
              <Card.Header>
                <div className="card-title">Map</div>
              </Card.Header>
              <Card.Body>
                <MapContainer
                  filters={{
                    status: statusForMap,
                    area: filters.area ?? '',
                  }}
                  flyTo={flyTo}
                  savedOnly
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* minimal styling for filled buttons */}
      <style jsx>{`
        .btn-solid {
          background: var(--bs-primary);
          border: none;
          color: #fff;
        }
        .btn-solid:hover,
        .btn-solid:focus {
          background: #1c6fcc;
          color: #fff;
        }
      `}</style>
    </Fragment>
  );
}

FirmHousesPage.layout = 'ContentLayout';
