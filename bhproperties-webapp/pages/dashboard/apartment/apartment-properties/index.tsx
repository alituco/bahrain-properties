'use client';

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, Col, Row, Modal, Form, InputGroup, Button as BsButton } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Seo from '@/shared/layouts-components/seo/seo';
import SpkBreadcrumb from '@/shared/@spk-reusable-components/reusable-uielements/spk-breadcrumb';
import SpkTables from '@/shared/@spk-reusable-components/reusable-tables/tables-component';
import SpkAlert from '@/shared/@spk-reusable-components/reusable-uielements/spk-alert';

const MapContainer = dynamic(
  () => import('@/components/map/MapContainer'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: 360,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <Image
          src="/assets/images/media/loader.svg"
          width={64}
          height={64}
          alt="Loading…"
          priority
        />
      </div>
    ),
  }
);

/* ─────────────────────────────────────────────────────────────── */

interface Apartment {
  id: number;
  title: string | null;
  bedrooms: number;
  bathrooms: number;
  area_namee: string | null;
  status: string;
  asking_price: number | null;
  rent_price: number | null;
  listing_type: 'sale' | 'rent';
  latitude: number | null;
  longitude: number | null;
  updated_at: string;
}

type ListingFilter = 'all' | 'sale' | 'rent';

const STATUS_OPTS = [
  // Combine common statuses used across sale/rent for a simple UX
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'available', label: 'Available' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'leased', label: 'Sold/Leased' },
];

const LISTING_OPTS: { value: ListingFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
];

