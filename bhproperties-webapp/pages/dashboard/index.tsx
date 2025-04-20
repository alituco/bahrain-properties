"use client";

import dynamic from "next/dynamic";
import React, { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, Col, Dropdown, Row } from "react-bootstrap";
import Link from "next/link";

import Spkcardscomponent from "@/shared/@spk-reusable-components/reusable-dashboards/spk-cards";
import SpkDropdown from "@/shared/@spk-reusable-components/reusable-uielements/spk-dropdown";
import SpkBreadcrumb from "@/shared/@spk-reusable-components/reusable-uielements/spk-breadcrumb";
import Seo from "@/shared/layouts-components/seo/seo";
import { Cardsdata, Recentorders } from "@/shared/data/dashboard/salesdata";

// map wrapper (client‑side only)
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

// adjust this list if you add more statuses in the DB
const STATUSES = ["listed", "sold", "paperwork", "under_contract"];

const Sales = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // map status filter
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // auth check ---------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;              // guard in case component unmounts

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
        if (!cancelled) router.replace("/");   // go home once
      } finally {
        if (!cancelled) setLoading(false);     // show UI regardless
      }
    })();

    return () => { cancelled = true };
  }, []);

  // demo data for other dashboard cards
  const [data, setData] = useState(Recentorders);
  const handleRemove = (id: number) =>
    setData((d) => d.filter((item) => item.id !== id));

  // --------------------------------------------------------------------------
  return (
    <Fragment>
      {!loading && (
        <Fragment>
          <Seo title="Dashboard" />

          {/* breadcrumb ------------------------------------------------------- */}
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

          {/* main grid -------------------------------------------------------- */}
          <Row>
            <Col xl={8}>
              <Row>
                {/* summary cards */}
                {Cardsdata.map((item, idx) => (
                  <Col xxl={3} xl={6} key={idx}>
                    <Spkcardscomponent
                      cardClass="overflow-hidden main-content-card"
                      headingClass="d-block mb-1"
                      mainClass="d-flex align-items-start justify-content-between mb-2"
                      Icon
                      iconClass={item.iconClass}
                      card={item}
                      badgeClass="md rounded-pill"
                      dataClass="mb-0"
                    />
                  </Col>
                ))}

                {/* map card --------------------------------------------------- */}
                <Col xxl={16} xl={12}>
                  <Card className="custom-card">
                    <Card.Header className="justify-content-between">
                      <Card.Title>Firm Properties</Card.Title>

                      {/* status dropdown */}
                      <SpkDropdown
                        toggleas="a"
                        Customtoggleclass="btn btn-sm btn-light text-muted"
                        Toggletext={
                          statusFilter === "all"
                            ? "All Statuses"
                            : `Status: ${statusFilter}`
                        }
                      >
                        <Dropdown.Item onClick={() => setStatusFilter("all")}>
                          All Statuses
                        </Dropdown.Item>
                        {STATUSES.map((s) => (
                          <Dropdown.Item
                            key={s}
                            onClick={() => setStatusFilter(s)}
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </Dropdown.Item>
                        ))}
                      </SpkDropdown>
                    </Card.Header>

                    <Card.Body>
                      {/* pass filter down */}
                      <MapContainer statusFilter={statusFilter} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>

            {/* right‑hand promo banner --------------------------------------- */}
            <Col xl={4}>
              <Row>
                <Col xl={12}>
                  <Card className="custom-card main-dashboard-banner overflow-hidden">
                    <Card.Body className="p-4">
                      <div className="row justify-content-between">
                        <Col xxl={7} xl={5} lg={5} md={5} sm={5}>
                          <h4 className="mb-3 fw-medium text-fixed-white">
                            Upgrade to get more
                          </h4>
                          <p className="mb-4 text-fixed-white">
                            Stay ahead of the market. Optimize performance. View
                            advanced insights. Achieve success with Platinum.
                          </p>
                          <Link
                            href="#!"
                            className="fw-medium text-fixed-white text-decoration-underline"
                          >
                            Upgrade To Platinum
                            <i className="ti ti-arrow-narrow-right"></i>
                          </Link>
                        </Col>
                        <Col
                          xxl={4}
                          xl={7}
                          lg={7}
                          md={7}
                          sm={7}
                          className="d-sm-block d-none text-end my-auto"
                        >
                          <img
                            src="/assets/images/media/media-86.png"
                            alt=""
                            className="img-fluid"
                          />
                        </Col>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
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
