'use client';

import React, { Fragment, useEffect, useState, ChangeEvent } from 'react';
import { useRouter }   from 'next/router';
import dynamic         from 'next/dynamic';
import {
  Row, Col, Card, Form, Spinner,
  Alert, Button as BsBtn,
  Badge
} from 'react-bootstrap';
import SpkButton   from '@/shared/@spk-reusable-components/reusable-uielements/spk-button';
import Seo         from '@/shared/layouts-components/seo/seo';
import Pageheader  from '@/shared/layouts-components/page-header/pageheader';
import { PageWithLayout } from '@/types/PageWithLayout';
import Image from 'next/image';

const SpkSelect = dynamic(
  () => import('@/shared/@spk-reusable-components/reusable-plugins/spk-reactselect')
          .then(m => m.default),
  { ssr: false }
);
const Map    = dynamic(() => import('react-map-gl/mapbox'), { ssr: false });
const Marker = dynamic(() =>
  import('react-map-gl/mapbox').then(m => ({ default: m.Marker })), { ssr: false });

import 'mapbox-gl/dist/mapbox-gl.css';

const seq = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ value: i + 1, label: `${i + 1}` }));

const BedroomOpts   = [...seq(10), { value: 11, label: '10+' }];
const BathroomOpts  = [...seq(10), { value: 11, label: '10+' }];
const FurnishedOpts = [
  { value: true,  label: 'Furnished' },
  { value: false, label: 'Un-furnished' }
];
const ListingOpts   = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' }
];
const FloorOpts     = [...seq(4), { value: 5, label: '5+' }];

interface UserProfile { user_id: number; firm_id: number; role: string; }

