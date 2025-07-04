'use client';

import React,{Fragment,useEffect,useState} from 'react';
import dynamic from 'next/dynamic';
import { Card,Col,Row } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link  from 'next/link';
import Image from 'next/image';
import Seo   from '@/shared/layouts-components/seo/seo';
import SpkBreadcrumb from '@/shared/@spk-reusable-components/reusable-uielements/spk-breadcrumb';
import SpkTables from '@/shared/@spk-reusable-components/reusable-tables/tables-component';
import SpkAlert  from '@/shared/@spk-reusable-components/reusable-uielements/spk-alert';

const MapContainer = dynamic(()=>import('@/components/map/MapContainer'),{ssr:false});

interface Apartment {
  id:number;
  title:string|null;
  bedrooms:number; bathrooms:number;
  area_namee:string|null; status:string;
  asking_price:number|null; rent_price:number|null;
  listing_type:'sale'|'rent';
  latitude:number|null; longitude:number|null;
  updated_at:string;
}

export default function FirmApartmentsPage(){
  const API = process.env.NEXT_PUBLIC_API_URL!;
  const router = useRouter();

  const [rows,setRows]=useState<Apartment[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);
  const [flyTo,setFlyTo]=useState<{lat:number;lon:number}|null>(null);

  /* auth check */
  useEffect(()=>{(async()=>{
    const r=await fetch(`${API}/user/me`,{credentials:'include'});
    if(!r.ok){ router.replace('/'); return; }
  })();},[API,router]);

  /* load */
  useEffect(()=>{(async()=>{
    try{
      const r=await fetch(`${API}/apartment`,
        {credentials:'include'}
      );
      if(!r.ok) throw new Error(await r.text());
      const { firmProperties } = await r.json();
      setRows(Array.isArray(firmProperties)?firmProperties:[]);
    }catch(e:any){ setError(e.message); }
    finally{ setLoading(false); }
  })();},[API]);

  if(loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Image src="/assets/images/media/loader.svg" width={64} height={64} alt="Loading" priority/>
    </div>
  );

  return (
    <Fragment>
      <Seo title="Firm Apartments"/>
      <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
        <div>
          <SpkBreadcrumb Customclass="mb-1">
            <li className="breadcrumb-item"><Link href="#!">Dashboards</Link></li>
            <li className="breadcrumb-item active">Apartments</li>
          </SpkBreadcrumb>
          <h1 className="page-title fw-medium fs-18 mb-0">Apartments</h1>
        </div>
      </div>

      {error && <SpkAlert variant="danger" CustomClass="mb-3" show>{error}</SpkAlert>}

      <Row><Col xl={12}>
        <Card className="custom-card">
          <Card.Header><div className="card-title">List</div></Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <SpkTables tableClass="text-nowrap table-bordered" showCheckbox={false}
                header={[
                  {title:'ID'},{title:'Title'},{title:'Beds'},{title:'Baths'},
                  {title:'Area'},{title:'Status'},{title:'Price'},{title:'Updated'},{title:'Map'}
                ]}>
                {rows.map(r=>(
                  <tr key={r.id}>
                    <td>
                      <Link href={`/dashboard/apartment/${r.id}`} className="text-blue">
                        {r.id}
                      </Link>
                    </td>
                    <td className="text-truncate" style={{maxWidth:160}}>{r.title||'—'}</td>
                    <td>{r.bedrooms}</td><td>{r.bathrooms}</td>
                    <td>{r.area_namee??'—'}</td>
                    <td><span className="badge bg-primary-transparent">{r.status}</span></td>
                    <td>{
                      r.listing_type==='rent'
                        ? (r.rent_price??0).toLocaleString()+' BHD/mo'
                        : (r.asking_price??0).toLocaleString()+' BHD'
                    }</td>
                    <td>{new Date(r.updated_at).toLocaleDateString()}</td>
                    <td>{
                      r.latitude&&r.longitude
                        ? <button className="btn btn-sm btn-outline-primary"
                                  onClick={()=>setFlyTo({lat:+r.latitude!,lon:+r.longitude!})}>
                            <i className="ri-focus-3-line"/>
                          </button>
                        : '—'
                    }</td>
                  </tr>
                ))}
              </SpkTables>
            </div>
          </Card.Body>
        </Card>
      </Col></Row>

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

FirmApartmentsPage.layout = 'ContentLayout';
