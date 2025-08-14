'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  Card, Form, Button, Spinner, Modal, Row, Col,
} from 'react-bootstrap';
import Swal from 'sweetalert2';
import SpkButton from '@/shared/@spk-reusable-components/reusable-uielements/spk-button';
import SpkAlert  from '@/shared/@spk-reusable-components/reusable-uielements/spk-alert';

const API        = process.env.NEXT_PUBLIC_API_URL!;
const MAX_PHOTOS = 8;

/* Display labels are Capitalized; values are saved in lowercase */
const STATUS_OPTIONS = [
  { value: 'saved',            label: 'Saved' },
  { value: 'listed',           label: 'Listed' },
  { value: 'potential buyer',  label: 'Potential Buyer' },
  { value: 'closing deal',     label: 'Closing Deal' },
  { value: 'paperwork',        label: 'Paperwork' },
  { value: 'sold',             label: 'Sold' },
];

interface Props  { parcelNo:string; afterSave?:()=>void; }
interface Record {
  id:number; status:string; title:string|null; description:string|null;
  asking_price:number|null; sold_price:number|null;
  sold_date:string|null; updated_at:string;
}
interface Img { id:number; url:string; }

const todayISO = () => new Date().toISOString().split('T')[0];
const labelForStatus = (val:string) =>
  STATUS_OPTIONS.find(s => s.value.toLowerCase() === (val||'').toLowerCase())?.label
  ?? (val ? val.replace(/\b\w/g, c => c.toUpperCase()) : '—');

const REQUIRE_FIELDS = new Set(['saved','listed']);

