'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

interface Props {
  parcelFeature: Feature<Geometry, GeoJsonProperties>;  
  center       : [number, number];                     
}

const MapThumb: React.FC<Props> = ({ parcelFeature, center }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map>();

  useEffect(() => {
    if (!containerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style:     'mapbox://styles/mapbox/streets-v11',
      center,
      zoom:      17,
      interactive: false,          
      attributionControl: false,
    });

    mapRef.current.on('load', () => {
      mapRef.current!.addSource('parcel', {
        type: 'geojson',
        data: parcelFeature,
      });

      mapRef.current!.addLayer({
        id: 'parcel-fill',
        type: 'fill',
        source: 'parcel',
        paint: {
          'fill-color'   : '#ff0000',
          'fill-opacity' : 0.9,
        },
      });

      mapRef.current!.addLayer({
        id: 'parcel-outline',
        type: 'line',
        source: 'parcel',
        paint: {
          'line-color' : '#003366',
          'line-width' : 2,
        },
      });
    });

    return () => mapRef.current?.remove();
  }, [parcelFeature, center]);

  return (
    <div
      ref={containerRef}
      style={{ height: 180, borderRadius: 6, overflow: 'hidden' }}
    />
  );
};

export default MapThumb;
