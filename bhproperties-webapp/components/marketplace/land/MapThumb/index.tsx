/* components/marketplace/land/MapThumb/index.tsx */
'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';
import * as turf from '@turf/turf';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

/* ───────── helper: font size vs parcel area ───────── */
/* tweak the thresholds to taste */
const sizeForArea = (m2: number): number => {
  if (m2 <  300)  return 10;  // tiny plot → small text
  if (m2 < 1500)  return 12;
  if (m2 < 6000)  return 14;
  if (m2 < 20000) return 16;
  return 18;                 // huge plot
};

/* ──────────────── types ──────────────── */

type MaybeFeature =
  | Feature<Geometry, GeoJsonProperties>
  | { geojson: string | Geometry; [k: string]: any };

interface Props {
  parcelFeature     : MaybeFeature;
  center            : [number, number]; // fallback centre
  showMeasurements? : boolean;
  heightPx?         : number;   // default 180
  movable?          : boolean;  // default false
}

/* ─────────────────────────────────────── */

const MapThumb: React.FC<Props> = ({
  parcelFeature,
  center,
  showMeasurements = false,
  heightPx = 180,
  movable = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map>();

  const SRC_PARCEL = 'parcel';
  const SRC_LABELS = 'labels';
  const LYR_LABELS = 'labels';

  /* -------------- normalise to Feature -------------------- */
  const toFeature = (): Feature<Geometry, GeoJsonProperties> | null => {
    if (
      typeof parcelFeature === 'object' &&
      'type' in parcelFeature &&
      parcelFeature.type === 'Feature'
    ) return parcelFeature as Feature;

    const raw = (parcelFeature as any)?.geojson ?? parcelFeature;
    if (!raw) return null;

    try {
      const geom: Geometry =
        typeof raw === 'string' ? JSON.parse(raw) : (raw as Geometry);
      return { type: 'Feature', geometry: geom, properties: {} };
    } catch { return null; }
  };

  /* -------------- fit map to parcel ----------------------- */
  const fitToFeature = (feature: Feature) => {
    if (!mapRef.current) return;
    const [minX, minY, maxX, maxY] = turf.bbox(feature);
    mapRef.current.fitBounds(
      new mapboxgl.LngLatBounds([minX, minY], [maxX, maxY]),
      { padding: 20, maxZoom: 19 },
    );
  };

  /* ---------------- first mount --------------------------- */
  useEffect(() => {
    const feature = toFeature();
    if (!containerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center,
      zoom: 17,
      interactive: movable,
      attributionControl: false,
    });

    if (!movable) {
      mapRef.current.scrollZoom.disable();
      mapRef.current.dragPan.disable();
      mapRef.current.touchZoomRotate.disable();
      mapRef.current.doubleClickZoom.disable();
      mapRef.current.boxZoom.disable();
      mapRef.current.dragRotate.disable();
      mapRef.current.keyboard.disable();
    }

    mapRef.current.on('load', () => {
      if (feature) {
        mapRef.current!.addSource(SRC_PARCEL, { type: 'geojson', data: feature });
        mapRef.current!.addLayer({
          id: 'parcel-fill',
          type: 'fill',
          source: SRC_PARCEL,
          paint: { 'fill-color': '#ff0000', 'fill-opacity': 0.9 },
        });
        mapRef.current!.addLayer({
          id: 'parcel-outline',
          type: 'line',
          source: SRC_PARCEL,
          paint: { 'line-color': '#003366', 'line-width': 2 },
        });
        fitToFeature(feature);
        if (showMeasurements) addMeasurements(feature);
      }
    });

    return () => mapRef.current?.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- updates ------------------------------ */
  useEffect(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;

    const feature = toFeature();

    if (feature) {
      const src = mapRef.current.getSource(SRC_PARCEL) as mapboxgl.GeoJSONSource | undefined;
      if (src) src.setData(feature);
      else {
        mapRef.current.addSource(SRC_PARCEL, { type: 'geojson', data: feature });
        mapRef.current.addLayer({
          id: 'parcel-fill',
          type: 'fill',
          source: SRC_PARCEL,
          paint: { 'fill-color': '#ff0000', 'fill-opacity': 0.9 },
        });
        mapRef.current.addLayer({
          id: 'parcel-outline',
          type: 'line',
          source: SRC_PARCEL,
          paint: { 'line-color': '#003366', 'line-width': 2 },
        });
      }
      fitToFeature(feature);
    } else {
      mapRef.current.jumpTo({ center, zoom: 17 });
    }

    if (showMeasurements && feature) addMeasurements(feature);
    else removeMeasurements();
  }, [parcelFeature, center, showMeasurements]);

  /* -------------- measurement labels ---------------------- */
  const addMeasurements = (feature: Feature<Geometry>) => {
    if (!mapRef.current || feature.geometry.type !== 'Polygon') return;

    const ring = feature.geometry.coordinates[0] as number[][];
    const labels: GeoJSON.Feature[] = [];

    /* font size based on parcel area */
    const area = turf.area(feature);           // m²
    const baseSize = sizeForArea(area);        // 10–18 from helper

    /* edge lengths */
    for (let i = 0; i < ring.length - 1; i++) {
      const a = ring[i], b = ring[i + 1];
      const len = turf.distance(turf.point(a), turf.point(b), { units: 'meters' });
      labels.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] },
        properties: { label: `${len.toFixed(1)} m` },
      });
    }

    const fc: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: labels,
    };

    /* expression uses the computed baseSize */
    const sizeExpr: any = [
      'interpolate', ['linear'], ['zoom'],
      0 , baseSize,
      14, baseSize,
      20, baseSize * 1.3,
    ];

    if (mapRef.current.getSource(SRC_LABELS)) {
      (mapRef.current.getSource(SRC_LABELS) as mapboxgl.GeoJSONSource).setData(fc);
      mapRef.current.setLayoutProperty(LYR_LABELS, 'text-size', sizeExpr);
    } else {
      mapRef.current.addSource(SRC_LABELS, { type: 'geojson', data: fc });
      mapRef.current.addLayer({
        id: LYR_LABELS,
        type: 'symbol',
        source: SRC_LABELS,
        layout: {
          'text-field': ['get', 'label'],
          'text-size': sizeExpr,
          'text-font': [
            'Open Sans Bold',
            'Arial Unicode MS Bold',
            'DIN Offc Pro Bold',
          ],
          'text-anchor': 'center',
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        },
        paint: {
          'text-color': '#111',
          'text-halo-color': '#fff',
          'text-halo-width': 2,
        },
      });
    }
  };

  const removeMeasurements = () => {
    if (!mapRef.current) return;
    if (mapRef.current.getLayer(LYR_LABELS)) mapRef.current.removeLayer(LYR_LABELS);
    if (mapRef.current.getSource(SRC_LABELS)) mapRef.current.removeSource(SRC_LABELS);
  };

  /* ---------------- render ------------------------- */
  return (
    <div
      ref={containerRef}
      style={{ height: heightPx, borderRadius: 6, overflow: 'hidden' }}
    />
  );
};

export default MapThumb;
