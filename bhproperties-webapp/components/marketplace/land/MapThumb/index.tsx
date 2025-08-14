/* components/marketplace/land/MapThumb/index.tsx */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Feature, Geometry, GeoJsonProperties, FeatureCollection } from 'geojson';
import * as turf from '@turf/turf';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
const API = process.env.NEXT_PUBLIC_API_URL!;

/* font size vs parcel area (for edge labels) */
const sizeForArea = (m2: number): number => {
  if (m2 < 300) return 10;
  if (m2 < 1500) return 12;
  if (m2 < 6000) return 14;
  if (m2 < 20000) return 16;
  return 18;
};

type MaybeFeature =
  | Feature<Geometry, GeoJsonProperties>
  | { geojson: string | Geometry; [k: string]: any };

interface Props {
  parcelFeature      : MaybeFeature;
  center             : [number, number]; // fallback centre
  showMeasurements?  : boolean;
  showNeighbors?     : boolean;          // draw surrounding parcels (faint)
  neighborsParcelNo? : string;           // fetch neighbors by parcel number
  heightPx?          : number;           // default 180
  movable?           : boolean;          // default false
}

const MapThumb: React.FC<Props> = ({
  parcelFeature,
  center,
  showMeasurements = false,
  showNeighbors = false,
  neighborsParcelNo,
  heightPx = 180,
  movable = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const SRC_PARCEL   = 'parcel';
  const SRC_LABELS   = 'labels';
  const LYR_LABELS   = 'labels';

  const SRC_NEI      = 'neighbors';
  const LYR_NEI_FILL = 'neighbors-fill';
  const LYR_NEI_OUT  = 'neighbors-outline';

  const [neighbors, setNeighbors] =
    useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(null);

  /* normalize to a GeoJSON Feature */
  const toFeature = (): Feature<Geometry, GeoJsonProperties> | null => {
    if (typeof parcelFeature === 'object' && 'type' in parcelFeature && parcelFeature.type === 'Feature')
      return parcelFeature as Feature<Geometry, GeoJsonProperties>;

    const raw = (parcelFeature as any)?.geojson ?? parcelFeature;
    if (!raw) return null;

    try {
      const geom: Geometry = typeof raw === 'string' ? JSON.parse(raw) : (raw as Geometry);
      return { type: 'Feature', geometry: geom, properties: {} };
    } catch {
      return null;
    }
  };

  const fitToFeature = (feature: Feature) => {
    const map = mapRef.current;
    if (!map) return;
    const [minX, minY, maxX, maxY] = turf.bbox(feature);
    map.fitBounds(new mapboxgl.LngLatBounds([minX, minY], [maxX, maxY]), {
      padding: 22,
      maxZoom: 18.5,
    });
  };

  /* FETCH neighbors by parcel number (calls /parcelData/parcel/around/:parcelNo) */
  useEffect(() => {
    if (!showNeighbors || !neighborsParcelNo) {
      setNeighbors(null);
      return;
    }

    const url = `${API}/parcelData/around/${encodeURIComponent(neighborsParcelNo)}`;

    (async () => {
      try {
        const r = await fetch(url, { credentials: 'include' });
        if (!r.ok) throw new Error('Failed to load neighbors');
        const fc = (await r.json()) as FeatureCollection<Geometry, GeoJsonProperties>;

        // ensure stable IDs
        const withIds: FeatureCollection<Geometry, GeoJsonProperties> = {
          type: 'FeatureCollection',
          features: (fc.features ?? []).map((f, i) => ({
            ...f,
            id: (f.properties as any)?.parcel_no ?? i,
          })),
        };
        setNeighbors(withIds);
      } catch {
        setNeighbors(null);
      }
    })();
  }, [API, showNeighbors, neighborsParcelNo]);

  /* first mount: create map */
  useEffect(() => {
    const feature = toFeature();
    if (!containerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center,
      zoom: 16.5,
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
      if (neighbors && neighbors.features?.length) addOrUpdateNeighbors(neighbors);
      if (feature) {
        addOrUpdateParcel(feature);
        fitToFeature(feature);
        if (showMeasurements) addMeasurements(feature);
      }
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* subject parcel updates */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const feature = toFeature();

    if (feature) {
      addOrUpdateParcel(feature);
      fitToFeature(feature);
    } else {
      map.jumpTo({ center, zoom: 16.5 });
    }

    if (showMeasurements && feature) addMeasurements(feature);
    else removeMeasurements();
  }, [parcelFeature, center, showMeasurements]);

  /* neighbors updates */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (showNeighbors && neighbors && neighbors.features?.length) {
      addOrUpdateNeighbors(neighbors);
    } else {
      removeNeighbors();
    }
  }, [showNeighbors, neighbors]);

  /* layers/helpers */
  const addOrUpdateParcel = (feature: Feature<Geometry>) => {
    const map = mapRef.current;
    if (!map) return;

    const src = map.getSource(SRC_PARCEL) as mapboxgl.GeoJSONSource | undefined;
    if (src) {
      src.setData(feature);
      return;
    }
    map.addSource(SRC_PARCEL, { type: 'geojson', data: feature });
    map.addLayer({
      id: 'parcel-fill',
      type: 'fill',
      source: SRC_PARCEL,
      paint: { 'fill-color': '#ff0000', 'fill-opacity': 0.85 },
    });
    map.addLayer({
      id: 'parcel-outline',
      type: 'line',
      source: SRC_PARCEL,
      paint: { 'line-color': '#303030', 'line-width': 2 },
    });
  };

  const addOrUpdateNeighbors = (fc: FeatureCollection<Geometry, GeoJsonProperties>) => {
    const map = mapRef.current;
    if (!map) return;

    const neiSrc = map.getSource(SRC_NEI) as mapboxgl.GeoJSONSource | undefined;
    if (neiSrc) neiSrc.setData(fc);
    else map.addSource(SRC_NEI, { type: 'geojson', data: fc });

    if (!map.getLayer(LYR_NEI_FILL)) {
      map.addLayer({
        id: LYR_NEI_FILL,
        type: 'fill',
        source: SRC_NEI,
        paint: {
          'fill-color': '#5f6b7a',
          'fill-opacity': 0.18,
        },
      });
    }

    if (!map.getLayer(LYR_NEI_OUT)) {
      map.addLayer({
        id: LYR_NEI_OUT,
        type: 'line',
        source: SRC_NEI,
        paint: { 'line-color': '#7b8898', 'line-width': 0.8 },
      });
    }
  };

  const removeNeighbors = () => {
    const map = mapRef.current;
    if (!map) return;
    if (map.getLayer(LYR_NEI_FILL)) map.removeLayer(LYR_NEI_FILL);
    if (map.getLayer(LYR_NEI_OUT))  map.removeLayer(LYR_NEI_OUT);
    if (map.getSource(SRC_NEI))     map.removeSource(SRC_NEI);
  };

  const addMeasurements = (feature: Feature<Geometry>) => {
    const map = mapRef.current;
    if (!map) return;
    if (feature.geometry.type !== 'Polygon') return;

    const ring = feature.geometry.coordinates[0] as number[][];
    const labels: GeoJSON.Feature[] = [];

    const area = turf.area(feature);
    const baseSize = sizeForArea(area);

    for (let i = 0; i < ring.length - 1; i++) {
      const a = ring[i], b = ring[i + 1];
      const len = turf.distance(turf.point(a), turf.point(b), { units: 'meters' });
      labels.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] },
        properties: { label: `${len.toFixed(1)} m` },
      });
    }

    const fc: FeatureCollection = { type: 'FeatureCollection', features: labels };
    const sizeExpr: any = ['interpolate', ['linear'], ['zoom'], 0, baseSize, 14, baseSize, 20, baseSize * 1.3];

    if (map.getSource(SRC_LABELS)) {
      (map.getSource(SRC_LABELS) as mapboxgl.GeoJSONSource).setData(fc);
      map.setLayoutProperty(LYR_LABELS, 'text-size', sizeExpr);
    } else {
      map.addSource(SRC_LABELS, { type: 'geojson', data: fc });
      map.addLayer({
        id: LYR_LABELS,
        type: 'symbol',
        source: SRC_LABELS,
        layout: {
          'text-field': ['get', 'label'],
          'text-size': sizeExpr,
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold', 'DIN Offc Pro Bold'],
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
    const map = mapRef.current;
    if (!map) return;
    if (map.getLayer(LYR_LABELS)) map.removeLayer(LYR_LABELS);
    if (map.getSource(SRC_LABELS)) map.removeSource(SRC_LABELS);
  };

  return (
    <div
      ref={containerRef}
      style={{ height: heightPx, borderRadius: 6, overflow: 'hidden' }}
    />
  );
};

export default MapThumb;
