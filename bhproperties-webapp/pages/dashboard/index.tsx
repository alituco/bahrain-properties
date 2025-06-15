"use client";

import dynamic from "next/dynamic";
import React, { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, Col, Dropdown, Row } from "react-bootstrap";
import Link from "next/link";

import SpkDropdown from "@/shared/@spk-reusable-components/reusable-uielements/spk-dropdown";
import SpkBreadcrumb from "@/shared/@spk-reusable-components/reusable-uielements/spk-breadcrumb";
import Seo from "@/shared/layouts-components/seo/seo";
import FirmStatsCards from "@/components/dashboard/FirmStatsCards";

const MapContainer = dynamic(() => import("@/components/map/MapContainer"), {
  ssr: false,
});

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  firm_id: number;
  real_estate_firm: string;
}

const STATUSES = ["listed", "sold", "paperwork", "under_contract"];

const Sales = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    let cancelled = false;              

    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/me`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Unauthenticated");
        const { user } = await res.json();
        if (!cancelled) setUser(user);
      } catch (e) {
        if (!cancelled) router.replace("/");   
      } finally {
        if (!cancelled) setLoading(false);     
      }
    })();

    return () => { cancelled = true };
  }, []);

  return (
    <Fragment>
      {!loading && (
        <Fragment>
          <Seo title="Dashboard" />

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
          </div>

          <Row>
            <Col xl={11}>
              {user && <FirmStatsCards firmId={user.firm_id} />}

              <Col xxl={16} xl={12}>
                <Card className="custom-card">
                  <Card.Header className="justify-content-between">
                    <Card.Title>Firm Properties</Card.Title>

                    <SpkDropdown
                      toggleas="a"
                      Customtoggleclass="btn btn-sm btn-light text-muted"
                      Toggletext={
                        statusFilter === "all"
                          ? "All Statuses"
                          : `Status: ${statusFilter}`
                      }
                    >
                      <Dropdown.Item onClick={() => setStatusFilter("all")}>
                        All Statuses
                      </Dropdown.Item>
                      {STATUSES.map((s) => (
                        <Dropdown.Item key={s} onClick={() => setStatusFilter(s)}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </Dropdown.Item>
                      ))}
                    </SpkDropdown>
                  </Card.Header>

                  <Card.Body>
                    <MapContainer
                      filters={{ status: statusFilter }}
                      savedOnly={true}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Col>


            <Col xl={4}>
              <Row>

              </Row>
            </Col>
          </Row>
        </Fragment>
      )}
    </Fragment>
  );
};

Sales.layout = "ContentLayout";
export default Sales;
