"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import type {
  Feature,
  Geometry,
  GeoJsonProperties,
  FeatureCollection,
} from "geojson";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
const API = process.env.NEXT_PUBLIC_API_URL!;

/* ──────────────────────────────────────────────────────────────── */
/* Types                                                           */
/* ──────────────────────────────────────────────────────────────── */
interface ParcelGeo extends Feature<Geometry, GeoJsonProperties> {
  properties: {
    parcel_no: string;
    longitude?: number;
    latitude?: number;
    [k: string]: any;
  };
}

interface Props {
  parcelNo: string;
}

/* ──────────────────────────────────────────────────────────────── */
/* Tunables                                                        */
/* ──────────────────────────────────────────────────────────────── */
const PAD = 80;                // FitBounds padding (larger => more zoomed out)
const ZOOM_BIAS = -0.7;        // Apply after fitBounds (negative => zoom out)
const NEIGHBOR_BUFFER_KM = 0.05; // Buffer for fallback neighbor context (~180m)

/* ──────────────────────────────────────────────────────────────── */
/* Component                                                       */
/* ──────────────────────────────────────────────────────────────── */
const PropertyMap: React.FC<Props> = ({ parcelNo }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [geo, setGeo] = useState<ParcelGeo | null>(null);
  const [neighbors, setNeighbors] = useState<FeatureCollection | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDownloadToast, setShowDownloadToast] = useState(false);

  // derived
  const derivedBoundsRef = useRef<mapboxgl.LngLatBoundsLike | null>(null);
  const derivedCenterRef = useRef<[number, number] | null>(null);

  /* ───────── fetch parcel GeoJSON feature ───────── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`${API}/parcelData/geo/${parcelNo}`, {
          credentials: "include",
        });
        if (!r.ok) throw new Error("Parcel not found");
        const d: ParcelGeo = await r.json();
        if (!cancelled) setGeo(d);
      } catch (e) {
        console.error("Failed to fetch parcel geo:", e);
        if (!cancelled) setGeo(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [parcelNo]);

  /* ───────── try to fetch real neighbors; fallback handled in map ───────── */
  useEffect(() => {
    if (!geo) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`${API}/parcelData/around/${parcelNo}`, {
          credentials: "include",
        });
        if (!r.ok) throw new Error("No neighbors endpoint");
        const fc: FeatureCollection = await r.json();
        if (!cancelled) setNeighbors(fc);
      } catch {
        if (!cancelled) setNeighbors(null); // fallback to vector-tiles
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [geo, parcelNo]);

  /* ───────── fullscreen listener ───────── */
  useEffect(() => {
    const onFsChange = () => {
      const fsEl = document.fullscreenElement;
      const nowFs = !!fsEl && fsEl === wrapperRef.current;
      setIsFullscreen(nowFs);
      setTimeout(() => mapRef.current?.resize(), 120);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  /* ───────── initialize/update map + layers ───────── */
  useEffect(() => {
    if (!geo || !containerRef.current) return;

    // derive center & bounds
    const deriveCenterAndBounds = () => {
      let center: [number, number] | null = null;
      if (geo.properties.longitude && geo.properties.latitude) {
        center = [geo.properties.longitude, geo.properties.latitude];
      } else {
        try {
          const ctd = turf.centroid(geo as turf.AllGeoJSON);
          center = (ctd.geometry?.coordinates ?? null) as [number, number] | null;
        } catch {
          center = null;
        }
      }
      derivedCenterRef.current = center;

      try {
        const [minX, minY, maxX, maxY] = turf.bbox(geo as turf.AllGeoJSON);
        derivedBoundsRef.current = [
          [minX, minY],
          [maxX, maxY],
        ] as mapboxgl.LngLatBoundsLike;
      } catch {
        derivedBoundsRef.current = null;
      }
    };

    deriveCenterAndBounds();

    const ensureLayers = (map: mapboxgl.Map) => {
      if (!map.isStyleLoaded()) {
        map.once("styledata", () => ensureLayers(map));
        return;
      }

      // 1) Parcel source
      if (!map.getSource("parcel")) {
        map.addSource("parcel", { type: "geojson", data: geo });
      } else {
        (map.getSource("parcel") as mapboxgl.GeoJSONSource).setData(geo);
      }

      // 2) Parcel layers (top)
      if (!map.getLayer("parcel-fill")) {
        map.addLayer({
          id: "parcel-fill",
          type: "fill",
          source: "parcel",
          paint: { "fill-color": "#0099ff", "fill-opacity": 0.35 },
        });
      }
      if (!map.getLayer("parcel-outline")) {
        map.addLayer({
          id: "parcel-outline",
          type: "line",
          source: "parcel",
          paint: { "line-color": "#003366", "line-width": 2 },
        });
      }

      // 3) Optional API-provided neighbors (under parcel)
      if (neighbors) {
        if (!map.getSource("neighbors-geo")) {
          map.addSource("neighbors-geo", { type: "geojson", data: neighbors });
        } else {
          (map.getSource("neighbors-geo") as mapboxgl.GeoJSONSource).setData(
            neighbors
          );
        }
        if (!map.getLayer("neighbors-geo-fill")) {
          map.addLayer(
            {
              id: "neighbors-geo-fill",
              type: "fill",
              source: "neighbors-geo",
              paint: { "fill-color": "#000000", "fill-opacity": 0.06 },
            },
            "parcel-fill" // place just beneath parcel
          );
        }
        if (!map.getLayer("neighbors-geo-outline")) {
          map.addLayer(
            {
              id: "neighbors-geo-outline",
              type: "line",
              source: "neighbors-geo",
              paint: { "line-color": "#888", "line-width": 1 },
            },
            "parcel-fill"
          );
        }
      } else {
        // Remove API neighbors if previously added
        if (map.getLayer("neighbors-geo-outline"))
          map.removeLayer("neighbors-geo-outline");
        if (map.getLayer("neighbors-geo-fill"))
          map.removeLayer("neighbors-geo-fill");
        if (map.getSource("neighbors-geo")) map.removeSource("neighbors-geo");
      }

      // 4) Fallback neighbors from vector tiles (Mapbox Streets)
      //    Filter to a buffer around the parcel geometry.
      const searchArea = turf.buffer(
        geo as Feature<Geometry, GeoJsonProperties>, // ◀ precise typing fixes Turf overload error
        NEIGHBOR_BUFFER_KM,
        { units: "kilometers" }
      );
      const withinExpr: any = ["within", (searchArea as any).geometry];

      if (!map.getLayer("neighbors-vtiles")) {
        map.addLayer(
          {
            id: "neighbors-vtiles",
            type: "fill",
            source: "composite",
            "source-layer": "building",
            paint: { "fill-color": "#000000", "fill-opacity": 0.06 },
          },
          "parcel-fill"
        );
      }
      map.setFilter("neighbors-vtiles", withinExpr);

      if (!map.getLayer("neighbors-vtiles-outline")) {
        map.addLayer(
          {
            id: "neighbors-vtiles-outline",
            type: "line",
            source: "composite",
            "source-layer": "building",
            paint: { "line-color": "#8a8a8a", "line-width": 0.8 },
          },
          "parcel-fill"
        );
      }
      map.setFilter("neighbors-vtiles-outline", withinExpr);

      // 5) Measurement labels (area in center + edge lengths)
      addMeasurementLayer(map, geo);

      // 6) Fit view (slightly zoomed out)
      if (derivedBoundsRef.current) {
        map.fitBounds(derivedBoundsRef.current, { padding: PAD, duration: 0 });
        map.setZoom(map.getZoom() + ZOOM_BIAS);
      } else if (derivedCenterRef.current) {
        map.jumpTo({ center: derivedCenterRef.current, zoom: 15.7 });
      }
    };

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: containerRef.current as HTMLElement,
        style: "mapbox://styles/mapbox/streets-v11",
        zoom: 16,
        center: derivedCenterRef.current ?? [50.55, 26.22],
        attributionControl: true,
      });

      mapRef.current.on("load", () => {
        const map = mapRef.current!;
        ensureLayers(map);
      });
    } else {
      ensureLayers(mapRef.current as mapboxgl.Map);
    }
  }, [geo, neighbors]);

  /* ───────── helpers ───────── */

  const addMeasurementLayer = (map: mapboxgl.Map, feature: ParcelGeo) => {
    const fc: FeatureCollection = { type: "FeatureCollection", features: [] };

    const flat = turf.flatten(feature as unknown as turf.AllGeoJSON);
    flat.features.forEach((f) => {
      if (f.geometry.type !== "Polygon") return;
      const ring = (f.geometry.coordinates?.[0] ?? []) as number[][];
      if (ring.length < 2) return;

      // Area label (centroid)
      const poly = turf.polygon([ring]);
      const area = turf.area(poly); // m²
      const centroid = turf.centroid(poly);
      fc.features.push({
        type: "Feature",
        geometry: centroid.geometry,
        properties: { label: `${area.toFixed(1)} m²` },
      });

      // Each edge length
      for (let i = 0; i < ring.length - 1; i++) {
        const a = ring[i];
        const b = ring[i + 1];
        const len = turf.distance(turf.point(a), turf.point(b), {
          units: "meters",
        });
        const mid: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

        fc.features.push({
          type: "Feature",
          geometry: { type: "Point", coordinates: mid },
          properties: { label: `${len.toFixed(1)} m` },
        });
      }
    });

    if (map.getSource("labels")) {
      (map.getSource("labels") as mapboxgl.GeoJSONSource).setData(fc);
    } else {
      map.addSource("labels", { type: "geojson", data: fc });
      map.addLayer({
        id: "labels",
        type: "symbol",
        source: "labels",
        layout: {
          "text-field": ["get", "label"],
          "text-size": 12,
          "text-anchor": "center",
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": "#111",
          "text-halo-color": "#fff",
          "text-halo-width": 1,
        },
      });
    }
  };

  const fitToParcel = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    if (derivedBoundsRef.current) {
      map.fitBounds(derivedBoundsRef.current, { padding: PAD, duration: 300 });
      map.setZoom(map.getZoom() + ZOOM_BIAS);
    } else if (derivedCenterRef.current) {
      map.flyTo({ center: derivedCenterRef.current, zoom: 15.7 });
    }
  }, []);

  const zoomIn = () => {
    const map = mapRef.current;
    if (!map) return;
    map.zoomIn();
  };

  const zoomOut = () => {
    const map = mapRef.current;
    if (!map) return;
    map.zoomOut();
  };

  const openGoogleMaps = () => {
    const map = mapRef.current;
    const c =
      derivedCenterRef.current ??
      (map ? [map.getCenter().lng, map.getCenter().lat] : null);
    if (!c) return;
    const [lng, lat] = c;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const exportImage = async () => {
    const map = mapRef.current;
    if (!map) return;

    const doExport = (m: mapboxgl.Map) => {
      try {
        const dataURL = m.getCanvas().toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = `parcel-${parcelNo}.png`;
        a.click();

        setShowDownloadToast(true);
        setTimeout(() => setShowDownloadToast(false), 2200);
      } catch (e) {
        console.error("Export failed:", e);
      }
    };

    // ensure framing before export
    if (derivedBoundsRef.current) {
      map.fitBounds(derivedBoundsRef.current, { padding: PAD, duration: 0 });
      map.setZoom(map.getZoom() + ZOOM_BIAS);
      map.once("idle", () => {
        const m = mapRef.current;
        if (m) doExport(m);
      });
    } else {
      doExport(map);
    }
  };

  const toggleFullscreen = () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else if (document.fullscreenElement === el) {
      document.exitFullscreen?.();
    } else {
      el.requestFullscreen?.();
    }
  };

  /* ───────── render ───────── */
  return (
    <div ref={wrapperRef} className="map-wrapper">
      {/* Controls */}
      <div className="map-controls">
        {/* Left: always visible */}
        <div className="ctrl-group left">
          <button className="btn-chip" onClick={openGoogleMaps} title="Open in Google Maps">
            Open in Google Maps
          </button>
          <button
            className="btn-clear"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? "⤫" : "⛶"}
          </button>
        </div>

        {/* Right: only visible when fullscreen */}
        {isFullscreen && (
          <div className="ctrl-group right">
            <button className="btn-clear" onClick={fitToParcel} title="Fit to parcel">
              ⤢
            </button>
            <button className="btn-clear" onClick={zoomIn} title="Zoom in">
              ＋
            </button>
            <button className="btn-clear" onClick={zoomOut} title="Zoom out">
              －
            </button>
            <button className="btn-clear btn-download" onClick={exportImage} title="Export PNG">
              ⤓
            </button>
          </div>
        )}
      </div>

      {/* Map container */}
      <div ref={containerRef} className="map-container" />

      {/* Download toast */}
      {showDownloadToast && <div className="dl-toast">Download ready</div>}

      {/* Styles */}
      <style jsx>{`
        .map-wrapper {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background: #f8f9fa;
          height: 300px;
        }
        .map-container {
          position: absolute;
          inset: 0;
        }
        .map-controls {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          pointer-events: none; /* allow map drag */
        }
        .ctrl-group {
          display: flex;
          gap: 8px;
          pointer-events: auto;
          background: rgba(0, 0, 0, 0.25);
          padding: 6px;
          border-radius: 10px;
          backdrop-filter: blur(2px);
        }
        .btn-clear {
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.8);
          background: rgba(0, 0, 0, 0.25);
          color: #fff;
          border-radius: 8px;
          width: 36px;
          height: 36px;
          font-size: 16px;
          line-height: 36px;
          text-align: center;
          cursor: pointer;
        }
        .btn-clear:hover {
          background: rgba(0, 0, 0, 0.4);
        }
        .btn-download {
          font-size: 22px; /* bigger download icon */
          width: 40px;
          height: 40px;
          line-height: 40px;
        }
        .btn-chip {
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.95);
          color: #222;
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 13px;
          cursor: pointer;
        }
        .btn-chip:hover {
          background: #fff;
        }
        .dl-toast {
          position: absolute;
          right: 12px;
          bottom: 12px;
          background: rgba(0, 0, 0, 0.8);
          color: #fff;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 13px;
          z-index: 3;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default PropertyMap;
