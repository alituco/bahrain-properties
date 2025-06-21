/* ------------------------------------------------------------------
   Firm-owned Residential Listings – read-only list
   – no filters, no deletes
-------------------------------------------------------------------*/
'use client';

import React, { Fragment, useEffect, useState } from 'react';
import dynamic  from 'next/dynamic';
import {
  Card, Col, Row, Spinner
} from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link      from 'next/link';
import Image     from 'next/image';
import Seo       from '@/shared/layouts-components/seo/seo';
import SpkBreadcrumb from '@/shared/@spk-reusable-components/reusable-uielements/spk-breadcrumb';
import SpkTablescomponent from '@/shared/@spk-reusable-components/reusable-tables/tables-component';
import SpkAlert  from '@/shared/@spk-reusable-components/reusable-uielements/spk-alert';

const MapContainer = dynamic(() => import('@/components/map/MapContainer'), { ssr:false });

/* ────────────── types ────────────────────────────────────────── */
interface ResidentialProperty {
  id: number;
  title: string;
  area_namee: string | null;
  block_no: string | null;
  status: string;
  asking_price: number | null;
  rent_price:   number | null;
  bedrooms: number;
  bathrooms: number;
  listing_type: 'sale' | 'rent';
  updated_at: string;
  longitude: number | null;
  latitude: number | null;
}

interface UserProfile { role:string; }

/* ────────────── page component ──────────────────────────────── */
export default function FirmResidentialPage() {
  const API = process.env.NEXT_PUBLIC_API_URL!;
  const router = useRouter();

  const [rows ,setRows ] = useState<ResidentialProperty[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<string|null>(null);
  const [flyTo,setFlyTo]   = useState<{lat:number;lon:number}|null>(null);

  /* ── auth check ────────────────────────────────────────────── */
  useEffect(()=>{ (async()=>{
      try{
        const res = await fetch(`${API}/user/me`,{credentials:'include'});
        if(!res.ok) throw new Error();
        /* if we reach here user is logged-in */
      }catch{ router.replace('/'); }
  })();},[API,router]);

  /* ── load residential rows ────────────────────────────────── */
  useEffect(()=>{ (async()=>{
      try{
        const res = await fetch(`${API}/residential`,{credentials:'include'});
        if(!res.ok) throw new Error('Fetch failed');
        const { firmProperties } = await res.json();
        setRows(Array.isArray(firmProperties) ? firmProperties : []);
      }catch(e:any){ setError(e.message); }
      finally{ setLoading(false); }
  })();},[API]);

  /* ── loading spinner ───────────────────────────────────────── */
  if(loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Image src="/assets/images/media/loader.svg" width={64} height={64} alt="Loading" priority/>
    </div>
  );

  /* ── render ────────────────────────────────────────────────── */
  return (
    <Fragment>
      <Seo title="Residential Properties"/>

      <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
        <div>
          <SpkBreadcrumb Customclass="mb-1">
            <li className="breadcrumb-item"><Link href="#!">Dashboards</Link></li>
            <li className="breadcrumb-item active">Residential</li>
          </SpkBreadcrumb>
          <h1 className="page-title fw-medium fs-18 mb-0">Residential Properties</h1>
        </div>
      </div>

      {error && (
        <SpkAlert variant="danger" CustomClass="mb-3" dismissible show onClose={()=>setError(null)}>
          {error}
        </SpkAlert>
      )}

      {/* ---------- LIST ---------- */}
      <Row><Col xl={12}>
        <Card className="custom-card">
          <Card.Header><div className="card-title">List</div></Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <SpkTablescomponent
                tableClass="text-nowrap table-bordered"
                showCheckbox={false}
                header={[
                  {title:'ID'},{title:'Title'},
                  {title:'Beds'},{title:'Baths'},
                  {title:'Area'},
                  {title:'Status'},{title:'Price'},{title:'Updated'},{title:'Map'}
                ]}
              >
                {rows.map(row=>(
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td className="text-truncate" style={{maxWidth:160}}>{row.title||'—'}</td>
                    <td>{row.bedrooms}</td><td>{row.bathrooms}</td>
                    <td>{row.area_namee ?? '—'}</td>
                    <td><span className="badge bg-primary-transparent">{row.status}</span></td>
                    <td>{
                      row.listing_type==='rent'
                        ? (row.rent_price??0).toLocaleString()+' BHD/mo'
                        : (row.asking_price??0).toLocaleString()+' BHD'
                    }</td>
                    <td>{new Date(row.updated_at).toLocaleDateString()}</td>
                    <td>
                      {row.latitude && row.longitude ? (
                        <button className="btn btn-sm btn-outline-primary"
                                onClick={()=>setFlyTo({lat:+row.latitude!,lon:+row.longitude!})}>
                          <i className="ri-focus-3-line"/>
                        </button>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </SpkTablescomponent>
            </div>
          </Card.Body>
        </Card>
      </Col></Row>

      {/* ---------- MAP ---------- */}
      {flyTo && (
        <Row className="mt-4"><Col xl={12}>
          <Card className="custom-card">
            <Card.Header><div className="card-title">Map</div></Card.Header>
            <Card.Body>
              <MapContainer filters={{}} flyTo={flyTo} savedOnly/>
            </Card.Body>
          </Card>
        </Col></Row>
      )}
    </Fragment>
  );
}

FirmResidentialPage.layout = 'ContentLayout';