const AddHouseProperty: PageWithLayout = () => {
  const router   = useRouter();
  const API      = process.env.NEXT_PUBLIC_API_URL!;
  const TOKEN    = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

  const [user, setUser]   = useState<UserProfile | null>(null);
  const [checking, setChk] = useState(true);

  useEffect(() => { (async () => {
    try {
      const r = await fetch(`${API}/user/me`, { credentials: 'include' });
      if (!r.ok) throw new Error();
      const { user } = await r.json();
      setUser(user);
    } catch { router.replace('/'); }
    finally { setChk(false); }
  })(); }, [API, router]);

  const [title, setTitle] = useState('');
  const [listingType, setListingType] =
    useState<'' | 'sale' | 'rent'>('');        

  const [price , setPrice ] = useState<number | ''>('');
  const [plot  , setPlot  ] = useState<number | ''>('');
  const [built , setBuilt ] = useState<number | ''>('');
  const [floors, setFloors] = useState<number>();
  const [beds  , setBeds  ] = useState<number>();
  const [baths , setBaths ] = useState<number>();
  const [parking, setParking] = useState<number | ''>('');
  const [furn  , setFurn ] = useState<boolean>();
  const [desc  , setDesc ] = useState('');
  const [block , setBlock ] = useState('');
  const [area  , setArea  ] = useState('');

  const [amenSel, setAmenSel] = useState<string[]>([]);
  const [images , setImages ] = useState<File[]>([]);
  const [saving , setSaving ] = useState(false);
  const [toast  , setToast  ] =
    useState<{ text: string; variant: 'success' | 'danger' } | null>(null);

  const [amenOpts, setAmenOpts] = useState<{ label: string; value: string }[]>([]);
  const [loadAms , setLoadAms]  = useState(true);

  useEffect(() => { (async () => {
    try {
      const r = await fetch(`${API}/house/amenities`, { credentials: 'include' });
      const { amenities } = await r.json();
      setAmenOpts(amenities);
    } finally { setLoadAms(false); }
  })(); }, [API]);

  type LocMode = 'parcel' | 'map';
  const [locMode , setLocMode] = useState<LocMode>('parcel');
  const [parcel  , setParcel]  = useState('');
  const [marker  , setMarker]  = useState<{ lat: number; lon: number } | null>(null);
  const [mapErr  , setMapErr]  = useState<string | null>(null);

  const onMapClick = (e: any) => {
    const { lng, lat } = e.lngLat;
    setMarker({ lon: lng, lat });
    setMapErr(null);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const uniq = [...images, ...Array.from(e.target.files)]
      .filter((f, i, a) =>
        a.findIndex(x => x.name === f.name && x.size === f.size) === i)
      .slice(0, 10);
    setImages(uniq);
    e.target.value = '';
  };
  const removeImg = (i: number) =>
    setImages(ps => ps.filter((_, idx) => idx !== i));

  const saveProperty = async () => {
    setToast(null);
    const err = (t: string) => { setToast({ text: t, variant: 'danger' }); return true; };

    if (!listingType)                       if (err('Select listing type')) return;
    if (!beds || !baths)                    if (err('Beds & baths required')) return;
    if (!block || !area)                    if (err('Block & area required')) return;
    if (plot === '')                        if (err('Plot size required')) return;
    if (parking === '')                     if (err('Parking spots required')) return;
    if (images.length === 0)                if (err('At least one image required')) return;

    if (locMode === 'parcel' && !parcel)    if (err('Parcel number required')) return;
    if (locMode === 'map' && !marker)       if (err('Pick location on map')) return;

    setSaving(true);
    try {
      const body: any = {
        listing_type : listingType,
        status       : 'draft',
        bedrooms     : beds,
        bathrooms    : baths,
        furnished    : furn ?? false,
        title        : title.trim(),
        description  : desc.trim(),
        amenities    : amenSel,
        block_no     : block,
        area_name_en : area,
        plot_size_m2 : +plot,
        built_up_m2  : built ? +built : null,
        floors       : floors || null,
        parking_spots: +parking,
        firm_id      : user?.firm_id,
        user_id      : user?.user_id
      };

      if (listingType === 'sale') body.asking_price = +price;
      else                         body.rent_price  = +price;

      if (locMode === 'parcel') body.parcel_no = parcel.trim();
      else {
        body.latitude  = marker!.lat;
        body.longitude = marker!.lon;
      }

      const r = await fetch(`${API}/house`, {
        method : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(body)
      });
      if (!r.ok) throw new Error(await r.text());
      const { id } = await r.json();

      /* upload images */
      const fd = new FormData();
      images.forEach(f => fd.append('files', f));
      const up = await fetch(`${API}/firm-properties/${id}/images`, {
        method: 'POST', credentials: 'include', body: fd });
      if (!up.ok) throw new Error(await up.text());

      router.push(`/house/${id}`);
    } catch (e: any) {
      setToast({ text: e.message || 'Save failed', variant: 'danger' });
    } finally { setSaving(false); }
  };

  if (checking) return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <Image src="/assets/images/media/loader.svg" width={64} height={64} alt="Loading" priority/>
    </div>
  );

  return (
    <Fragment>
      <Seo title="Add House" />
      <Pageheader share={false} filter={false}
                  title="Dashboard" subtitle="House"
                  currentpage="Add House" activepage="Add House"/>

      {toast && (
        <Alert variant={toast.variant} onClose={() => setToast(null)} dismissible className="mb-3">
          {toast.text}
        </Alert>
      )}

      <Row><Col xl={12}>
        <Card className="custom-card">
          <Card.Body><Row className="gx-4 gy-3">

            {/* ─── LEFT COL ───────────────────────────────────── */}
            <Col xxl={6} lg={12}><Row className="gy-3">

              <Col xl={12}><Form.Label>Property Title *</Form.Label>
                <Form.Control value={title}
                              onChange={e => setTitle(e.target.value)}
                              maxLength={150}/>
              </Col>

              <Col xl={6}><Form.Label>Bedrooms *</Form.Label>
                {/* @ts-ignore */}
                <SpkSelect option={BedroomOpts} onChange={(o:any)=>setBeds(+o.value)}/>
              </Col>

              <Col xl={6}><Form.Label>Bathrooms *</Form.Label>
                {/* @ts-ignore */}
                <SpkSelect option={BathroomOpts} onChange={(o:any)=>setBaths(+o.value)}/>
              </Col>

              <Col xl={6}><Form.Label>Listing Type *</Form.Label>
                {/* @ts-ignore */}
                <SpkSelect option={ListingOpts}
                           onChange={(o:any)=>setListingType(o.value)}/>
              </Col>

              <Col xl={6}><Form.Label>Furnishing *</Form.Label>
                {/* @ts-ignore */}
                <SpkSelect option={FurnishedOpts}
                           onChange={(o:any)=>setFurn(o.value)}/>
              </Col>

              <Col xl={6}><Form.Label>
                {listingType==='sale' ? 'Selling Price *' : 'Monthly Rent *'} (BHD)
              </Form.Label>
                <Form.Control type="number" min={0} value={price}
                              onChange={e => setPrice(e.target.value ? +e.target.value : '')}/>
              </Col>

              <Col xl={6}><Form.Label>Plot Size (m²) *</Form.Label>
                <Form.Control type="number" min={0} value={plot}
                              onChange={e => setPlot(e.target.value ? +e.target.value : '')}/>
              </Col>

              <Col xl={6}><Form.Label>Built-up Size (m²)</Form.Label>
                <Form.Control type="number" min={0} value={built}
                              onChange={e => setBuilt(e.target.value ? +e.target.value : '')}/>
              </Col>

              <Col xl={6}><Form.Label>Floors</Form.Label>
                {/* @ts-ignore */}
                <SpkSelect option={FloorOpts} onChange={(o:any)=>setFloors(+o.value)}/>
              </Col>

              <Col xl={6}><Form.Label>Parking Spots *</Form.Label>
                <Form.Control type="number" min={0} value={parking}
                              onChange={e => setParking(e.target.value ? +e.target.value : '')}/>
              </Col>

              <Col xl={6}><Form.Label>Block No. *</Form.Label>
                <Form.Control value={block}
                              onChange={e => setBlock(e.target.value)}/>
              </Col>

              <Col xl={6}><Form.Label>Area *</Form.Label>
                <Form.Control value={area}
                              onChange={e => setArea(e.target.value)}/>
              </Col>

              <Col xl={12}><Form.Label>Description *</Form.Label>
                <Form.Control as="textarea" rows={4} value={desc}
                              onChange={e => setDesc(e.target.value)}/>
              </Col>

              {/* images */}
              <Col xl={12}><Form.Label>Images (max 10)</Form.Label>
                <Form.Control type="file" accept="image/*" multiple onChange={onFileChange}/>
                {!!images.length && (
                  <Row className="g-2 mt-2">
                    {images.map((f,i)=>(
                      <Col key={i} xs={4} sm={3} md={2}>
                        <div className="border rounded p-1 text-center">
                          <img src={URL.createObjectURL(f)}
                               className="img-fluid rounded mb-1"
                               style={{objectFit:'cover',height:70,width:'100%'}}/>
                          <BsBtn variant="link" size="sm" className="text-danger p-0"
                                 onClick={() => removeImg(i)}>×</BsBtn>
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
              </Col>
            </Row></Col>

            <Col xxl={6} lg={12}><Row className="gy-3">

              <Col xl={12}><Form.Label>Amenities</Form.Label>
                {loadAms
                  ? <Spinner animation="border" size="sm"/>
                  : /* @ts-ignore */
                    <SpkSelect multi option={amenOpts}
                               onChange={(v:any)=>setAmenSel(v.map((x:any)=>x.value))}/>}
              </Col>

              <Col xl={12}><Form.Label className="mb-2 fw-semibold">Location Method *</Form.Label>
                <div className="mode-toggle mb-3 mx-auto">
                  <button type="button"
                          className={`toggle-item ${locMode==='parcel' ? 'active' : ''}`}
                          onClick={() => { setLocMode('parcel'); setMarker(null); }}>
                    Parcel #
                  </button>
                  <button type="button"
                          className={`toggle-item ${locMode==='map' ? 'active' : ''}`}
                          onClick={() => { setLocMode('map'); setParcel(''); }}>
                    Map Pin
                  </button>
                  <span className="toggle-highlight"
                        style={{ transform: locMode==='parcel'
                                          ? 'translateX(0)'
                                          : 'translateX(100%)' }}/>
                </div>
              </Col>

              {locMode === 'parcel' && (
                <Col xl={12}>
                  <Form.Label>Parcel Number *</Form.Label>
                  <Form.Control value={parcel}
                                placeholder="e.g. 04050158"
                                onChange={e => setParcel(e.target.value)}/>
                </Col>
              )}

              {locMode === 'map' && (
                <Col xl={12}>
                  {!TOKEN ? (
                    <Alert variant="warning">Mapbox token missing.</Alert>
                  ) : (
                    <div style={{ height: 250 }}>
                      {/* @ts-ignore */}
                      <Map mapboxAccessToken={TOKEN}
                           initialViewState={{ latitude:26.0667, longitude:50.5577, zoom:10 }}
                           mapStyle="mapbox://styles/mapbox/streets-v11"
                           onClick={onMapClick}
                           style={{ borderRadius:'0.5rem' }}>
                        {marker && (
                          <Marker longitude={marker.lon} latitude={marker.lat}
                                  draggable onDragEnd={onMapClick}>
                            <div style={{ fontSize: 18, color:'tomato' }}>📍</div>
                          </Marker>
                        )}
                      </Map>
                    </div>
                  )}
                  {mapErr && <small className="text-danger">{mapErr}</small>}
                </Col>
              )}

            </Row></Col>

          </Row></Card.Body>

          <div className="card-footer d-flex justify-content-end border-top">
            <SpkButton Buttonvariant="primary1" onClickfunc={saveProperty}>
              {saving
                ? <Spinner animation="border" size="sm" className="me-2"/>
                : 'Add House'}
            </SpkButton>
          </div>
        </Card>
      </Col></Row>

      <style jsx global>{`
        /* react-select dark/light fix (background transparent) */
        .react-select__control{background:transparent!important;}
        .react-select__menu{background:var(--bs-body-bg)!important;}
        .react-select__single-value,
        .react-select__multi-value__label{
          color:var(--bs-body-color)!important;
        }

        /* mode toggle */
        .mode-toggle{
          position:relative;
          display:flex;
          width:220px;             /* slightly wider */
          height:32px;
          background:var(--bs-secondary-bg);
          border-radius:999px;
          overflow:hidden;
        }
        .mode-toggle .toggle-item{
          flex:1 1 50%;
          border:none;
          background:transparent;
          font-size:.8rem;
          font-weight:600;
          z-index:1;
          transition:color .25s;
        }
        .mode-toggle .toggle-item.active{color:#fff;}
        .mode-toggle .toggle-highlight{
          position:absolute;
          inset:0;
          width:50%;height:100%;
          background:var(--bs-primary);
          border-radius:999px;
          z-index:0;
          transition:transform .3s ease;
        }
      `}</style>
    </Fragment>
  );
};

AddHouseProperty.layout = 'ContentLayout';
export default AddHouseProperty;
