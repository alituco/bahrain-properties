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

interface Props {
  propertyId: number;
  /** optional hook if parent wants to react after deletion (e.g. navigate away or refresh list) */
  onDeleted?: () => void;
}

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

const FirmHouseCard: React.FC<Props> = ({ propertyId, onDeleted }) => {
  const [rec, setRec] = useState<Record | null>(null);

  /* form helpers */
  const [status, setStatus] = useState('');
  const [title , setTitle ] = useState('');
  const [descr , setDescr ] = useState('');
  const [price , setPrice ] = useState('');
  const [imgs,  setImgs  ] = useState<Img[]>([]);

  const [uploading, setUploading] = useState(false);
  const [saving,    setSaving   ] = useState(false);
  const [deleting,  setDeleting ] = useState(false);
  const [showForm,  setShowForm ] = useState(false);
  const [err,       setErr      ] = useState<string | null>(null);
  const [preview,   setPreview  ] = useState<string | null>(null);
  const [deleted,   setDeleted  ] = useState(false);

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

      const resp = await fetch(`${API}/house/${propertyId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!resp.ok) throw new Error(await resp.text());
      const { updatedProperty } = await resp.json();
      setRec(updatedProperty);
      setShowForm(false);
    } catch (e: any) { setErr(e.message || 'Failed to save'); }
      finally        { setSaving(false); }
  };

  /* ---------- delete listing ----------- */
  const confirmDelete = async () => {
    if (!rec || deleting) return;

    const { isConfirmed } = await Swal.fire({
      title: 'Delete this listing?',
      text: 'This will permanently remove the property from your firm.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
    });
    if (!isConfirmed) return;

    try {
      setDeleting(true);
      const resp = await fetch(`${API}/house/${propertyId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!resp.ok) throw new Error(await resp.text());
      setDeleted(true);
      setRec(null);
      setImgs([]);
      await Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false });
      onDeleted?.();
    } catch (e: any) {
      setErr(e.message || 'Failed to delete property');
    } finally {
      setDeleting(false);
    }
  };

  /* ---------- image upload / delete -------- */
  const upload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!rec || !e.target.files?.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(e.target.files).forEach(f => fd.append('files', f));
      const up = await fetch(`${API}/firm-properties/${rec.id}/images`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      if (!up.ok) throw new Error(await up.text());

      const ir = await fetch(`${API}/firm-properties/${rec.id}/images`, { credentials: 'include' });
      const data = ir.ok ? await ir.json() : [];
      setImgs(Array.isArray(data) ? data : data.images ?? []);
    } catch (e:any) {
      setErr(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const delImg = async (imgId: number) => {
    if (!rec) return;
    const { isConfirmed } = await Swal.fire({
      title: 'Delete this photo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
    });
    if (!isConfirmed) return;

    const resp = await fetch(`${API}/firm-properties/${rec.id}/images/${imgId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!resp.ok) {
      setErr(await resp.text());
      return;
    }
    setImgs(i => i.filter(x => x.id !== imgId));
  };

  /* ---------- render ---------- */
  return (
    <>
      <Card className="custom-card mb-4">
        <Card.Header><div className="card-title">Firm Listing</div></Card.Header>
        <Card.Body>
          {err && (
            <SpkAlert variant="danger" CustomClass="mb-3" show onClose={() => setErr(null)}>
              {err}
            </SpkAlert>
          )}
          {deleted && (
            <SpkAlert variant="success" CustomClass="mb-3" show>
              Property deleted.
            </SpkAlert>
          )}

          {rec ? (
            <>
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <h5 className="fw-semibold mb-1">{rec.title ?? '—'}</h5>
                  <p className="text-muted mb-2">{rec.description ?? 'No description.'}</p>
                  <p className="text-muted mb-0">
                    Status <b>{rec.status}</b> • updated {new Date(rec.updated_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="d-flex gap-2">
                  <SpkButton Buttonvariant="primary" onClickfunc={() => setShowForm(true)}>
                    <i className="ri-edit-line me-1" /> Edit&nbsp;Listing
                  </SpkButton>
                  <Button
                    variant="danger"
                    onClick={confirmDelete}
                    disabled={deleting}
                    title="Delete listing"
                  >
                    {deleting && <Spinner size="sm" className="me-1" />}
                    <i className="ri-delete-bin-line me-1" />
                    Delete
                  </Button>
                </div>
              </div>

              <Row className="gy-2 my-3">
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
                    >
                      ×
                    </button>
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
            </>
          ) : (
            <>
              {!deleted ? (
                <div className="py-3 text-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <p className="text-muted mb-0">This listing has been deleted.</p>
              )}
            </>
          )}
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
