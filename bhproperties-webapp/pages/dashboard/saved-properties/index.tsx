'use client';

import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import {
  Card,
  Col,
  Modal,
  Row,
  Spinner,
  Button as BsButton,
  Form,
  InputGroup,
} from 'react-bootstrap';
import Image from 'next/image';
import Swal from 'sweetalert2';
import Seo from '@/shared/layouts-components/seo/seo';
import SpkBreadcrumb from '@/shared/@spk-reusable-components/reusable-uielements/spk-breadcrumb';
import SpkPopovers from '@/shared/@spk-reusable-components/reusable-uielements/spk-popovers';
import SpkTablescomponent from '@/shared/@spk-reusable-components/reusable-tables/tables-component';
import SpkButton from '@/shared/@spk-reusable-components/reusable-uielements/spk-button';
import SpkAlert from '@/shared/@spk-reusable-components/reusable-uielements/spk-alert';
import FirmPropertyFilter from '@/components/FirmPropertyFilter';

const MapContainer = dynamic(() => import('@/components/map/MapContainer'), {
  ssr: false,
});

/* ─────────────────────────────────────────────────────────────── */
interface FirmProperty {
  id: number;
  parcel_no: string;
  area_namee: string;
  block_no: string;
  status: string;                  // includes 'saved'
  asking_price: number | null;
  updated_at: string;
  longitude: number;
  latitude: number;
  shape_area?: number | null;      // land size (m²)
}

interface UserProfile {
  role: string;
}