export default function FirmApartmentsPage() {
  const API = process.env.NEXT_PUBLIC_API_URL!;
  const router = useRouter();

  const [rows, setRows] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // map fly-to
  const [flyTo, setFlyTo] = useState<{ lat: number; lon: number } | null>(null);

  // search (client-side)
  const [searchText, setSearchText] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  // filter modal
  const [showFilter, setShowFilter] = useState(false);
  const [areas, setAreas] = useState<string[]>([]);

  // saved filters in UI
  const [filters, setFilters] = useState<{
    area?: string;
    status?: string; // 'all' or specific value
    beds?: string;
    baths?: string;
    listing?: ListingFilter; // 'all' | 'sale' | 'rent'
    minPrice?: string;
    maxPrice?: string;
  }>({ status: 'all', listing: 'all' });

  /* ───────── auth check ───────── */
  useEffect(() => {
    (async () => {
      const r = await fetch(`${API}/user/me`, { credentials: 'include' });
      if (!r.ok) {
        router.replace('/');
        return;
      }
    })();
  }, [API, router]);

  /* ───────── load areas ───────── */
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/propertyFilters/areas`, {
          credentials: 'include',
        });
        if (r.ok) {
          const { areaNames } = await r.json();
          if (Array.isArray(areaNames)) setAreas(areaNames);
        }
      } catch {
        // ignore silently
      }
    })();
  }, [API]);

  /* ───────── load apartments (server) ─────────
     Keeping it simple: fetch all your firm’s apartments and filter on client.
  */
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/apartment`, { credentials: 'include' });
        if (!r.ok) throw new Error(await r.text());
        const { firmProperties } = await r.json();
        setRows(Array.isArray(firmProperties) ? firmProperties : []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [API]);

  /* ───────── client-side filter & search ───────── */

  const filteredRows = useMemo(() => {
    let list = rows;

    // filters
    if (filters.area && filters.area.trim()) {
      list = list.filter((r) => (r.area_namee || '').toLowerCase() === filters.area!.toLowerCase());
    }

    if (filters.status && filters.status !== 'all') {
      list = list.filter((r) => (r.status || '').toLowerCase() === filters.status!.toLowerCase());
    }

    if (filters.listing && filters.listing !== 'all') {
      list = list.filter((r) => r.listing_type === filters.listing);
    }

    if (filters.beds && filters.beds.trim()) {
      const b = Number(filters.beds);
      if (!Number.isNaN(b)) {
        list = list.filter((r) => (r.bedrooms ?? 0) >= b);
      }
    }

    if (filters.baths && filters.baths.trim()) {
      const b = Number(filters.baths);
      if (!Number.isNaN(b)) {
        list = list.filter((r) => (r.bathrooms ?? 0) >= b);
      }
    }

    if ((filters.minPrice && filters.minPrice.trim()) || (filters.maxPrice && filters.maxPrice.trim())) {
      const min = filters.minPrice ? Number(filters.minPrice) : Number.NEGATIVE_INFINITY;
      const max = filters.maxPrice ? Number(filters.maxPrice) : Number.POSITIVE_INFINITY;

      list = list.filter((r) => {
        // compare the relevant price based on listing_type
        const price = r.listing_type === 'rent' ? (r.rent_price ?? null) : (r.asking_price ?? null);
        if (price == null) return false;
        return price >= min && price <= max;
      });
    }

    // search
    const q = appliedQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((r) => {
        const s1 = (r.title || '').toLowerCase();
        const s2 = (r.area_namee || '').toLowerCase();
        const s3 = (r.status || '').toLowerCase();
        const s4 = String(r.bedrooms || '');
        const s5 = String(r.bathrooms || '');
        return s1.includes(q) || s2.includes(q) || s3.includes(q) || s4.includes(q) || s5.includes(q);
      });
    }

    return list;
  }, [rows, filters, appliedQuery]);

  // pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const currentPage = Math.min(page, totalPages);
  const pageRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // search handlers
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

  // filter modal handlers
  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setShowFilter(false);
    setPage(1);
  };
  const clearFilters = () => {
    setFilters({ status: 'all', listing: 'all' });
    setShowFilter(false);
    setPage(1);
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Image src="/assets/images/media/loader.svg" width={64} height={64} alt="Loading" priority />
      </div>
    );

  return (
    <Fragment>
      <Seo title="Firm Apartments" />
      <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
        <div>
          <SpkBreadcrumb Customclass="mb-1">
            <li className="breadcrumb-item">
              <Link href="#!">Dashboards</Link>
            </li>
            <li className="breadcrumb-item active">Apartments</li>
          </SpkBreadcrumb>
          <h1 className="page-title fw-medium fs-18 mb-0">Apartments</h1>
        </div>
      </div>

      {error && (
        <SpkAlert variant="danger" CustomClass="mb-3" show>
          {error}
        </SpkAlert>
      )}

      {/* Search bar + quick actions (centered) */}
      <div className="d-flex justify-content-center my-3">
        <div className="w-100" style={{ maxWidth: 980 }}>
          <Form onSubmit={onSearchSubmit} className="w-100">
            <div className="d-flex flex-wrap gap-2 align-items-stretch">
              <div className="flex-grow-1">
                <InputGroup>
                  <Form.Control
                    placeholder="Search by title, area, status, beds, baths…"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    aria-label="Search apartments"
                  />
                </InputGroup>
              </div>
              <div className="d-flex gap-2">
                <BsButton type="submit" className="btn btn-primary">
                  <i className="ri-search-line me-1" />
                  Search
                </BsButton>
                <BsButton type="button" variant="outline-secondary" onClick={onSearchClear}>
                  Clear
                </BsButton>
                <BsButton type="button" variant="light" onClick={() => setShowFilter(true)}>
                  <i className="ri-filter-3-line me-1" />
                  More Filters
                </BsButton>
              </div>
            </div>
          </Form>
        </div>
      </div>

      {/* Filter modal */}
      <Modal show={showFilter} onHide={() => setShowFilter(false)} backdrop="static" size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Filter Apartments</Modal.Title>
        </Modal.Header>
        <Form onSubmit={applyFilters}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="small text-muted">Area</Form.Label>
                <Form.Select
                  value={filters.area ?? ''}
                  onChange={(e) => setFilters((f) => ({ ...f, area: e.target.value || undefined }))}
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
                <Form.Label className="small text-muted">Status</Form.Label>
                <Form.Select
                  value={filters.status ?? 'all'}
                  onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                >
                  {STATUS_OPTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={6}>
                <Form.Label className="small text-muted">Listing</Form.Label>
                <Form.Select
                  value={filters.listing ?? 'all'}
                  onChange={(e) => setFilters((f) => ({ ...f, listing: e.target.value as ListingFilter }))}
                >
                  {LISTING_OPTS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={3}>
                <Form.Label className="small text-muted">Min Beds</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={filters.beds ?? ''}
                  onChange={(e) => setFilters((f) => ({ ...f, beds: e.target.value }))}
                />
              </Col>

              <Col md={3}>
                <Form.Label className="small text-muted">Min Baths</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={filters.baths ?? ''}
                  onChange={(e) => setFilters((f) => ({ ...f, baths: e.target.value }))}
                />
              </Col>

              <Col md={6}>
                <Form.Label className="small text-muted">Min Price (BHD)</Form.Label>
                <InputGroup>
                  <InputGroup.Text>BD</InputGroup.Text>
                  <Form.Control
                    type="number"
                    min={0}
                    value={filters.minPrice ?? ''}
                    onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
                  />
                </InputGroup>
              </Col>

              <Col md={6}>
                <Form.Label className="small text-muted">Max Price (BHD)</Form.Label>
                <InputGroup>
                  <InputGroup.Text>BD</InputGroup.Text>
                  <Form.Control
                    type="number"
                    min={0}
                    value={filters.maxPrice ?? ''}
                    onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
                  />
                </InputGroup>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <BsButton type="button" variant="outline-secondary" onClick={clearFilters}>
              Reset
            </BsButton>
            <BsButton type="submit" className="btn btn-primary">
              Apply Filters
            </BsButton>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Table */}
      <Row>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">
                List {appliedQuery ? <span className="text-muted ms-2">({filteredRows.length} results)</span> : null}
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
                        <Link href={`/dashboard/apartment/${r.id}`} className="text-blue">
                          {r.id}
                        </Link>
                      </td>
                      <td className="text-truncate" style={{ maxWidth: 160 }}>
                        {r.title || '—'}
                      </td>
                      <td>{r.bedrooms}</td>
                      <td>{r.bathrooms}</td>
                      <td>{r.area_namee ?? '—'}</td>
                      <td>
                        <span className="badge bg-primary-transparent">{r.status}</span>
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

      {/* Map – always visible, with flyTo support */}
      <Row className="mt-4">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Map</div>
            </Card.Header>
            <Card.Body>
              <div style={{ minHeight: 360 }}>
                <MapContainer
                  filters={{
                    status: (filters.status ?? 'all') as string,
                    area: filters.area,
                  }}
                  flyTo={flyTo}
                  savedOnly
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}

FirmApartmentsPage.layout = 'ContentLayout';
