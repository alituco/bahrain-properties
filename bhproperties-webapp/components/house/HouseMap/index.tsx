'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@mui/material';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
const API = process.env.NEXT_PUBLIC_API_URL!;

interface Props {
  propertyId: number;
}

export default function HouseMap({ propertyId }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef    = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!container.current) return;

    (async () => {
      const res = await fetch(`${API}/house/${propertyId}`, { credentials: 'include' });
      if (!res.ok || cancelled) return;
      const { property } = await res.json();
      const { latitude, longitude } = property;
      if (!(latitude && longitude)) return;

      const center: [number, number] = [Number(longitude), Number(latitude)];

      if (!mapRef.current) {

        mapRef.current = new mapboxgl.Map({
          container: container.current!,     
          style: 'mapbox://styles/mapbox/streets-v11',
          center,
          zoom: 15,
        });
        markerRef.current = new mapboxgl.Marker()
          .setLngLat(center)
          .addTo(mapRef.current);
      } else {

        mapRef.current.flyTo({ center, zoom: 15 });
        markerRef.current
          ? markerRef.current.setLngLat(center)
          : (markerRef.current = new mapboxgl.Marker().setLngLat(center).addTo(mapRef.current));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  useEffect(() => () => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  }, []);

  return (
    <Box
      ref={container}
      component="div"
      sx={{
        width: '100%',
        height: 300,
        borderRadius: 6,
        overflow: 'hidden',
      }}
    />
  );
}
