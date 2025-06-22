'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  Card, Form, Button, Modal, Row, Col, Spinner,
} from 'react-bootstrap';
import Swal        from 'sweetalert2';
import SpkButton   from '@/shared/@spk-reusable-components/reusable-uielements/spk-button';
import SpkAlert    from '@/shared/@spk-reusable-components/reusable-uielements/spk-alert';

const API        = process.env.NEXT_PUBLIC_API_URL!;
const STATUSES   = ['available', 'reserved', 'leased', 'draft'];
const MAX_PHOTOS = 8;

interface Props { propertyId: number; }

interface Record {
  id           : number;
  status       : string;
  title        : string | null;
  description  : string | null;
  listing_type : 'sale' | 'rent';
  asking_price : number | null;
  rent_price   : number | null;
  floors       : number | null;
  plot_size_m2 : number | null;
  parking_spots: number | null;
  updated_at   : string;
}

interface Img { id: number; url: string; }

const FirmHouseCard: React.FC<Props> = ({ propertyId }) => {
  const [rec, setRec] = useState<Record | null>(null);

  /* form helpers */
  const [status, setStatus] = useState('');
  const [title , setTitle ] = useState('');
  const [descr , setDescr ] = useState('');
  const [price , setPrice ] = useState('');
  const [imgs,  setImgs  ] = useState<Img[]>([]);

  const [uploading, setUploading] = useState(false);
  const [saving,    setSaving   ] = useState(false);
  const [showForm,  setShowForm ] = useState(false);
  const [err,       setErr      ] = useState<string | null>(null);
  const [preview,   setPreview  ] = useState<string | null>(null);

  /* ---------- load record + images ---------- */
  useEffect(() => { (async () => {
    try {
      const r = await fetch(`${API}/house/${propertyId}`, { credentials: 'include' });
      if (!r.ok) throw new Error(await r.text());
      const { property } = await r.json();
      setRec(property);
      setStatus(property.status);
      setTitle(property.title ?? '');
      setDescr(property.description ?? '');
      setPrice(
        property.listing_type === 'sale'
          ? property.asking_price?.toString() ?? ''
          : property.rent_price?.toString()   ?? ''
      );

      const ir = await fetch(`${API}/firm-properties/${property.id}/images`, { credentials: 'include' });
      const data = ir.ok ? await ir.json() : [];
      setImgs(Array.isArray(data) ? data : data.images ?? []);
    } catch (e: any) { setErr(e.message); }
  })(); }, [propertyId]);

  /* ---------- save main fields ----------- */
  const save = async () => {
    if (!rec) return;
    setSaving(true);
    try {
      const body: any = {
        status,
        title: title.trim() || null,
        description: descr.trim() || null,
      };
      if (rec.listing_type === 'sale') body.asking_price = price ? Number(price) : null;
      else                             body.rent_price  = price ? Number(price) : null;

      await fetch(`${API}/house/${propertyId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setShowForm(false);
    } catch (e: any) { setErr(e.message); }
      finally        { setSaving(false); }
  };

  /* ---------- image upload / delete -------- */
  const upload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!rec || !e.target.files?.length) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(e.target.files).forEach(f => fd.append('files', f));
    await fetch(`${API}/firm-properties/${rec.id}/images`, {
      method: 'POST',
      credentials: 'include',
      body: fd,
    });
    const ir = await fetch(`${API}/firm-properties/${rec.id}/images`, { credentials: 'include' });
    const data = ir.ok ? await ir.json() : [];
    setImgs(Array.isArray(data) ? data : data.images ?? []);
    setUploading(false);
  };

  const delImg = async (imgId: number) => {
    if (!rec) return;
    const { isConfirmed } = await Swal.fire({ title: 'Delete this photo?', icon: 'warning', showCancelButton: true });
    if (!isConfirmed) return;
    await fetch(`${API}/firm-properties/${rec.id}/images/${imgId}`, { method: 'DELETE', credentials: 'include' });
    setImgs(i => i.filter(x => x.id !== imgId));
  };

  /* ---------- render ---------- */
  return (
    <>
      <Card className="custom-card mb-4">
        <Card.Header><div className="card-title">Firm Listing</div></Card.Header>
        <Card.Body>
          {err && <SpkAlert variant="danger" CustomClass="mb-3" show onClose={() => setErr(null)}>{err}</SpkAlert>}

          {rec ? (
            <>
              <h5 className="fw-semibold mb-1">{rec.title ?? '—'}</h5>
              <p className="text-muted">{rec.description ?? 'No description.'}</p>

              <p className="text-muted mb-2">
                Status <b>{rec.status}</b> • updated {new Date(rec.updated_at).toLocaleDateString()}
              </p>

              <Row className="gy-2 mb-3">
                <Col sm={6}>
                  <span className="text-muted d-block">Floors</span>
                  <span className="fw-medium">{rec.floors ?? '—'}</span>
                </Col>
                <Col sm={6}>
                  <span className="text-muted d-block">Parking Spots</span>
                  <span className="fw-medium">{rec.parking_spots ?? '—'}</span>
                </Col>
                <Col sm={6}>
                  <span className="text-muted d-block">
                    {rec.listing_type === 'sale' ? 'Asking Price' : 'Rent Price'}
                  </span>
                  <span className="fw-medium">
                    {price
                      ? `${Number(price).toLocaleString()} BHD${rec.listing_type === 'rent' ? '/mo' : ''}`
                      : '—'}
                  </span>
                </Col>
              </Row>

              {/* ---- images ---- */}
              <h6 className="fw-semibold mb-2">Photos</h6>
              <Row className="g-2 mb-4">
                {imgs.map(img => (
                  <Col xs={4} sm={3} md={2} key={img.id} className="thumb-wrapper">
                    <img
                      src={img.url}
                      className="img-fluid rounded border thumb-img"
                      alt=""
                      onClick={() => setPreview(img.url)}
                    />
                    <button
                      className="btn btn-danger btn-sm thumb-close w-100 px-2"
                      onClick={() => delImg(img.id)}
                    >×</button>
                  </Col>
                ))}

                {imgs.length < MAX_PHOTOS && (
                  <Col xs={4} sm={3} md={2}>
                    <Form.Label
                      htmlFor="imgUploader"
                      className="d-flex flex-column align-items-center justify-content-center
                                 border rounded h-100 text-muted cursor-pointer"
                      style={{ minHeight: 90 }}
                    >
                      {uploading
                        ? <Spinner animation="border" size="sm" />
                        : (<><i className="ti ti-plus fs-4" /><span className="small">Add</span></>)
                      }
                    </Form.Label>
                    <Form.Control
                      id="imgUploader"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={upload}
                      className="d-none"
                    />
                  </Col>
                )}
              </Row>

              <SpkButton Buttonvariant="primary" onClickfunc={() => setShowForm(true)}>
                <i className="ri-edit-line me-1" /> Edit&nbsp;Listing
              </SpkButton>
            </>
          ) : <Spinner animation="border" />}
        </Card.Body>
      </Card>

      {/* ---- main edit modal ---- */}
      <Modal centered show={showForm} onHide={() => !saving && setShowForm(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Listing</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select value={status} onChange={e => setStatus(e.target.value)} disabled={saving}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control value={title} onChange={e => setTitle(e.target.value)} disabled={saving} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={descr}
              onChange={e => setDescr(e.target.value)}
              disabled={saving}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price (BHD{rec?.listing_type === 'rent' ? '/mo' : ''})</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={price}
              onChange={e => setPrice(e.target.value)}
              disabled={saving}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForm(false)} disabled={saving}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving}>
            {saving && <Spinner size="sm" className="me-1" />}Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---- full-screen image modal ---- */}
      <Modal show={!!preview} onHide={() => setPreview(null)} centered size="lg">
        <Modal.Body className="p-0"><img src={preview ?? ''} style={{ width: '100%' }} /></Modal.Body>
      </Modal>
    </>
  );
};

export default FirmHouseCard;
