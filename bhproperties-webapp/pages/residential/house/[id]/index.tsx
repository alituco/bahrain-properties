/* ------------------------------------------------------------------
   Marketplace ▸ House detail  (public view)
-------------------------------------------------------------------*/
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter }   from 'next/router';
import Image           from 'next/image';
import {
  Container, Row, Col, Card,
  Carousel, Badge, Spinner
} from 'react-bootstrap';

import Seo        from '@/shared/layouts-components/seo/seo';
import MapDisplay from '@/components/marketplace/land/MapDisplay';   // marker-only

const API = process.env.NEXT_PUBLIC_API_URL!;

/* ---------- tiny helper ---------------------------------------- */
const Pill:React.FC<{ txt:string; variant?:string }> = (
  { txt, variant='light' },
) => <Badge bg={variant} className="fs-6 px-3 py-2 rounded-pill">{txt}</Badge>;

/* ---------- API shape ------------------------------------------ */
type House = {
  id:number;
  title:string|null;
  description:string|null;

  listing_type:'sale'|'rent';
  asking_price:number|null;
  rent_price :number|null;
  status:string;

  bedrooms:number;
  bathrooms:number;
  floors?:number|null;
  plot_size_m2?:number|null;
  built_up_m2?:number|null;
  parking_spots?:number;

  area_name?:string|null;
  block_no?:string|null;

  latitude?:number|null;
  longitude?:number|null;

  images?:string[];
  amenities?:string[];

  realtor_name?:string|null;
  phone_number?:string|null;
  email?:string|null;
};

