// pages/members.tsx
"use client";

import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, Col, Row, Table, Spinner } from "react-bootstrap";
import Link from "next/link";

import Seo from "@/shared/layouts-components/seo/seo";
import SpkBreadcrumb from "@/shared/@spk-reusable-components/reusable-uielements/spk-breadcrumb";
import SpkAlert from "@/shared/@spk-reusable-components/reusable-uielements/spk-alert";
import SpkButton from "@/shared/@spk-reusable-components/reusable-uielements/spk-button";

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  real_estate_firm: string;
  role: string;
}

const API = process.env.NEXT_PUBLIC_API_URL!;

const MembersPage = () => {
  const router = useRouter();

  const [me, setMe] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  /* 1) auth profile ------------------------------------------------------ */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/user/me`, { credentials: "include" });
        if (!res.ok) throw new Error("Unauthenticated");
        const { user } = await res.json();
        if (!cancelled) setMe(user);
      } catch {
        if (!cancelled) router.replace("/");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* 2) firm members ------------------------------------------------------ */
  useEffect(() => {
    if (!me) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API}/user/firms/${me.real_estate_firm}/users`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to load members");
        const { users } = await res.json();
        setUsers(users);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Error loading members");
      } finally {
        setLoading(false);
      }
    })();
  }, [me]);

  /* delete (admin‑only) -------------------------------------------------- */
  const isAdmin = me?.role?.toLowerCase() === "admin";

  const handleDelete = async (u: User) => {
    if (!isAdmin) return;
    if (!confirm(`Delete ${u.first_name} ${u.last_name}?`)) return;
    try {
      setBusyId(u.user_id);
      const res = await fetch(`${API}/user/users/${u.user_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      setUsers((prev) => prev.filter((x) => x.user_id !== u.user_id));
    } catch (err: any) {
      alert(err.message || "Could not delete");
    } finally {
      setBusyId(null);
    }
  };

  /* render --------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Fragment>
      <Seo title="Firm Realtors" />

      {/* breadcrumb ------------------------------------------------------- */}
      <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
        <div>
          <SpkBreadcrumb Customclass="mb-1">
            <li className="breadcrumb-item">
              <Link href="#!">Realtors</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              View Firm Realtors
            </li>
          </SpkBreadcrumb>
          <h1 className="page-title fw-medium fs-18 mb-0">Firm Realtors</h1>
        </div>
      </div>

      {/* main grid -------------------------------------------------------- */}
      <Row>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Body className="p-4">

              {error && (
                <SpkAlert
                  variant="danger"
                  dismissible
                  onClose={() => setError(null)}
                  CustomClass="mb-3"
                >
                  {error}
                </SpkAlert>
              )}

              {users.length === 0 ? (
                <p className="mb-0">No users found for your firm.</p>
              ) : (
                <Table responsive hover className="mb-0" style={{ minWidth: 600 }}>
                  <thead className="table">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      {isAdmin && <th style={{ width: 120 }}>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.user_id}>
                        <td>{`${u.first_name} ${u.last_name}`}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        {isAdmin && (
                          <td>
                            <SpkButton
                              Size="sm"
                              Buttonvariant="danger"
                              Disabled={busyId === u.user_id}
                              onClickfunc={() => handleDelete(u)}
                            >
                              {busyId === u.user_id && (
                                <Spinner
                                  animation="border"
                                  size="sm"
                                  className="me-1"
                                />
                              )}
                              Delete
                            </SpkButton>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

MembersPage.layout = "ContentLayout";
export default MembersPage;
