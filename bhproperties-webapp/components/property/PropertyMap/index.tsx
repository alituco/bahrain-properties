"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Box } from "@mui/material";
import { Feature, Geometry, GeoJsonProperties } from "geojson";
import * as turf from "@turf/turf";                     // 🆕 NEW

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
const API = process.env.NEXT_PUBLIC_API_URL!;

interface ParcelGeo extends Feature<Geometry, GeoJsonProperties> {
  properties: { parcel_no: string; longitude?: number; latitude?: number };
}

interface Props {
  parcelNo: string;
}

const PropertyMap: React.FC<Props> = ({ parcelNo }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const cont = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<ParcelGeo | null>(null);

  /* ─────────────────────── fetch parcel geojson ──────────────────────── */
  useEffect(() => {
    (async () => {
      const r = await fetch(`${API}/parcelData/geo/${parcelNo}`, {
        credentials: "include",
      });
      const d = await r.json();
      setGeo(d);
    })();
  }, [parcelNo]);

  /* ─────────────────── build / update the map + labels ────────────────── */
  useEffect(() => {
    if (!geo) return;

    /* pick a map centre */
    let center: [number, number] = [50.55, 26.22];
    if (geo.properties.longitude && geo.properties.latitude) {
      center = [geo.properties.longitude, geo.properties.latitude];
    } else if (geo.geometry.type === "Polygon") {
      const c = geo.geometry.coordinates as number[][][];
      if (c?.[0]?.[0]) center = [c[0][0][0], c[0][0][1]];
    }

    /* ------------------------------------------------------------------ */
    /* 1. create / reuse the map                                          */
    /* ------------------------------------------------------------------ */
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: cont.current as HTMLElement,
        style: "mapbox://styles/mapbox/streets-v11",
        zoom: 16,
        center,
      });

      mapRef.current.on("load", () => {
        mapRef.current!.addSource("parcel", { type: "geojson", data: geo });
        mapRef.current!.addLayer({
          id: "fill",
          type: "fill",
          source: "parcel",
          paint: { "fill-color": "#0099ff", "fill-opacity": 0.4 },
        });
        mapRef.current!.addLayer({
          id: "outline",
          type: "line",
          source: "parcel",
          paint: { "line-color": "#003366", "line-width": 2 },
        });

        /* add measurement labels on first load */
        addMeasurementLayer(geo);
      });
    } else {
      /* update parcel and measurements */
      (mapRef.current.getSource("parcel") as mapboxgl.GeoJSONSource)?.setData(
        geo
      );
      mapRef.current.flyTo({ center, zoom: 16 });
      addMeasurementLayer(geo);
    }
  }, [geo]);

  /* -------------------------------------------------------------------- */
  /* helper: adds/refreshes length & area labels                          */
  /* -------------------------------------------------------------------- */
  const addMeasurementLayer = (feature: ParcelGeo) => {
    if (!mapRef.current || feature.geometry.type !== "Polygon") return;

    const ring = feature.geometry.coordinates[0] as number[][];
    const labels: GeoJSON.Feature[] = [];

    /* total area (m²) + centroid */
    const poly = turf.polygon([ring]);
    const area = turf.area(poly); // m²
    const centroid = turf.centroid(poly);
    labels.push({
      type: "Feature",
      geometry: centroid.geometry,
      properties: { label: `${area.toFixed(1)} m²` },
    });

    /* length of each edge (m) */
    for (let i = 0; i < ring.length - 1; i++) {
      const a = ring[i],
        b = ring[i + 1];
      const len = turf.distance(turf.point(a), turf.point(b), {
        units: "meters",
      });
      const mid: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

      labels.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: mid },
        properties: { label: `${len.toFixed(1)} m` },
      });
    }

    const labelFC: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: labels,
    };

    const srcId = "labels";
    if (mapRef.current.getSource(srcId)) {
      (mapRef.current.getSource(srcId) as mapboxgl.GeoJSONSource).setData(
        labelFC
      );
    } else {
      mapRef.current.addSource(srcId, { type: "geojson", data: labelFC });
      mapRef.current.addLayer({
        id: srcId,
        type: "symbol",
        source: srcId,
        layout: {
          "text-field": ["get", "label"],
          "text-size": 12,
          "text-anchor": "center",
        },
        paint: { "text-color": "#111", "text-halo-color": "#fff", "text-halo-width": 1 },
      });
    }
  };

  return (
    <Box sx={{ height: 300, borderRadius: 6, overflow: "hidden" }} ref={cont} />
  );
};

export default PropertyMap;
