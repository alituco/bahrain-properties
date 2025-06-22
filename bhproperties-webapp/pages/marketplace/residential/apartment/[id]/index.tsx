'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container, Row, Col, Card,
  Carousel, Badge
} from 'react-bootstrap';
import Image from 'next/image';
import Seo        from '@/shared/layouts-components/seo/seo';
import MapDisplay from '@/components/marketplace/land/MapDisplay';

const API = process.env.NEXT_PUBLIC_API_URL!;

const Pill: React.FC<{ txt:string; variant?:string }> = (
  { txt, variant = 'light' },
) => <Badge bg={variant} className="fs-6 px-3 py-2 rounded-pill">{txt}</Badge>;

type Apt = {
  id:number;
  title:string|null;
  description:string|null;
  listing_type:'sale'|'rent';
  asking_price:string|null;
  rent_price :string|null;
  status:string;
  bedrooms:number;
  bathrooms:number;
  size_m2?:number|null;
  floor?:number|null;
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

export default function ApartmentDetailPage() {
  const { query } = useRouter();
  const id = query.id as string | undefined;

  const [apt , setApt ] = useState<Apt|null>(null);
  const [busy, setBusy] = useState(true);
  const [err , setErr ] = useState<string|null>(null);

  useEffect(() => { if (!id) return;
    (async () => {
      try {
        const r = await fetch(`${API}/marketplace/apartments/${id}`);
        if (!r.ok) throw new Error('Listing not found');
        const { apartment } = await r.json();
        setApt(apartment);
      } catch (e:any) { setErr(e.message); }
      finally { setBusy(false); }
    })();
  }, [id]);

  if (busy)
    return <div className="vh-100 d-flex justify-content-center align-items-center">
        <Image
            src="/assets/images/media/loader.svg"
            width={64}
            height={64}
            alt="Loading…"
            priority
          />
    </div>;
  if (err)    return <p className="text-danger text-center my-5">{err}</p>;
  if (!apt)   return null;

  if (apt.status !== 'available')
    return (
      <>
        <Seo title="Listing unavailable" />
        <div className="vh-100 d-flex flex-column justify-content-center
                        align-items-center text-center px-3">
          <h1 className="fw-semibold mb-3">This apartment is no longer available</h1>
          <p className="text-muted fs-5">The owner removed or reserved the listing.</p>
        </div>
      </>
    );

  const images    = Array.isArray(apt.images) ? apt.images : [];
  const priceStr  = apt.listing_type === 'sale'
      ? `${(+apt.asking_price!).toLocaleString()} BHD`
      : `${(+apt.rent_price!).toLocaleString()} BHD / mo`;

  const subtitle  = [
    apt.area_name ?? '—',
    apt.block_no  && `Block ${apt.block_no}`,
    apt.floor     && `Floor ${apt.floor}`,
  ].filter(Boolean).join(' • ');

  return (
    <>
      <Seo title={apt.title ?? 'Apartment'} />

      {/* ───── Hero (photos + quick pills) ─────────────────────── */}
      <Container fluid className="pt-5 px-0 d-flex justify-content-center">
        <Card
          className="shadow-sm overflow-hidden"
          style={{
            width      : 'min(96%, 1200px)',   
            borderRadius: '1rem',
            marginTop  : '7rem',
          }}
        >
          {/* photos ------------------------------------------------ */}
          {images.length ? (
            <Carousel controls={images.length > 1} indicators={false} interval={null}>
              {images.map((u, i) => (
                <Carousel.Item key={i}>
                  <div className="ratio ratio-16x9">
                    <img src={u} alt={`photo ${i + 1}`}
                         className="d-block w-100 h-100 object-fit-cover" />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <div className="ratio ratio-16x9 bg-light d-flex
                            justify-content-center align-items-center
                            text-muted fw-medium">
              No&nbsp;Photo
            </div>
          )}

          {/* quick spec row -------------------------------------- */}
          <Card.Body className="d-flex flex-wrap gap-3 border-top pt-3 justify-content-between">
            <div className="d-flex gap-3">
                <Pill txt={priceStr}           variant="primary" />
                {apt.size_m2 && <Pill txt={`${apt.size_m2} m²`} variant="primary" />}
            </div>
            <div className="d-flex gap-3">
                <Pill txt={`${apt.bedrooms} bd`} variant='secondary'/>
                <Pill txt={`${apt.bathrooms} ba`} variant='secondary' />
            </div>
          </Card.Body>
        </Card>
      </Container>

      <Container fluid style={{ maxWidth:'1480px' }} className="my-5 px-3 px-md-4 px-lg-5">
        <Row className="g-4">

          <Col lg={8}>
            <h2 className="fw-semibold mb-3">{apt.title || 'Untitled Apartment'}</h2>

            <p className="text-muted fs-5 mb-0">
              <i className="ti ti-map-pin me-1" /> {subtitle}
            </p>

            <hr className="my-4 border-secondary-subtle" />

            <p className="fs-5 mb-0" style={{ whiteSpace:'pre-line' }}>
              {apt.description?.trim() || 'No description provided.'}
            </p>

            <hr className="my-4 border-secondary-subtle" />

            {apt.amenities?.length ? (
              <>
                <h5 className="fw-semibold mb-3">Amenities</h5>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {apt.amenities.map((am, i) => (
                    <Badge key={i} bg="info" className="px-3 py-2 text-capitalize">
                      {am.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>

                <hr className="my-4 border-secondary-subtle" />
              </>
            ) : null}

            <h5 className="fw-semibold mb-3">Key&nbsp;Specs</h5>
            <ul className="list-unstyled lh-lg fs-6 mb-0">
              <li><b>Price&nbsp;:</b> {priceStr}</li>
              <li><b>Bedrooms :</b> {apt.bedrooms}</li>
              <li><b>Bathrooms:</b> {apt.bathrooms}</li>
              {apt.size_m2 && <li><b>Area&nbsp;:</b> {apt.size_m2}&nbsp;m²</li>}
              {apt.block_no && <li><b>Block&nbsp;:</b> {apt.block_no}</li>}
            </ul>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="fw-semibold mb-3">Contact</h5>

                {apt.realtor_name && (
                  <p className="mb-2">
                    <i className="ti ti-user me-2" /> {apt.realtor_name}
                  </p>
                )}

                {apt.phone_number && (
                  <p className="mb-2">
                    <i className="ti ti-phone me-2" />
                    <a href={`tel:${apt.phone_number}`} className="text-decoration-none">
                      {apt.phone_number}
                    </a>
                  </p>
                )}

                {apt.email && (
                  <p className="mb-0">
                    <i className="ti ti-mail me-2" />
                    <a href={`mailto:${apt.email}`} className="text-decoration-none">
                      {apt.email}
                    </a>
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {apt.latitude && apt.longitude && (
          <>
            <h4 className="fw-semibold mt-5 mb-3">Location</h4>
            <MapDisplay
              center={[apt.longitude, apt.latitude]}
              parcelFeature={null}   
              showMarker
              heightPx={500}
            />
          </>
        )}
      </Container>
    </>
  );
}

ApartmentDetailPage.layout = 'BlankLayout';