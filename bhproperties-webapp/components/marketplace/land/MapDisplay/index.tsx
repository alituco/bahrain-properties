'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

interface Props {
  parcelFeature : Feature<Geometry, GeoJsonProperties>;
  center        : [number, number];
  movable?      : boolean;
  heightPx?     : number;
}

const MapDisplay: React.FC<Props> = ({
  parcelFeature,
  center,
  movable = true,
  heightPx = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container  : containerRef.current,
        style      : 'mapbox://styles/mapbox/streets-v11',
        center,
        zoom       : 17,
        interactive: movable,
        attributionControl: false,
      });

      if (!movable) {
        mapRef.current.scrollZoom.disable();
        mapRef.current.doubleClickZoom.disable();
        mapRef.current.boxZoom.disable();
        mapRef.current.dragRotate.disable();
        mapRef.current.dragPan.disable();
        mapRef.current.keyboard.disable();
        mapRef.current.touchZoomRotate.disable();
      }

      mapRef.current.on('load', () => {
        mapRef.current!.addSource('parcel', { type: 'geojson', data: parcelFeature });
        mapRef.current!.addLayer({
          id   : 'fill',
          type : 'fill',
          source: 'parcel',
          paint: { 'fill-color': '#ff0000', 'fill-opacity': 0.8 },
        });
        mapRef.current!.addLayer({
          id   : 'outline',
          type : 'line',
          source: 'parcel',
          paint: { 'line-color': '#003366', 'line-width': 2 },
        });
      });
    } else {
      mapRef.current.flyTo({ center, zoom: 17 });
      const src = mapRef.current.getSource('parcel') as mapboxgl.GeoJSONSource | undefined;
      src?.setData(parcelFeature);
    }
  }, [parcelFeature, center, movable]);

  useEffect(() => () => mapRef.current?.remove(), []);

  return (
    <div
      ref={containerRef}
      style={{ height: heightPx, width: '100%' }}
      className="rounded overflow-hidden"
    />
  );
};

export default MapDisplay;
