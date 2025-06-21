/* components/MapDisplay/index.tsx */
'use client';

import 'mapbox-gl/dist/mapbox-gl.css';         // default marker sprite ⬅ KEEP
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

/* ------------------------------------------------------------------ */
interface Props {
  /** centre `[lng, lat]` */
  center: [number, number];

  /** land-parcel polygon (omit → no polygon) */
  parcelFeature?: Feature<Geometry, GeoJsonProperties> | null;

  /** draw a marker? (default = true) */
  showMarker?: boolean;

  /** lock interaction? */
  movable?: boolean;

  /** height (px) */
  heightPx?: number;
}
/* ------------------------------------------------------------------ */
const MapDisplay: React.FC<Props> = ({
  center,
  parcelFeature = null,
  showMarker = true,
  movable = true,
  heightPx = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const markerRef    = useRef<mapboxgl.Marker | null>(null);

  /* ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!containerRef.current) return;

    const lngLat:[number,number] = [+center[0], +center[1]];

    /* ---- first mount ---------------------------------------- */
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: containerRef.current,
        style:     'mapbox://styles/mapbox/streets-v11',
        center:    lngLat,
        zoom:      17,
        interactive: movable,
        attributionControl:false,
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
        /* polygon? */
        if (parcelFeature) {
          mapRef.current!.addSource('parcel', { type:'geojson', data: parcelFeature });
          mapRef.current!.addLayer({
            id:'fill', type:'fill', source:'parcel',
            paint:{ 'fill-color':'#ff0000', 'fill-opacity':0.8 },
          });
          mapRef.current!.addLayer({
            id:'outline', type:'line', source:'parcel',
            paint:{ 'line-color':'#003366', 'line-width':2 },
          });
        }
        /* marker? */
        if (showMarker) {
          markerRef.current = new mapboxgl.Marker()
            .setLngLat(lngLat)
            .addTo(mapRef.current!);
        }
      });
    }

    /* ---- updates -------------------------------------------- */
    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      mapRef.current.flyTo({ center: lngLat, zoom:17 });
      if (showMarker) {
        if (!markerRef.current) {
          markerRef.current = new mapboxgl.Marker()
            .setLngLat(lngLat)
            .addTo(mapRef.current);
        } else {
          markerRef.current.setLngLat(lngLat);
        }
      } else if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      /* polygon updates */
      const src = mapRef.current.getSource('parcel') as mapboxgl.GeoJSONSource | undefined;
      if (parcelFeature) {
        if (src) src.setData(parcelFeature);
        else {
          mapRef.current.addSource('parcel', { type:'geojson', data: parcelFeature });
          mapRef.current.addLayer({
            id:'fill', type:'fill', source:'parcel',
            paint:{ 'fill-color':'#ff0000', 'fill-opacity':0.8 },
          });
          mapRef.current.addLayer({
            id:'outline', type:'line', source:'parcel',
            paint:{ 'line-color':'#003366', 'line-width':2 },
          });
        }
      } else if (src) {          // remove polygon if no longer wanted
        ['fill','outline'].forEach(id=>{
          if (mapRef.current!.getLayer(id)) mapRef.current!.removeLayer(id);
        });
        mapRef.current.removeSource('parcel');
      }
    }
  }, [center, parcelFeature, showMarker, movable]);

  /* clean-up */
  useEffect(()=>()=>mapRef.current?.remove(),[]);

  return (
    <div
      ref={containerRef}
      style={{ height: heightPx, width: '100%' }}
      className="rounded overflow-hidden"
    />
  );
};

export default MapDisplay;
