/* ------------------------------------------------------------------
   Add Residential Property (firm dashboard) — v 2
   • redirects to “/” if not logged-in
   • sends firm_id & user_id in the POST body (server will ignore them
     if it already pulls those values from the cookie/session)
-------------------------------------------------------------------*/
'use client';

import React, {
  Fragment,
  useState,
  useEffect,
  ChangeEvent,
} from 'react';
import { useRouter } from 'next/router';
import dynamic       from 'next/dynamic';
import {
  Row, Col, Card, Form, Spinner,
  Alert, Button as BsBtn
} from 'react-bootstrap';
import SpkButton  from '@/shared/@spk-reusable-components/reusable-uielements/spk-button';
import Seo        from '@/shared/layouts-components/seo/seo';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import { PageWithLayout } from '@/types/PageWithLayout';

import Image      from 'next/image';

/* ──────────── lazy plug-ins ───────────────────────────────────── */
const SpkSelect = dynamic(
  () => import('@/shared/@spk-reusable-components/reusable-plugins/spk-reactselect').then(m=>m.default),
  { ssr:false }
);
const Map = dynamic(() => import('react-map-gl/mapbox'), { ssr:false });
const Marker = dynamic(() => import('react-map-gl/mapbox').then(m=>({ default:m.Marker })), { ssr:false });

import 'mapbox-gl/dist/mapbox-gl.css';

/* ──────────── helpers ─────────────────────────────────────────── */
const seq = (n:number)=>Array.from({length:n},(_,i)=>({value:i+1,label:`${i+1}`}));
const BedroomOpts   = [...seq(10),{value:11,label:'10+'}];
const BathroomOpts  = [...seq(10),{value:11,label:'10+'}];
const FurnishedOpts = [{value:true,label:'Furnished'},{value:false,label:'Un-furnished'}];
const ListingOpts   = [{value:'sale',label:'For Sale'},{value:'rent',label:'For Rent'}];

/* ──────────── main component ─────────────────────────────────── */
interface UserProfile { user_id:number; firm_id:number; role:string; }