const FirmPropertyCard:React.FC<Props> = ({ parcelNo, afterSave }) => {
  const [rec,setRec] = useState<Record|null>(null);

  const [status,setStatus] = useState('saved'); // save lowercase, show Capitalized
  const [title,setTitle]   = useState('');
  const [descr,setDescr]   = useState('');
  const [ask,setAsk]       = useState('');
  const [sold,setSold]     = useState('');
  const [soldDate,setSoldDate] = useState('');

  const [imgs,setImgs]           = useState<Img[]>([]);
  const [uploading,setUploading] = useState(false);

  const [saving,setSaving]     = useState(false);
  const [showForm,setShowForm] = useState(false);
  const [err,setErr]           = useState<string|null>(null);
  const [preview,setPreview]   = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      try {
        const recRes = await fetch(`${API}/firm-properties/${parcelNo}`, { credentials:'include' });
        if (recRes.status !== 404 && !recRes.ok) throw new Error('Failed to load record');

        if (recRes.status !== 404) {
          const { firmProperty: fp } = await recRes.json();
          setRec(fp);
          setStatus((fp.status || 'saved').toLowerCase());
          setTitle(fp.title ?? '');
          setDescr(fp.description ?? '');
          setAsk( fp.asking_price != null ? String(fp.asking_price) : '');
          setSold(fp.sold_price   != null ? String(fp.sold_price)   : '');
          setSoldDate(fp.sold_date ?? '');

          const imgRes = await fetch(`${API}/firm-properties/${fp.id}/images`, { credentials:'include' });
          const data   = imgRes.ok ? await imgRes.json() : [];
          setImgs(Array.isArray(data) ? data : data.images ?? []);
        }
      } catch (e:any) {
        setErr(e.message);
      }
    })();
  }, [parcelNo]);

  useEffect(() => {
    if (status==='sold' && !soldDate) setSoldDate(todayISO());
    if (status!=='sold') setSoldDate('');
  }, [status, soldDate]);

  const validate = ():string|null => {
    if (REQUIRE_FIELDS.has(status)) {
      if (!title.trim()) return 'Title is required when the property is Saved or Listed.';
      if (!ask.trim())   return 'Asking price is required when the property is Saved or Listed.';
    }
    if (status==='sold') {
      if (!sold.trim())     return 'Sold price is required when the property is Sold.';
      if (!soldDate.trim()) return 'Sold date is required when the property is Sold.';
    }
    return null;
  };

  const save = async () => {
    const msg = validate();
    if (msg){ setErr(msg); return; }

    setSaving(true); setErr(null);
    const body = {
      parcel_no: parcelNo,
      status, // send lowercase to backend
      title: title.trim() || null,
      description: descr.trim() || null,
      asking_price: ask  ? Number(ask)  : null,
      sold_price  : sold ? Number(sold) : null,
      sold_date   : soldDate || null,
    };

    try{
      const url    = rec ? `${API}/firm-properties/${rec.id}` : `${API}/firm-properties`;
      const method = rec ? 'PATCH' : 'POST';
      const r = await fetch(url,{
        method, credentials:'include',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(body)
      });
      if(!r.ok) throw new Error('Save failed');
      const data = await r.json();
      setRec(rec ? data.updatedProperty : data.firmProperty);
      setShowForm(false);
      afterSave?.();
    }catch(e:any){ setErr(e.message || 'Error saving'); }
    finally{ setSaving(false); }
  };

  const upload = async (e:ChangeEvent<HTMLInputElement>)=>{
    if(!rec || !e.target.files?.length) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(e.target.files).forEach(f=>fd.append('files',f));
    const res  = await fetch(`${API}/firm-properties/${rec.id}/images`,{
      method:'POST',credentials:'include',body:fd
    });
    const data = await res.json();
    const newImgs = Array.isArray(data) ? data : data.images ?? [];
    setImgs(i=>[...i,...newImgs]);
    setUploading(false);
  };

  const delImg = async (imgId:number)=>{
    if(!rec) return;
    const { isConfirmed } = await Swal.fire({
      title:'Delete this photo?',
      text:'This action cannot be undone.',
      icon:'warning',
      showCancelButton:true,
      confirmButtonColor:'#d33',
      cancelButtonText:'Cancel',
      confirmButtonText:'Yes, delete',
    });
    if(!isConfirmed) return;

    await fetch(`${API}/firm-properties/${rec.id}/images/${imgId}`,{
      method:'DELETE',credentials:'include'
    });
    setImgs(i=>i.filter(x=>x.id!==imgId));
  };

  return (
    <>
      <Card className="custom-card mb-4">
        <Card.Header><div className="card-title">Firm Property</div></Card.Header>
        <Card.Body>
          {err && (
            <SpkAlert variant="danger" CustomClass="mb-3" dismissible show onClose={()=>setErr(null)}>
              {err}
            </SpkAlert>
          )}

          {rec ? (
            <>
              <h5 className="fw-semibold mb-1">{rec.title ?? '—'}</h5>
              <p className="text-muted">{rec.description ?? 'No description.'}</p>

              <p className="text-muted mb-3">
                Status <b>{labelForStatus(rec.status)}</b> • updated {new Date(rec.updated_at).toLocaleDateString()}
              </p>

              <Row className="g-3 mb-3">
                <Col xs={6}>
                  <span className="text-muted d-block">Asking Price</span>
                  <span className="fw-medium">
                    {rec.asking_price!=null ? `${rec.asking_price.toLocaleString()} BHD` : '—'}
                  </span>
                </Col>
                <Col xs={6}>
                  <span className="text-muted d-block">Sold Price</span>
                  <span className="fw-medium">
                    {rec.sold_price!=null ? `${rec.sold_price.toLocaleString()} BHD` : '—'}
                  </span>
                </Col>
              </Row>

              {rec.sold_date && (
                <p className="text-muted mb-3">
                  Sold on {new Date(rec.sold_date).toLocaleDateString()}
                </p>
              )}

              <h6 className="fw-semibold mb-2">Photos</h6>
              <Row className="g-2 mb-4">
                {imgs.map(img=>(
                  <Col xs={4} sm={3} md={2} key={img.id} className="thumb-wrapper">
                    <img
                      src={img.url}
                      alt=""
                      className="img-fluid rounded border thumb-img"
                      onClick={()=>setPreview(img.url)}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm thumb-close w-100 px-2"
                      onClick={()=>delImg(img.id)}
                    >&times;</button>
                  </Col>
                ))}

                {rec && imgs.length < MAX_PHOTOS && (
                  <Col xs={4} sm={3} md={2}>
                    <Form.Label
                      htmlFor="imgUpload"
                      className="d-flex flex-column justify-content-center align-items-center
                                 border rounded h-100 text-muted cursor-pointer"
                      style={{minHeight:90}}
                    >
                      {uploading
                        ? <Spinner animation="border" size="sm"/>
                        : (<><i className="ti ti-plus fs-4"></i><span className="small">Add</span></>)
                      }
                    </Form.Label>
                    <Form.Control
                      id="imgUpload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={upload}
                      className="d-none"
                    />
                  </Col>
                )}
              </Row>

              <SpkButton Buttonvariant="primary" onClickfunc={()=>setShowForm(true)}>
                <i className="ri-edit-line me-1"/> Edit Property
              </SpkButton>
            </>
          ) : (
            <>
              <p className="text-muted mb-3">
                This property is <strong>not saved</strong> by your firm.
              </p>
              <SpkButton Buttonvariant="primary" onClickfunc={()=>setShowForm(true)}>
                <i className="ri-add-line me-1"/> Add Property
              </SpkButton>
            </>
          )}
        </Card.Body>
      </Card>

      <Modal centered show={showForm} onHide={()=>!saving && setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{rec ? 'Edit Firm Property' : 'Add Firm Property'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={status}
              onChange={e=>setStatus(e.target.value.toLowerCase())}
              disabled={saving}
            >
              {STATUS_OPTIONS.map(s=>(
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Form.Select>
            <div className="form-text">
              <b>Saved</b> keeps it internal; it will not appear on the public marketplace.
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Title {(REQUIRE_FIELDS.has(status)) && <span className="text-danger ms-1">*</span>}
            </Form.Label>
            <Form.Control
              value={title}
              onChange={e=>setTitle(e.target.value)}
              placeholder="e.g. Modern 3-Bed Villa in Saar"
              disabled={saving}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea" rows={4}
              value={descr}
              onChange={e=>setDescr(e.target.value)}
              placeholder="Write something buyers will love…"
              disabled={saving}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Asking Price {(REQUIRE_FIELDS.has(status)) && <span className="text-danger ms-1">*</span>}
            </Form.Label>
            <Form.Control
              type="number" min="0"
              value={ask}
              onChange={e=>setAsk(e.target.value)}
              placeholder="e.g. 150000"
              disabled={saving}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Sold Price {status==='sold' && <span className="text-danger ms-1">*</span>}
            </Form.Label>
            <Form.Control
              type="number" min="0"
              value={sold}
              onChange={e=>setSold(e.target.value)}
              placeholder="e.g. 135000"
              disabled={saving}
            />
          </Form.Group>

          {status==='sold' && (
            <Form.Group className="mb-3">
              <Form.Label>
                Sold Date<span className="text-danger ms-1">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                value={soldDate}
                onChange={e=>setSoldDate(e.target.value)}
                disabled={saving}
              />
            </Form.Group>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" disabled={saving} onClick={()=>setShowForm(false)}>
            Cancel
          </Button>
          <Button variant="primary" disabled={saving} onClick={save}>
            {saving && <Spinner animation="border" size="sm" className="me-1"/>}
            {rec ? 'Update' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={!!preview} onHide={()=>setPreview(null)} centered size="lg">
        <Modal.Body className="p-0">
          <img src={preview ?? ''} alt="" style={{width:'100%'}} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FirmPropertyCard;
