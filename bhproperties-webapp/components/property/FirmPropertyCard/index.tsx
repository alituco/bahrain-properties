"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Button,
  Spinner,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import SpkButton from "@/shared/@spk-reusable-components/reusable-uielements/spk-button";
import SpkAlert  from "@/shared/@spk-reusable-components/reusable-uielements/spk-alert";

const API = process.env.NEXT_PUBLIC_API_URL!;
const STATUSES = ["listed","potential buyer","closing deal","paperwork","sold"];

interface Props {
  parcelNo: string;
  afterSave?: () => void;
}

interface Record {
  id: number;
  status: string;
  asking_price: number | null;
  sold_price: number | null;
  sold_date: string | null;       
  updated_at: string;
}

const todayISO = () => new Date().toISOString().split("T")[0];

/* ------------------------------------------------------------------ */
const FirmPropertyCard: React.FC<Props> = ({ parcelNo, afterSave }) => {
  /* ---------- record & form ---------- */
  const [rec,   setRec]   = useState<Record | null>(null);
  const [status, setStatus] = useState("listed");
  const [ask,    setAsk]    = useState("");
  const [sold,   setSold]   = useState("");
  const [soldDate, setSoldDate] = useState("");   // yyyy-mm-dd

  /* ---------- ui state ---------- */
  const [saving,   setSaving]   = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [err,      setErr]      = useState<string | null>(null);

  /* ---------- load once ---------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/firm-properties/${parcelNo}`, {
          credentials: "include",
        });
        if (res.status === 404) return;
        const { firmProperty } = await res.json();
        setRec(firmProperty);

        setStatus(firmProperty.status);
        setAsk(  firmProperty.asking_price !== null ? String(firmProperty.asking_price) : "");
        setSold( firmProperty.sold_price   !== null ? String(firmProperty.sold_price)   : "");
        setSoldDate(firmProperty.sold_date ?? "");
      } catch (e: any) {
        setErr(e.message);
      }
    })();
  }, [parcelNo]);

  /* ---------- save ---------- */
  async function save() {
    if (status === "sold" && !soldDate) {
      setErr("Please pick a Sold Date.");
      return;
    }

    setSaving(true); setErr(null);

    const body = {
      parcel_no: parcelNo,
      status,
      asking_price: ask  ? Number(ask)  : null,
      sold_price:   sold ? Number(sold) : null,
      sold_date:    soldDate || null,
    };

    try {
      const url    = rec ? `${API}/firm-properties/${rec.id}` : `${API}/firm-properties`;
      const method = rec ? "PATCH" : "POST";

      const r = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error("Save failed");

      const data = await r.json();
      setRec(rec ? data.updatedProperty : data.firmProperty);
      setShowForm(false);
      afterSave?.();
    } catch (e: any) {
      setErr(e.message || "Error saving property");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (status === "sold" && !soldDate) setSoldDate(todayISO());
    if (status !== "sold")              setSoldDate("");          // reset
  }, [status]);   // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* main card */}
      <Card className="custom-card mb-4">
        <Card.Header><div className="card-title">Firm Property</div></Card.Header>

        <Card.Body>
          {err && (
            <SpkAlert variant="danger" CustomClass="mb-3" dismissible show onClose={() => setErr(null)}>
              {err}
            </SpkAlert>
          )}

          {rec ? (
            <>
              <p className="text-muted mb-3">
                Saved by firm • last status <b>{rec.status}</b>
                <br />
                Updated {new Date(rec.updated_at).toLocaleDateString()}
              </p>
              <Row className="g-3 mb-3">
                <Col xs={6}>
                  <span className="text-muted d-block">Asking Price</span>
                  <span className="fw-medium">{rec.asking_price !== null ? `${rec.asking_price.toLocaleString()} BHD` : "--"}</span>
                </Col>
                <Col xs={6}>
                  <span className="text-muted d-block">Sold Price</span>
                  <span className="fw-medium">{rec.sold_price !== null ? `${rec.sold_price.toLocaleString()} BHD` : "--"}</span>
                </Col>
              </Row>
              {rec.sold_date && (
                <p className="text-muted mb-3">
                  Sold on {new Date(rec.sold_date).toLocaleDateString()}
                </p>
              )}
              <SpkButton Buttonvariant="primary" onClickfunc={() => setShowForm(true)}>
                <i className="ri-edit-line me-1" />Edit Property
              </SpkButton>
            </>
          ) : (
            <>
              <p className="text-muted mb-3">This property is <strong>not saved</strong> by your firm.</p>
              <SpkButton Buttonvariant="primary" onClickfunc={() => setShowForm(true)}>
                <i className="ri-add-line me-1" />Add Property
              </SpkButton>
            </>
          )}
        </Card.Body>
      </Card>

      {/* modal */}
      <Modal centered show={showForm} onHide={() => !saving && setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{rec ? "Edit Firm Property" : "Add Firm Property"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)} disabled={saving}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Asking Price</Form.Label>
            <Form.Control type="number" placeholder="e.g. 150000" value={ask} onChange={(e) => setAsk(e.target.value)} disabled={saving}/>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sold Price</Form.Label>
            <Form.Control type="number" placeholder="e.g. 135000" value={sold} onChange={(e) => setSold(e.target.value)} disabled={saving}/>
          </Form.Group>

          {status === "sold" && (
            <Form.Group className="mb-3">
              <Form.Label>Sold Date<span className="text-danger">*</span></Form.Label>
              <Form.Control type="date" value={soldDate} onChange={(e) => setSoldDate(e.target.value)} disabled={saving}/>
            </Form.Group>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" disabled={saving} onClick={() => setShowForm(false)}>Cancel</Button>
          <Button variant="primary" disabled={saving} onClick={save}>
            {saving && <Spinner size="sm" className="me-1" />}
            {rec ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FirmPropertyCard;
