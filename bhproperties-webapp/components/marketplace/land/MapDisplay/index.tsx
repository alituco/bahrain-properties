/* components/MapDisplay/index.tsx */
'use client';

import 'mapbox-gl/dist/mapbox-gl.css';               // default marker sprite ⬅ KEEP
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';
import * as turf from '@turf/turf';                  // ← NEW

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

/* ------------------------------------------------------------------ */
interface Props {
  /** centre `[lng, lat]` */
  center: [number, number];

  /** land-parcel polygon (omit → no polygon) */
  parcelFeature?: Feature<Geometry, GeoJsonProperties> | null;

  /** draw a marker? (default = true) */
  showMarker?: boolean;

  /** show length of every side & total area? (default = false) */
  showMeasurements?: boolean;

  /** lock interaction? */
  movable?: boolean;

  /** height (px) */
  heightPx?: number;
}
/* ------------------------------------------------------------------ */
const MapDisplay: React.FC<Props> = ({
  center,
  parcelFeature = null,
  showMarker       = true,
  showMeasurements = false,          // ← NEW default
  movable          = true,
  heightPx         = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const markerRef    = useRef<mapboxgl.Marker | null>(null);

  /* ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!containerRef.current) return;

    const lngLat: [number, number] = [+center[0], +center[1]];

    /* ---------- first mount ---------------------------------- */
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
        addOrUpdateParcel(parcelFeature);
        addOrUpdateMarker(lngLat);
        addOrUpdateMeasurements(parcelFeature, showMeasurements);
      });
    }

    /* ---------- updates -------------------------------------- */
    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      mapRef.current.flyTo({ center: lngLat, zoom: 17 });

      addOrUpdateMarker(lngLat);
      addOrUpdateParcel(parcelFeature);
      addOrUpdateMeasurements(parcelFeature, showMeasurements);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, parcelFeature, showMarker, showMeasurements, movable]);

  /* ---------- clean-up -------------------------------------- */
  useEffect(() => () => mapRef.current?.remove(), []);

  /* ----------------------------------------------------------- */
  /* helpers                                                    */
  /* ----------------------------------------------------------- */

  /** add / move / remove the pin */
  const addOrUpdateMarker = (lngLat: [number, number]) => {
    if (!mapRef.current) return;
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
  };

  /** add / update / remove polygon layers */
  const addOrUpdateParcel = (
    feature: Feature<Geometry, GeoJsonProperties> | null | undefined,
  ) => {
    if (!mapRef.current) return;

    const src = mapRef.current.getSource('parcel') as mapboxgl.GeoJSONSource | undefined;

    if (feature) {
      if (src) src.setData(feature);
      else {
        mapRef.current.addSource('parcel', { type: 'geojson', data: feature });
        mapRef.current.addLayer({
          id: 'fill', type: 'fill', source: 'parcel',
          paint: { 'fill-color': '#ff0000', 'fill-opacity': 0.8 },
        });
        mapRef.current.addLayer({
          id: 'outline', type: 'line', source: 'parcel',
          paint: { 'line-color': '#003366', 'line-width': 2 },
        });
      }
    } else if (src) {                                  // remove polygon if no longer wanted
      ['fill', 'outline'].forEach(id => {
        if (mapRef.current!.getLayer(id)) mapRef.current!.removeLayer(id);
      });
      mapRef.current.removeSource('parcel');
    }
  };

  /** build/update measurement label source+layer */
  const addOrUpdateMeasurements = (
    feature: Feature<Geometry, GeoJsonProperties> | null | undefined,
    want: boolean,
  ) => {
    if (!mapRef.current) return;
    const srcId   = 'measure-labels';
    const layerId = 'measure-labels';

    /* remove if not wanted ------------------------ */
    if (!want || !feature) {
      if (mapRef.current.getLayer(layerId)) mapRef.current.removeLayer(layerId);
      if (mapRef.current.getSource(srcId)) mapRef.current.removeSource(srcId);
      return;
    }

    /* build a label FeatureCollection ------------- */
    if (feature.geometry.type !== 'Polygon') return;

    const ring   = feature.geometry.coordinates[0] as number[][];
    const labels: GeoJSON.Feature[] = [];

    // total area
    const poly      = turf.polygon([ring]);
    const area      = turf.area(poly);                  // m²
    const centroid  = turf.centroid(poly);
    labels.push({
      type: 'Feature',
      geometry: centroid.geometry,
      properties: { label: `${area.toFixed(1)} m²` },
    });

    // length of each edge
    for (let i = 0; i < ring.length - 1; i++) {
      const a = ring[i];
      const b = ring[i + 1];
      const len = turf.distance(turf.point(a), turf.point(b), { units: 'meters' });
      const mid: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

      labels.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: mid },
        properties: { label: `${len.toFixed(1)} m` },
      });
    }

    const labelFC: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: labels,
    };

    /* add / update the source+layer ---------------- */
    if (mapRef.current.getSource(srcId)) {
      (mapRef.current.getSource(srcId) as mapboxgl.GeoJSONSource).setData(labelFC);
    } else {
      mapRef.current.addSource(srcId, { type: 'geojson', data: labelFC });
      mapRef.current.addLayer({
        id: layerId,
        type: 'symbol',
        source: srcId,
        layout: {
          'text-field': ['get', 'label'],
          'text-size': 12,
          'text-anchor': 'center',
        },
        paint: {
          'text-color': '#111',
          'text-halo-color': '#fff',
          'text-halo-width': 1,
        },
      });
    }
  };

  /* ----------------------------------------------------------- */
  return (
    <div
      ref={containerRef}
      style={{ height: heightPx, width: '100%' }}
      className="rounded overflow-hidden"
    />
  );
};

export default MapDisplay;
