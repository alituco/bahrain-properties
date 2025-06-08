/* ------------------------------------------------------------------
   Marketplace landing page
   ----------------------------------------------------------------- */
"use client";

import { Fragment, useState } from "react";
import { Row, Col, Card, Button, Form, Pagination } from "react-bootstrap";
import Seo from "@/shared/layouts-components/seo/seo";
import SpkProducts from "@/shared/@spk-reusable-components/reusable-apps/spk-products";

import HeroSearch from "@/components/marketplace/HeroSearch";
import { PageWithLayout } from "@/types/PageWithLayout";

/* -------------------------------------------------  stub data ---- */
const featuredJson = [
  { id: 101, name: "Seaview Villa • Amwaj", price: 215_000 },
  { id: 102, name: "High-floor Apartment • Seef", price: 138_000 },
  { id: 103, name: "Corner Plot • Diyar Al Muharraq", price:  95_000 },
];

const latestJson = [
  { id: 1, name: "Villa in Juffair",  price: 120_000 },
  { id: 2, name: "Apartment in Seef", price:  85_000 },
];

/* ------------------------------------------------------------------ */
const Marketplace: PageWithLayout = () => {
  const [featured] = useState(featuredJson);
  const [latest  ] = useState(latestJson);

  return (
    <Fragment>
      <Seo title="Marketplace" />

      {/* ─────────────  HERO  ───────────── */}
      <HeroSearch />

      {/* ─────────────  FEATURED  ───────────── */}
      <section className="container my-5">
        <h2 className="fw-semibold mb-4 text-primary">Featured Properties</h2>
        <Row className="g-3">
          {featured.map(p => (
            <Col key={p.id} lg={4} md={6}>
              <SpkProducts card={p} shoBadge idx="#" />
            </Col>
          ))}
        </Row>
      </section>


      {/* ─────────────  CALL-TO-ACTION  ───────────── */}
      <section className="py-5 cta-bg text-white">
        <div className="container">
          <Row className="align-items-center gy-4">
            <Col lg={6}>
              <h2 className="fw-bold mb-3">Are you a Real-Estate Professional?</h2>
              <p className="lead mb-0">
                Join <span className="text-warning fw-semibold">PMS Bahrain</span> – Bahrain’s
                dedicated property platform – and showcase your listings directly
                to thousands of buyers &amp; investors every day.
              </p>
            </Col>

            {/* interest form – inline, super-simple */}
            <Col lg={6}>
              <Card className="shadow border-0">
                <Card.Body className="p-4">
                  <h5 className="fw-semibold mb-3 text-secondary">
                    Get started – it’s free
                  </h5>
                  <Form>
                    <Row className="g-2">
                      <Col md={6}>
                        <Form.Control placeholder="Name*"        required />
                      </Col>
                      <Col md={6}>
                        <Form.Control type="email" placeholder="Email*" required />
                      </Col>
                      <Col xs={12}>
                        <Form.Control placeholder="Company / Brokerage" />
                      </Col>
                      <Col xs={12} className="d-grid mt-2">
                        <Button variant="primary" type="submit">
                          Request Agent Access
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* ─────────────  styles  ───────────── */}
      <style jsx>{`
        .cta-bg{
          background: var(--bs-primary);
          background: linear-gradient(135deg, var(--bs-primary) 0%, var(--bs-secondary) 100%);
        }
      `}</style>
    </Fragment>
  );
};

/* no sidebar / main header */
Marketplace.layout = "BlankLayout";
export default Marketplace;