/* ================================================================= */
const HouseDetailPage = () => {
  const { query } = useRouter();
  const id = query.id as string | undefined;

  const [house , setHouse ] = useState<House|null>(null);
  const [busy  , setBusy  ] = useState(true);
  const [err   , setErr   ] = useState<string|null>(null);

  /* fetch -------------------------------------------------------- */
  useEffect(() => { if (!id) return;
    (async () => {
      try {
        const r = await fetch(`${API}/marketplace/residential/${id}`);
        if (!r.ok) throw new Error('Listing not found');
        const { listing } = await r.json();
        setHouse(listing);
      } catch (e:any) { setErr(e.message); }
      finally { setBusy(false); }
    })();
  }, [id]);

  /* ---------- loading | error ---------------------------------- */
  if (busy) return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <Spinner animation="border"/>
    </div>
  );
  if (err)   return <p className="text-danger text-center my-5">{err}</p>;
  if (!house) return null;

  /* ---------- off-market guard --------------------------------- */
  if (house.status !== 'available')
    return (
      <>
        <Seo title="Listing unavailable"/>
        <div className="vh-100 d-flex flex-column justify-content-center
                        align-items-center text-center px-3">
          <h1 className="fw-semibold mb-3">This house is no longer available</h1>
          <p className="text-muted fs-5">The owner removed or reserved the listing.</p>
        </div>
      </>
    );

  /* ---------- derived values ----------------------------------- */
  const imgs      = Array.isArray(house.images) ? house.images : [];
  const priceStr  =
    house.listing_type === 'sale'
      ? `${(+house.asking_price!).toLocaleString()} BHD`
      : `${(+house.rent_price!).toLocaleString()} BHD / mo`;

  const subtitle = [
    house.area_name ?? '—',
    house.block_no  && `Block ${house.block_no}`,
  ].filter(Boolean).join(' • ');

  /* ---------- render ------------------------------------------- */
  return (
    <>
      <Seo title={house.title ?? 'House'} />

      {/* ───── Hero (photos + quick pills) ─────────────────────── */}
      <Container fluid className="pt-5 px-0 d-flex justify-content-center ">
        <Card className="shadow-sm overflow-hidden"
              style={{ width:'min(92%, 1000px)', borderRadius:'1rem', marginTop:'1rem' }}>

          {/* photos ------------------------------------------------ */}
          {imgs.length ? (
            <Carousel controls={imgs.length>1} indicators={false} interval={null} >
              {imgs.map((u,i)=>(
              <Carousel.Item key={i}>
                <div className="ratio ratio-16x9">
                  <img
                    src={u}
                    alt={`photo ${i + 1}`}
                    className="img-fluid w-100 h-100 object-fit-cover"
                  />
                </div>
              </Carousel.Item>

              ))}
            </Carousel>
          ) : (
            <div className="ratio ratio-16x9 bg-light d-flex
                            justify-content-center align-items-center
                            text-muted fw-medium">
              No Photo
            </div>
          )}

          {/* quick spec row --------------------------------------- */}
          <Card.Body className="d-flex flex-wrap gap-3 border-top pt-3">
            <Pill txt={priceStr} variant="warning"/>
            {house.plot_size_m2  && <Pill txt={`${house.plot_size_m2} m² plot`} variant="secondary"/>}
            {house.built_up_m2   && <Pill txt={`${house.built_up_m2} m² built`} variant="secondary"/>}
            <Pill txt={`${house.bedrooms} bd`}/>
            <Pill txt={`${house.bathrooms} ba`}/>
          </Card.Body>
        </Card>
      </Container>

      {/* ───── Main content ─────────────────────────────────────── */}
      <Container className="my-5 px-3 px-md-4 px-lg-5">
        <Row className="g-4">

          {/* ---------- LEFT column -------------------------------- */}
          <Col lg={8}>
            <h2 className="fw-semibold mb-3">{house.title || 'Untitled House'}</h2>

            <p className="text-muted mb-2 fs-5">
              <i className="ti ti-map-pin me-1"/>{subtitle}
            </p>

            {/* DESCRIPTION */}
            <p className="fs-5" style={{whiteSpace:'pre-line'}}>
              {house.description?.trim() || 'No description provided.'}
            </p>

            <hr className="my-4"/>

            {/* AMENITIES */}
            {house.amenities?.length ? (
              <>
                <h5 className="fw-semibold mb-3">Amenities</h5>
                <div className="d-flex flex-wrap gap-2">
                  {house.amenities.map((am,i)=>(
                    <Badge key={i} bg="info" className="px-3 py-2 text-capitalize">
                      {am.replace(/_/g,' ')}
                    </Badge>
                  ))}
                </div>
                <hr className="my-4"/>
              </>
            ):null}

            {/* SPECS */}
            <h5 className="fw-semibold mb-3">Key Specs</h5>
            <ul className="list-unstyled lh-lg mb-0 fs-6">
              <li><b>Bedrooms:</b> {house.bedrooms}</li>
              <li><b>Bathrooms:</b> {house.bathrooms}</li>
              {house.floors        && <li><b>Floors:</b> {house.floors}</li>}
              {house.plot_size_m2  && <li><b>Plot size:</b> {house.plot_size_m2} m²</li>}
              {house.built_up_m2   && <li><b>Built-up:</b> {house.built_up_m2} m²</li>}
              {house.parking_spots && <li><b>Parking:</b> {house.parking_spots}</li>}
              {house.block_no      && <li><b>Block:</b> {house.block_no}</li>}
            </ul>
          </Col>

          {/* ---------- RIGHT column (contact) -------------------- */}
          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="fw-semibold mb-3">Contact</h5>

                {house.realtor_name && (
                  <p className="mb-2"><i className="ti ti-user me-2"/>{house.realtor_name}</p>
                )}
                {house.phone_number && (
                  <p className="mb-2">
                    <i className="ti ti-phone me-2"/>
                    <a href={`tel:${house.phone_number}`} className="text-decoration-none">
                      {house.phone_number}
                    </a>
                  </p>
                )}
                {house.email && (
                  <p className="mb-0">
                    <i className="ti ti-mail me-2"/>
                    <a href={`mailto:${house.email}`} className="text-decoration-none">
                      {house.email}
                    </a>
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* location map (marker only) ----------------------------- */}
        {house.latitude && house.longitude && (
          <>
            <h4 className="fw-semibold mt-5 mb-3">Location</h4>
            <MapDisplay
              center={[house.longitude, house.latitude]}
              parcelFeature={null}
              showMarker
              heightPx={500}
            />
          </>
        )}
      </Container>
    </>
  );
};

HouseDetailPage.layout = 'BlankLayout';
export default HouseDetailPage;
