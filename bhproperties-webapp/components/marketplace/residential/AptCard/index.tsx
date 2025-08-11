'use client';

import React from 'react';
import { Card, Carousel } from 'react-bootstrap';
import Link from 'next/link';
import type { Apartment } from '../types';

const AptCard: React.FC<{ apartment: Apartment }> = ({ apartment: a }) => {
  const price =
    a.listing_type === 'sale'
      ? `${(a.asking_price ?? 0).toLocaleString()} BHD`
      : `${(a.rent_price ?? 0).toLocaleString()} BHD/mo`;

  const href = `/residential/apartment/${a.id}`;

  const media = a.images.length ? (
    <Carousel
      indicators={false}
      controls={a.images.length > 1}
      interval={null}
      className="apt-carousel"
    >
      {a.images.map((url, i) => (
        <Carousel.Item key={i} className="w-100 h-100">
          <img
            src={url}
            alt={`Photo ${i + 1}`}
            className="d-block w-100 h-100 object-fit-cover rounded-top"
          />
        </Carousel.Item>
      ))}
    </Carousel>
  ) : (
    <div
      className="bg-light d-flex justify-content-center align-items-center
                 text-muted fw-medium rounded-top"
      style={{ minHeight: 180 }}
    >
      No&nbsp;Photo
    </div>
  );

  return (
    <Link href={href} className="text-reset text-decoration-none">
      <Card className="h-100 shadow-sm">
        <div className="ratio ratio-16x9 overflow-hidden position-relative">{media}</div>
        <span className="apt-price badge bg-warning text-dark">{price}</span>

        <Card.Body className="pt-3">
          <h6 className="fw-semibold mb-1">
            {a.title?.trim() || 'Untitled Apartment'}
          </h6>
          <p className="text-muted mb-2 fs-14">
            <i className="ti ti-map-pin me-1" />
            {a.area_name || '—'}
          </p>
          <p className="mb-0 text-muted fs-14">
            {a.bedrooms} bd • {a.bathrooms} ba
          </p>
        </Card.Body>
      </Card>

      <style jsx>{`
        .apt-price {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          z-index: 3;
          opacity: 0.92;
          border-radius: 0.5rem;
          padding: 0.35rem 0.55rem;
          font-size: 0.75rem;
          line-height: 1;
        }
        .apt-carousel .carousel-control-prev,
        .apt-carousel .carousel-control-next {
          width: 2.25rem;
        }
        .apt-carousel .carousel-control-prev-icon,
        .apt-carousel .carousel-control-next-icon {
          background-color: rgba(0, 0, 0, 0.45);
          border-radius: 50%;
          background-size: 60% 60%;
          padding: 0.5rem;
        }
      `}</style>
    </Link>
  );
};

export default AptCard;
