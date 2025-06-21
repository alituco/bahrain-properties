'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Box } from '@mui/material';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
const API = process.env.NEXT_PUBLIC_API_URL!;

interface Props { propertyId:number; }

export default function ResidentialMap({ propertyId }:Props){
  const container = useRef<HTMLDivElement>(null);
  const mapRef    = useRef<mapboxgl.Map|null>(null);

  useEffect(()=>{ (async()=>{
    const r = await fetch(`${API}/apartment/${propertyId}`,{credentials:'include'});
    if(!r.ok) return;
    const { property } = await r.json();
    if(!property.latitude || !property.longitude) return;

    const center:[number,number] = [+property.longitude, +property.latitude];

    if(!mapRef.current){
      mapRef.current = new mapboxgl.Map({
        container: container.current as HTMLElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        center, zoom: 15,
      });
      new mapboxgl.Marker().setLngLat(center).addTo(mapRef.current);
    }else{
      mapRef.current.flyTo({center,zoom:15});
    }
  })(); },[propertyId]);

  return <Box sx={{height:300,borderRadius:6,overflow:'hidden'}} ref={container}/>;
}