/* ─────────────────────────────────────────────────────────────── */
export default function FirmPropertiesPage() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL!;

  const [rows, setRows] = useState<FirmProperty[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; variant: string } | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [areas, setAreas] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [flyTo, setFlyTo] = useState<{ lat: number; lon: number } | null>(null);

  // server-side filters applied via modal
  const [filters, setFilters] = useState<Record<string, string>>({});
  // client-side search on the fetched set
  const [searchText, setSearchText] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const mapSectionRef = useRef<HTMLDivElement>(null);

  const statusForMap = (filters.status ?? 'all') as string;

  const smoothScrollTo = (el: HTMLElement, duration = 800, offsetPx = 100) => {
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

  /* ───────── auth ───────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/user/me`, { credentials: 'include' });
        if (!res.ok) throw new Error('Profile failed');
        const { user }: { user: UserProfile } = await res.json();
        setIsAdmin(user.role.toLowerCase() === 'admin');
      } catch {
        router.replace('/');
      }
    })();
  }, [API, router]);

  /* ───────── load areas ───────── */
  const loadAreas = async () => {
    const res = await fetch(`${API}/propertyFilters/areas`, {
      credentials: 'include',
    });
    const { areaNames } = await res.json();
    setAreas(areaNames);
  };

  /* ───────── load rows (server-side filters only) ───────── */
  const loadRows = async (f: Record<string, string> = {}) => {
    try {
      setLoading(true);
      const qs = new URLSearchParams();
      if (f.block) qs.append('block_no', f.block);
      if (f.area) qs.append('area_namee', f.area);
      if (f.status && f.status !== 'all') qs.append('status', f.status);
      if (f.minPrice) qs.append('minPrice', f.minPrice);
      if (f.maxPrice) qs.append('maxPrice', f.maxPrice);

      const res = await fetch(`${API}/firm-properties?${qs.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Fetch failed');
      const { firmProperties } = await res.json();
      setRows(firmProperties);
      setPage(1);
    } catch (e: any) {
      setFetchError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAreas();
    loadRows();
  }, [API]);

  /* ───────── modal apply/clear ───────── */
  const applyFilters = (f: Record<string, string>) => {
    setFilters(f);
    setShowFilter(false);
    loadRows(f);
  };

  const clearFilters = () => {
    setFilters({});
    loadRows({});
  };

  /* ───────── delete row ───────── */
  const askDelete = (row: FirmProperty) => {
    if (!isAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Admins only',
        text: 'You need to be admin to delete.',
        confirmButtonColor: '#d33',
      });
      return;
    }
    Swal.fire({
      title: 'Are you sure you want to delete this property?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
    }).then((r) => {
      if (r.isConfirmed) performDelete(row);
    });
  };

  const performDelete = async (row: FirmProperty) => {
    setBusyId(row.id);
    try {
      const res = await fetch(`${API}/firm-properties/${row.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');
      setRows((prev) => prev.filter((p) => p.id !== row.id));
      setToast({ text: 'Property deleted', variant: 'success' });
      setPage(1);
    } catch (e: any) {
      setToast({ text: e.message || 'Could not delete', variant: 'danger' });
    } finally {
      setBusyId(null);
    }
  };

  /* ───────── client-side search on fetched rows ───────── */
  const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

  const filteredRows = useMemo(() => {
    const q = appliedQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      return (
        r.parcel_no.toLowerCase().includes(q) ||
        (r.area_namee || '').toLowerCase().includes(q) ||
        (r.block_no || '').toLowerCase().includes(q) ||
        (r.status || '').toLowerCase().includes(q)
      );
    });
  }, [rows, appliedQuery]);

  /* ───────── pagination ───────── */
  const rowsPerPage = 10;
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const currentPage = Math.min(page, totalPages);
  const pageRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  useEffect(() => {
    if (flyTo && mapSectionRef.current) {
      smoothScrollTo(mapSectionRef.current, 800, 120);
    }
  }, [flyTo]);

  /* ───────── centered search actions ───────── */
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

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Image
          src="/assets/images/media/loader.svg"
          width={64}
          height={64}
          alt="Loading..."
          priority
        />
      </div>
    );

  /* ───────────────────────────────────────────────────────────── */
  return (
    <Fragment>
      <Seo title="Firm Properties" />

      <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
        <div>
          <SpkBreadcrumb Customclass="mb-1">
            <li className="breadcrumb-item">
              <Link href="#!">Dashboards</Link>
            </li>
            <li className="breadcrumb-item active">Firm Properties</li>
          </SpkBreadcrumb>
          <h1 className="page-title fw-medium fs-18 mb-0">Firm Properties</h1>
        </div>
        <div />
      </div>

      {/* Centered search row — only buttons are filled */}
      <div className="d-flex justify-content-center my-3">
        <div className="w-100" style={{ maxWidth: 980 }}>
          <Form onSubmit={onSearchSubmit} className="w-100">
            <div className="d-flex flex-wrap gap-2 align-items-stretch">
              <div className="flex-grow-1">
                <InputGroup className="shadow-sm">
                  <InputGroup.Text className="bg-white border-end-0">
                    <i className="ri-search-line" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search by parcel, area, block, or status…"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    aria-label="Search firm properties"
                    className="border-start-0"
                  />
                </InputGroup>
              </div>

              <div className="d-flex gap-2">
                <BsButton type="submit" variant="primary">
                  Search
                </BsButton>

                <BsButton type="button" variant="outline-secondary" onClick={onSearchClear}>
                  Clear
                </BsButton>

                <BsButton type="button" variant="secondary" onClick={() => setShowFilter(true)}>
                  More Filters
                </BsButton>

              </div>
            </div>
          </Form>
        </div>
      </div>

      {fetchError && (
        <SpkAlert
          variant="danger"
          CustomClass="mb-3"
          dismissible
          show
          onClose={() => setFetchError(null)}
        >
          {fetchError}
        </SpkAlert>
      )}
      {toast && (
        <SpkAlert
          variant={toast.variant}
          CustomClass="mb-3"
          dismissible
          show
          onClose={() => setToast(null)}
        >
          {toast.text}
        </SpkAlert>
      )}

      {/* Filter modal — assumes FirmPropertyFilter handles Status (incl. Saved) */}
      <Modal
        show={showFilter}
        onHide={() => setShowFilter(false)}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Filter Properties</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FirmPropertyFilter
            areaOptions={areas}
            onApply={applyFilters}
            onClear={clearFilters}
          />
        </Modal.Body>
      </Modal>

      {/* Table */}
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
                <SpkTablescomponent
                  tableClass="text-nowrap table-bordered"
                  showCheckbox={false}
                  header={[
                    { title: 'ID' },
                    { title: 'Area' },
                    { title: 'Block' },
                    { title: 'Status' },
                    { title: 'Asking Price' },
                    { title: 'Size (m²)' },           // land size
                    { title: 'Updated' },
                    { title: 'Action' },
                  ]}
                >
                  {pageRows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <Link
                          href={`/dashboard/property/${row.parcel_no}`}
                          className="text-blue hover:underline"
                        >
                          {row.id}
                        </Link>
                      </td>
                      <td>{row.area_namee}</td>
                      <td>{row.block_no}</td>
                      <td>
                        <span className="badge bg-primary-transparent">
                          {titleCase(row.status)}
                        </span>
                      </td>
                      <td>
                        {row.asking_price != null
                          ? `${row.asking_price.toLocaleString()} BHD`
                          : '--'}
                      </td>
                      <td>
                        {row.shape_area != null
                          ? Math.round(row.shape_area).toLocaleString()
                          : '--'}
                      </td>
                      <td>{new Date(row.updated_at).toLocaleDateString()}</td>
                      <td>
                        <div className="hstack gap-2 fs-15">
                          <SpkButton
                            Size="sm"
                            Buttonvariant="primary-light"
                            onClickfunc={() =>
                              setFlyTo({
                                lat: row.latitude,
                                lon: row.longitude,
                              })
                            }
                          >
                            <i className="ri-focus-3-line" />
                          </SpkButton>
                          <SpkPopovers
                            content="You don’t have privileges for this"
                            trigger="hover"
                            placement="top"
                            rootClose
                          >
                            <span className="d-inline-block">
                              <SpkButton
                                Size="sm"
                                Buttonvariant={isAdmin ? 'danger' : 'secondary-light'}
                                Disabled={busyId === row.id || !isAdmin}
                                onClickfunc={() => askDelete(row)}
                              >
                                {busyId === row.id && (
                                  <Spinner animation="border" size="sm" className="me-1" />
                                )}
                                <i className="ri-delete-bin-line" />
                              </SpkButton>
                            </span>
                          </SpkPopovers>
                        </div>
                      </td>
                    </tr>
                  ))}
                </SpkTablescomponent>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-3">
                  <ul className="pagination justify-content-center mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        « Prev
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <li
                        key={p}
                        className={`page-item ${p === currentPage ? 'active' : ''}`}
                      >
                        <button className="page-link" onClick={() => setPage(p)}>
                          {p}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      >
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

      {/* Map */}
      <div ref={mapSectionRef}>
        <Row className="mt-4">
          <Col xl={12}>
            <Card className="custom-card">
              <Card.Header>
                <div className="card-title">Map</div>
              </Card.Header>
              <Card.Body>
                <MapContainer
                  filters={{ status: statusForMap }} // 'saved' etc. comes from modal
                  flyTo={flyTo}
                  savedOnly
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
}

FirmPropertiesPage.layout = 'ContentLayout';
