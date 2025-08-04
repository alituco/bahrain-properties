"use client";

import { Fragment, useEffect, useState } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import Image from "next/image";
import Seo from "@/shared/layouts-components/seo/seo";
import HeroSearch from "@/components/marketplace/HeroSearch";
import LandCard, { Land } from "@/components/marketplace/land/LandCard";
import { PageWithLayout } from "@/types/PageWithLayout";

const API = process.env.NEXT_PUBLIC_API_URL!;

const Marketplace: PageWithLayout = () => {
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [anim, setAnim] = useState<"" | "left" | "right">("");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(
          `${API}/land?status=listed&sort=desc&limit=5`,
          { credentials: "include" }
        );
        const { land } = await r.json();
        setLands(land.slice(0, 5));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const next = () => {
    if (!lands.length) return;
    setAnim("right");
    setIndex((i) => (i + 1) % lands.length);
  };

  const prev = () => {
    if (!lands.length) return;
    setAnim("left");
    setIndex((i) => (i - 1 + lands.length) % lands.length);
  };

  const visible =
    lands.length >= 3
      ? [...lands, ...lands].slice(index, index + 3)
      : lands;

  return (
    <Fragment>
      <Seo title="Marketplace" />

      <HeroSearch />

      <section className="container my-5">
        <h2 className="fw-semibold mb-4">Featured Properties</h2>

        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: 200 }}
          >
            <Image
              src="/assets/images/media/loader.svg"
              width={64}
              height={64}
              alt="Loading…"
              priority
            />
          </div>
        ) : (
          <div className="position-relative">
            <div key={index} className={`animate-${anim}`}>
              <Row className="g-3">
                {visible.map((p) => (
                  <Col key={p.id} lg={4} md={6}>
                    <LandCard land={p} />
                  </Col>
                ))}
              </Row>
            </div>

            {lands.length > 3 && (
              <>
                <Button
                  variant="light"
                  className="carousel-btn position-absolute top-50 start-0 translate-middle-y"
                  onClick={prev}
                >
                  ‹
                </Button>
                <Button
                  variant="light"
                  className="carousel-btn position-absolute top-50 end-0 translate-middle-y"
                  onClick={next}
                >
                  ›
                </Button>
              </>
            )}
          </div>
        )}
      </section>

      <section className="py-5 cta-bg text-white">
        <div className="container">
          <Row className="align-items-center gy-4">
            <Col lg={6}>
              <h2 className="fw-bold mb-3">Are you a Real-Estate Professional?</h2>
              <p className="lead mb-0">
                Join <span className="text-warning fw-semibold">Manzil</span>{" "}
                and showcase your listings to thousands of buyers &amp; investors every day.
              </p>
            </Col>
            <Col lg={6}>
              <Card className="shadow border-0">
                <Card.Body className="p-4">
                  <h5 className="fw-semibold mb-3 text-secondary">Get started – it’s free</h5>
                  <Form>
                    <Row className="g-2">
                      <Col md={6}><Form.Control placeholder="Name*" required /></Col>
                      <Col md={6}><Form.Control type="email" placeholder="Email*" required /></Col>
                      <Col xs={12}><Form.Control placeholder="Company / Brokerage" /></Col>
                      <Col xs={12} className="d-grid mt-2">
                        <Button variant="primary" type="submit">Request Agent Access</Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      <style jsx>{`
        .cta-bg {
          background: linear-gradient(
            135deg,
            var(--bs-primary) 0%,
            var(--bs-secondary) 100%
          );
        }
        .carousel-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-size: 22px;
          padding: 0;
          z-index: 5;
        }
        .animate-right,
        .animate-left {
          animation-duration: 0.4s;
          animation-timing-function: ease-in-out;
          animation-fill-mode: both;
        }
        .animate-right {
          animation-name: slide-right;
        }
        .animate-left {
          animation-name: slide-left;
        }
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
      `}</style>
    </Fragment>
  );
};

Marketplace.layout = "BlankLayout";
export default Marketplace;
