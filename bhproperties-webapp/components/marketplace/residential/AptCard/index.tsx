'use client';

import React from 'react';
import { Card, Carousel } from 'react-bootstrap';
import Link from 'next/link';

export type AptOptions = { bedrooms: string[]; bathrooms: string[]; areas: string[] };
export interface Apartment {
  id           : number;
  title        : string | null;
  listing_type : 'sale' | 'rent';
  asking_price : number | null;
  rent_price   : number | null;
  bedrooms     : number;
  bathrooms    : number;
  area_name    : string | null;
  images       : string[];          

  phone_number ?: string | null;
  email        ?: string | null;
  realtor_name ?: string | null;
  block_no     ?: string | null;
  size_m2      ?: number | null;
  latitude     ?: number;
  longitude    ?: number;
  status       ?: string;          
  description  ?: string;
}

const AptCard:React.FC<{ apartment:Apartment }> = ({ apartment:a })=>{
  const price =
    a.listing_type==='sale'
      ? `${(a.asking_price??0).toLocaleString()} BHD`
      : `${(a.rent_price??0).toLocaleString()} BHD/mo`;

  const href = `/marketplace/residential/${a.id}`;

  const renderMedia = ()=> a.images.length ? (
    <Carousel indicators={false} controls={a.images.length>1} interval={null} className="apt-carousel">
      {a.images.map((url,i)=>(
        <Carousel.Item key={i} className="w-100 h-100">
          <img src={url} alt={`Photo ${i+1}`} className="d-block w-100 h-100 object-fit-cover rounded-top"/>
        </Carousel.Item>
      ))}
    </Carousel>
  ) : (
    <div className="bg-light d-flex justify-content-center align-items-center
                    text-muted fw-medium rounded-top" style={{minHeight:180}}>
      No&nbsp;Photo
    </div>
  );

  return (
    <Link href={href} className="text-reset text-decoration-none">
      <Card className="h-100 shadow-sm">
        <div className="ratio ratio-16x9 overflow-hidden position-relative">
          {renderMedia()}
        </div>

        <span className="apt-price badge bg-warning text-dark">{price}</span>

        <Card.Body className="pt-3">
          <h6 className="fw-semibold mb-1">{a.title?.trim() || 'Untitled Apartment'}</h6>
          <p  className="text-muted mb-2 fs-14"><i className="ti ti-map-pin me-1"/>{a.area_name || '—'}</p>
          <p  className="mb-0 text-muted fs-14">{a.bedrooms} bd • {a.bathrooms} ba</p>
        </Card.Body>
      </Card>

      <style jsx>{`
        .apt-price{position:absolute;top:.5rem;left:.5rem;z-index:3;
                   opacity:.92;border-radius:.5rem;padding:.35rem .55rem;
                   font-size:.75rem;line-height:1;}
        .apt-carousel .carousel-control-prev,
        .apt-carousel .carousel-control-next{width:2.25rem;}
        .apt-carousel .carousel-control-prev-icon,
        .apt-carousel .carousel-control-next-icon{
          background-color:rgba(0,0,0,.45);border-radius:50%;
          background-size:60% 60%;padding:.5rem;}
      `}</style>
    </Link>
  );
};
export default AptCard;
