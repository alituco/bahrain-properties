/* pages/dashboard/add-a-property.tsx */
"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/router";
import {
  Card,
  Col,
  Row,
  Form,
  InputGroup,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";

import Seo from "@/shared/layouts-components/seo/seo";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";

const API = process.env.NEXT_PUBLIC_API_URL!;

type UserProfile = { user_id: number; firm_id: number; role: string };

const AddPropertyByParcel = () => {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  const [parcel, setParcel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Require login (redirect to / if not)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/user/me`, { credentials: "include" });
        if (!res.ok) throw new Error("unauth");
        const { user } = await res.json();
        if (!cancelled) setUser(user);
      } catch {
        if (!cancelled) router.replace("/");
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const cleaned = parcel.trim();
  const canSearch = cleaned.length >= 3 && cleaned.length <= 50;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!canSearch) return;

    setSubmitting(true);
    try {
      // 1) Check if parcel exists
      const res = await fetch(`${API}/parcelData/${encodeURIComponent(cleaned)}`, {
        credentials: "include",
      });

      if (res.status === 404) {
        setErr("Parcel not found. Please check the parcel number and try again.");
        return;
      }
      if (!res.ok) {
        setErr("Could not look up that parcel right now. Please try again.");
        return;
      }

      // 2) Redirect to the dashboard property page
      router.push(`/dashboard/property/${encodeURIComponent(cleaned)}`);
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Seo title="Add Property by Parcel" />
      <Pageheader
        title="Dashboard"
        subtitle="Properties"
        currentpage="Add Property"
        activepage="Add Property"
        share={false}
        filter={false}
      />

      <Row className="justify-content-center">
        <Col lg={8} xl={7}>
          <Card className="custom-card shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Find Property by Parcel Number</h5>
              <p className="text-muted mb-4">
                Enter a parcel number to continue to the property details and add it to your firm’s listings.
              </p>

              {err && (
                <Alert
                  variant="danger"
                  onClose={() => setErr(null)}
                  dismissible
                  className="mb-3"
                >
                  {err}
                </Alert>
              )}

              <Form onSubmit={onSubmit}>
                <Form.Label className="small text-muted">Parcel Number</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={parcel}
                    onChange={(e) => setParcel(e.target.value)}
                    placeholder="e.g. 03011123"
                    maxLength={50}
                    autoFocus
                    aria-label="Parcel number"
                  />
                  <Button type="submit" disabled={!canSearch || submitting}>
                    {submitting ? <Spinner size="sm" animation="border" /> : "Search"}
                  </Button>
                </InputGroup>
                <div className="form-text">
                  At least 3 characters. Enter the exact parcel number (numbers and letters if applicable).
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

(AddPropertyByParcel as any).layout = "ContentLayout";
export default AddPropertyByParcel;