const AddResidentialProperty: PageWithLayout = () => {
  const router = useRouter();
  const API   = process.env.NEXT_PUBLIC_API_URL!;
  const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

  /* auth / profile ------------------------------------------------ */
  const [user,setUser] = useState<UserProfile|null>(null);
  const [checking,setChecking] = useState(true);

  useEffect(()=>{ (async()=>{
      try{
        const res = await fetch(`${API}/user/me`,{credentials:'include'});
        if(!res.ok) throw new Error();
        const { user } = await res.json();
        setUser(user);
      }catch{ router.replace('/'); }
      finally { setChecking(false); }
  })();},[API,router]);

  /* form state ---------------------------------------------------- */
  const [title , setTitle ] = useState('');
  const [listingType,setListingType]=useState<'sale'|'rent'>('sale');
  const [price , setPrice ] = useState<number>(0);
  const [size  , setSize  ] = useState<number>(0);
  const [beds  , setBeds  ] = useState<number>();
  const [baths , setBaths ] = useState<number>();
  const [furn  , setFurn  ] = useState<boolean>();
  const [desc  , setDesc  ] = useState('');
  const [block , setBlock ] = useState('');
  const [area  , setArea  ] = useState('');
  const [amenSel,setAmenSel]=useState<string[]>([]);
  const [images ,setImages ]=useState<File[]>([]);
  const [saving ,setSaving ]=useState(false);
  const [toast  ,setToast  ]=useState<{text:string;variant:'success'|'danger'}|null>(null);

  /* amenities ----------------------------------------------------- */
  const [amenOpts,setAmenOpts]=useState<{label:string;value:string}[]>([]);
  const [loadingAms,setLoadingAms]=useState(true);

  useEffect(()=>{ (async()=>{
      try {
        const res = await fetch(`${API}/apartment/amenities`, {
          credentials: 'include'
        });
        const { amenities } = await res.json();
        setAmenOpts(amenities);
      } finally { setLoadingAms(false); }
  })();},[API]);

  /* map pick ------------------------------------------------------ */
  const [marker,setMarker] = useState<{lat:number;lon:number}|null>(null);
  const [mapErr,setMapErr] = useState<string|null>(null);
  const onMapClick=(e:any)=>{ const {lng,lat}=e.lngLat; setMarker({lat,lon:lng}); setMapErr(null); };

  /* file input ---------------------------------------------------- */
  const onFileChange=(e:ChangeEvent<HTMLInputElement>)=>{
    if(!e.target.files) return;
    const uniq=[...images,...Array.from(e.target.files)]
        .filter((f,i,a)=>a.findIndex(x=>x.name===f.name&&x.size===f.size)===i)
        .slice(0,10);
    setImages(uniq); e.target.value='';
  };
  const removeImg=(i:number)=>setImages(p=>p.filter((_,idx)=>idx!==i));

  /* submit -------------------------------------------------------- */
  const saveProperty = async ()=>{
    setToast(null);
    if(!marker){ setMapErr('Pick a location'); return; }
    if(!beds || !baths){ setToast({text:'Beds & Baths required',variant:'danger'}); return; }
    if(!block || !area){ setToast({text:'Block & Area required',variant:'danger'}); return; }

    setSaving(true);
    try{
      const body:any = {
        listing_type : listingType,
        status       : 'draft',
        bedrooms     : beds,
        bathrooms    : baths,
        furnished    : furn ?? false,
        title        : title.trim(),
        description  : desc.trim(),
        amenities    : amenSel,
        latitude     : marker.lat,
        longitude    : marker.lon,
        block_no     : block,
        area_name_en : area,
        size_m2      : size || 0,
        firm_id      : user?.firm_id,  // sent for completeness
        user_id      : user?.user_id
      };
      if(listingType==='sale') body.asking_price = price;
      else                      body.rent_price  = price;

      const res = await fetch(`${API}/apartment`,{
        method :'POST',
        credentials:'include',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(body)
      });
      if(!res.ok) throw new Error(await res.text());
      const { id } = await res.json();

      /* image upload -------------------------------------------- */
      if(images.length){
        const fd = new FormData();
        images.forEach(f=>fd.append('files',f));
        const imgRes = await fetch(`${API}/firm-properties/${id}/images`,{
          method:'POST',
          credentials:'include',
          body:fd
        });
        if(!imgRes.ok) throw new Error(await imgRes.text());
      }
      
      router.push(`/apartment/${id}`)
      setToast({text:'Property created 🎉',variant:'success'});
      // minimal reset
      setImages([]); setTitle(''); setDesc('');
    }catch(e:any){
      setToast({text:e.message||'Save failed',variant:'danger'});
    }finally{ setSaving(false); }
  };

  /* ---------------------------------------------------------------- */
  if(checking) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Image src="/assets/images/media/loader.svg" width={64} height={64} alt="Loading" priority/>
    </div>
  );

  return (
    <Fragment>
      <Seo title="Add Residential Property"/>
      <Pageheader share={false} filter={false}
                  title="Dashboard" subtitle="Residential"
                  currentpage="Add Property" activepage="Add Property"/>

      {toast && (
        <Alert variant={toast.variant} onClose={()=>setToast(null)} dismissible className="mb-3">
          {toast.text}
        </Alert>
      )}

      <Row><Col xl={12}>
        <Card className="custom-card">
          <Card.Body><Row className="gx-4 gy-3">

            {/* LEFT COL ------------------------------------------------ */}
            <Col xxl={6} lg={12}><Row className="gy-3">

              <Col xl={12}>
                <Form.Label>Property Title *</Form.Label>
                <Form.Control value={title} onChange={e=>setTitle(e.target.value)} maxLength={150}/>
              </Col>

              <Col xl={6}>
                <Form.Label>Bedrooms *</Form.Label>
                {/* @ts-ignore */}
                <SpkSelect option={BedroomOpts} onChange={(o:any)=>setBeds(+o.value)}/>
              </Col>

              <Col xl={6}>
                <Form.Label>Bathrooms *</Form.Label>
                {/* @ts-ignore */}
                <SpkSelect option={BathroomOpts} onChange={(o:any)=>setBaths(+o.value)}/>
              </Col>

              <Col xl={6}>
                <Form.Label>Listing Type *</Form.Label>
                {/* @ts-ignore */}
                <SpkSelect option={ListingOpts} value={ListingOpts.find(o=>o.value===listingType)}
                           onChange={(o:any)=>setListingType(o.value)}/>
              </Col>

              <Col xl={6}>
                <Form.Label>Furnishing *</Form.Label>
                {/* @ts-ignore */}
                <SpkSelect option={FurnishedOpts} onChange={(o:any)=>setFurn(o.value)}/>
              </Col>

              <Col xl={6}>
                <Form.Label>{listingType==='sale'?'Selling Price *':'Monthly Rent *'} (BHD)</Form.Label>
                <Form.Control type="number" min={0} value={price||''}
                              onChange={e=>setPrice(+e.target.value)}/>
              </Col>

              <Col xl={6}>
                <Form.Label>Size (m²)</Form.Label>
                <Form.Control type="number" min={0} value={size||''}
                              onChange={e=>setSize(+e.target.value)}/>
              </Col>

              <Col xl={6}>
                <Form.Label>Block No. *</Form.Label>
                <Form.Control value={block} onChange={e=>setBlock(e.target.value)}/>
              </Col>

              <Col xl={6}>
                <Form.Label>Area *</Form.Label>
                <Form.Control value={area} onChange={e=>setArea(e.target.value)}/>
              </Col>

              <Col xl={12}>
                <Form.Label>Description *</Form.Label>
                <Form.Control as="textarea" rows={4} value={desc}
                              onChange={e=>setDesc(e.target.value)}/>
              </Col>

              {/* IMAGES ------------------------------------------------ */}
              <Col xl={12}>
                <Form.Label>Images (up to 10)</Form.Label>
                <Form.Control type="file" accept="image/*" multiple onChange={onFileChange}/>
                {!!images.length && (
                  <Row className="g-2 mt-2">
                    {images.map((f,i)=>(
                      <Col key={i} xs={4} sm={3} md={2}>
                        <div className="border rounded p-1 text-center">
                          <img src={URL.createObjectURL(f)}
                               style={{objectFit:'cover',height:70,width:'100%'}}
                               className="img-fluid rounded mb-1" alt="preview"/>
                          <BsBtn variant="link" size="sm" className="text-danger p-0"
                                 onClick={()=>removeImg(i)}>×</BsBtn>
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
              </Col>

            </Row></Col>

            {/* RIGHT COL ----------------------------------------------- */}
            <Col xxl={6} lg={12}><Row className="gy-3">

              <Col xl={12}>
                <Form.Label>Amenities</Form.Label>
                {loadingAms
                  ? <Spinner animation="border" size="sm"/>
                  : /* @ts-ignore */
                    <SpkSelect multi option={amenOpts}
                               onChange={(v:any)=>setAmenSel(v.map((x:any)=>x.value))}/>
                }
              </Col>

              <Col xl={12}>
                <Form.Label>Select Location *</Form.Label>
                {!TOKEN
                  ? <Alert variant="warning">Mapbox token missing.</Alert>
                  : (
                    <div style={{height:300}}>
                      {/* @ts-ignore */}
                      <Map mapboxAccessToken={TOKEN} initialViewState={{
                            latitude:26.0667, longitude:50.5577, zoom:10}}
                           mapStyle="mapbox://styles/mapbox/streets-v11"
                           onClick={onMapClick} style={{borderRadius:'0.5rem'}}>
                        {marker && (
                          /* @ts-ignore */
                          <Marker longitude={marker.lon} latitude={marker.lat}
                                  draggable onDragEnd={onMapClick}>
                            <div style={{fontSize:22,color:'tomato'}}>📍</div>
                          </Marker>
                        )}
                      </Map>
                    </div>
                  )}
                {mapErr && <small className="text-danger">{mapErr}</small>}
              </Col>

            </Row></Col>

          </Row></Card.Body>
          <div className="card-footer d-flex justify-content-end border-top">
            <SpkButton Buttonvariant="primary1"
                       onClickfunc={saveProperty}>
              {saving ? <Spinner animation="border" size="sm" className="me-2"/> : 'Add Property'}
            </SpkButton>
          </div>
        </Card>
      </Col></Row>

      {/* react-select dark-mode tweaks */}
      <style jsx global>{`
        .react-select__control,
        .react-select__menu { background:var(--bs-body-bg)!important; }
        .react-select__single-value,
        .react-select__multi-value__label { color:var(--bs-body-color)!important; }
      `}</style>
    </Fragment>
  );
};

AddResidentialProperty.layout = 'ContentLayout';
export default AddResidentialProperty;
