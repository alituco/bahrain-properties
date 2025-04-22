/* pages/firm-properties.tsx */
"use client";

import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Card,
  Col,
  Modal,
  Row,
  Spinner,
  Button as BsButton,
} from "react-bootstrap";
import Swal from "sweetalert2";
import Seo from "@/shared/layouts-components/seo/seo";
import SpkBreadcrumb from "@/shared/@spk-reusable-components/reusable-uielements/spk-breadcrumb";
import SpkTablescomponent from "@/shared/@spk-reusable-components/reusable-tables/tables-component";
import SpkButton from "@/shared/@spk-reusable-components/reusable-uielements/spk-button";
import SpkAlert from "@/shared/@spk-reusable-components/reusable-uielements/spk-alert";
import FirmPropertyFilter from "@/components/FirmPropertyFilter";

interface FirmProperty {
  id: number;
  parcel_no: string;
  area_namee: string;
  block_no: string;
  status: string;
  asking_price: number | null;
  updated_at: string;
}

interface UserProfile {
  role: string;
}

const FirmPropertiesPage = () => {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL!;

  const [rows, setRows] = useState<FirmProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; variant: string } | null>(
    null
  );
  const [busyId, setBusyId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [areas, setAreas] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/user/me`, { credentials: "include" });
        if (!res.ok) throw new Error("Profile failed");
        const { user }: { user: UserProfile } = await res.json();
        setIsAdmin(user.role.toLowerCase() === "admin");
      } catch {
        router.replace("/");
      }
    })();
  }, []);

  const loadAreas = async () => {
    const res = await fetch(`${API}/propertyFilters/areas`, {
      credentials: "include",
    });
    const { areaNames } = await res.json();
    setAreas(areaNames);
  };

  const loadRows = async (f: Record<string, string> = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (f.block) params.append("block_no", f.block);
      if (f.area) params.append("area_namee", f.area);
      if (f.status) params.append("status", f.status);
      if (f.minPrice) params.append("minPrice", f.minPrice);
      if (f.maxPrice) params.append("maxPrice", f.maxPrice);

      const url = `${API}/firm-properties?${params.toString()}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Fetch failed");
      const { firmProperties } = await res.json();
      setRows(firmProperties);
    } catch (err: any) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAreas();
    loadRows();
  }, []);

  const askDelete = (row: FirmProperty) => {
    if (!isAdmin) {
      Swal.fire({
        icon: "error",
        title: "Admins only",
        text: "You need to be admin to delete.",
        confirmButtonColor: "#d33",
      });
      return;
    }
    Swal.fire({
      title: `Delete ${row.parcel_no}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    }).then((r) => {
      if (r.isConfirmed) performDelete(row);
    });
  };

  const performDelete = async (row: FirmProperty) => {
    setBusyId(row.id);
    try {
      const res = await fetch(`${API}/firm-properties/${row.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      setRows((prev) => prev.filter((p) => p.id !== row.id));
      setToast({ text: "Property deleted", variant: "success" });
    } catch (err: any) {
      setToast({ text: err.message || "Could not delete", variant: "danger" });
    } finally {
      setBusyId(null);
    }
  };

  const applyFilters = (f: Record<string, string>) => {
    setFilters(f);
    setShowFilter(false);
    loadRows(f);
  };

  const clearFilters = () => {
    setFilters({});
    loadRows({});
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Fragment>
      <Seo title="Firm Properties" />

      <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
            <div>
              <SpkBreadcrumb Customclass="mb-1">
                <li className="breadcrumb-item">
                  <Link href="#!">Dashboards</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  General
                </li>
              </SpkBreadcrumb>
              <h1 className="page-title fw-medium fs-18 mb-0">Dashboard</h1>
            </div>
            <Col className="text-end">
                <BsButton variant='primary' onClick={() => setShowFilter(true)}>
                <i className="ri-filter-3-line align-middle me-1 lh-1"></i> Filter
                </BsButton>
            </Col>
        </div>

      {fetchError && (
        <SpkAlert
          variant="danger"
          CustomClass="mb-3"
          dismissible={true}
          show={true}
          onClose={() => setFetchError(null)}
        >
          {fetchError}
        </SpkAlert>
      )}
      {toast && (
        <SpkAlert
          variant={toast.variant}
          CustomClass="mb-3"
          dismissible={true}
          show={true}
          onClose={() => setToast(null)}
        >
          {toast.text}
        </SpkAlert>
      )}

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

      <Row>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">Firm Properties</div>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <SpkTablescomponent
                  tableClass="text-nowrap table-bordered"
                  showCheckbox={false}
                  header={[
                    { title: "Parcel No" },
                    { title: "Area" },
                    { title: "Block" },
                    { title: "Status" },
                    { title: "Asking Price" },
                    { title: "Updated" },
                    { title: "Action" },
                  ]}
                >
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.parcel_no}</td>
                      <td>{row.area_namee}</td>
                      <td>{row.block_no}</td>
                      <td>
                        <span className="badge bg-primary-transparent">
                          {row.status}
                        </span>
                      </td>
                      <td>
                        {row.asking_price != null
                          ? `${row.asking_price.toLocaleString()} BHD`
                          : "--"}
                      </td>
                      <td>{new Date(row.updated_at).toLocaleDateString()}</td>
                      <td>
                        <div className="hstack gap-2 fs-15">
                          <Link
                            href={`/parcel/${row.parcel_no}`}
                            className="btn btn-icon btn-sm btn-primary-light"
                          >
                            <i className="ri-eye-line" />
                          </Link>
                          <SpkButton
                            Size="sm"
                            Buttonvariant={
                              isAdmin ? "danger" : "secondary-light"
                            }
                            Disabled={busyId === row.id || !isAdmin}
                            onClickfunc={() => askDelete(row)}
                          >
                            {busyId === row.id ? (
                              <Spinner
                                animation="border"
                                size="sm"
                                className="me-1"
                              />
                            ) : null}
                            <i className="ri-delete-bin-line" />
                          </SpkButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </SpkTablescomponent>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

FirmPropertiesPage.layout = "ContentLayout";
export default FirmPropertiesPage;
