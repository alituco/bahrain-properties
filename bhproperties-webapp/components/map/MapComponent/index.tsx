"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { Box, styled } from "@mui/material";
import { MapFilters } from "../MapContainer";
import FirmPropertyHover from "../FirmPropertyHover";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const Wrapper = styled(Box)({ width: "100%", position: "relative" });

interface Props extends MapFilters {
  flyTo?: { lat: number; lon: number } | null;
  savedOnly?: boolean;
}

type FeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Geometry, any>;

export default function MapComponent({
  status,
  block,
  area,
  governorate,
  minSize,
  maxSize,
  flyTo,
  savedOnly,
}: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [loading, setLoading] = useState(true);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [hover, setHover] = useState<{ status?: string; parcel?: string } | null>(null);

  const qs = () => {
    const p = new URLSearchParams();
    if (status && status !== "all") p.append("status", status);
    if (block) p.append("block_no", block);
    if (area) p.append("area_namee", area);
    if (governorate) p.append("min_min_go", governorate);
    if (minSize) p.append("minSize", minSize);
    if (maxSize) p.append("maxSize", maxSize);
    return p.toString();
  };

  const fetchGeo = async (): Promise<FeatureCollection> => {
    const endpoint = savedOnly ? "firm-properties/geojson" : "coordinates";
    const { data } = await axios.get(`${API_URL}/${endpoint}?${qs()}`, {
      withCredentials: true,
    });

    // Ensure features have stable ids
    const features = (data.features || []).map((f: any, i: number) => ({
      ...f,
      id:
        f.id ??
        f.properties?.parcel_no ??
        `${f.properties?.property_type || "feat"}-${f.properties?.fp_id ?? i}`,
    }));

    return { type: "FeatureCollection", features };
  };

  const ensureLayers = (map: mapboxgl.Map, data: FeatureCollection) => {
    // Source
    if (!map.getSource("props")) {
      map.addSource("props", { type: "geojson", data });
    }

    // Land fill (polygons only)
    if (!map.getLayer("poly")) {
      map.addLayer({
        id: "poly",
        type: "fill",
        source: "props",
        filter: ["in", ["geometry-type"], ["literal", ["Polygon", "MultiPolygon"]]],
        paint: {
          "fill-color": [
            "case",
            ["==", ["get", "firm_saved"], true],
            "#0ea5e9", // saved by firm
            "#9c27b0", // fallback (if ever used)
          ],
          "fill-opacity": 0.45,
        },
      });
    }

    // Polygon outline
    if (!map.getLayer("outline")) {
      map.addLayer({
        id: "outline",
        type: "line",
        source: "props",
        filter: ["in", ["geometry-type"], ["literal", ["Polygon", "MultiPolygon"]]],
        paint: { "line-color": "#0b5aa7", "line-width": 1.2 },
      });
    }

    // Points (apartments/houses)
    if (!map.getLayer("points")) {
      map.addLayer({
        id: "points",
        type: "circle",
        source: "props",
        filter: ["in", ["geometry-type"], ["literal", ["Point", "MultiPoint"]]],
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8,
            6,
            12,
            10,
            16,
            14,
          ],
          "circle-color": [
            "match",
            ["get", "property_type"],
            "apartment",
            "#f59e0b",
            "house",
            "#10b981",
            /* other */ "#64748b",
          ],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 0.5,
          "circle-opacity": 0.9,
        },
      });
    }
  };

  const bindInteractions = (map: mapboxgl.Map) => {
    // Click polygon → open land details
    map.on("click", "poly", (e) => {
      const f: any = e.features?.[0];
      const parcel = f?.properties?.parcel_no;
      if (parcel) window.open(`/dashboard/property/${parcel}`, "_self");
    });

    // Click point → open apartment/house details
    map.on("click", "points", (e) => {
      const f: any = e.features?.[0];
      const type = f?.properties?.property_type;
      const id = f?.properties?.fp_id;
      if (!type || !id) return;
      if (type === "apartment") window.open(`/dashboard/apartment/${id}`, "_self");
      else if (type === "house") window.open(`/dashboard/house/${id}`, "_self");
    });

    // Hover polygon
    map.on("mousemove", "poly", (e) => {
      const f: any = e.features?.[0];
      const saved = f?.properties?.firm_saved;
      if (saved) {
        setHoverPos({ x: e.point.x, y: e.point.y });
        setHover({ status: f.properties?.status, parcel: f.properties?.parcel_no });
      } else {
        setHoverPos(null);
        setHover(null);
      }
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "poly", () => {
      setHoverPos(null);
      setHover(null);
      map.getCanvas().style.cursor = "";
    });

    // Hover point
    map.on("mousemove", "points", (e) => {
      const f: any = e.features?.[0];
      setHoverPos({ x: e.point.x, y: e.point.y });
      const label =
        f?.properties?.parcel_no ||
        `${f?.properties?.property_type || "unit"} #${f?.properties?.fp_id}`;
      setHover({ status: f?.properties?.status, parcel: label });
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "points", () => {
      setHoverPos(null);
      setHover(null);
      map.getCanvas().style.cursor = "";
    });
  };

  const refresh = async () => {
    setLoading(true);
    const geo = await fetchGeo();

    if (!mapRef.current && mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [50.55, 26.22],
        zoom: 10,
      });
      mapRef.current = map;

      map.on("load", () => {
        ensureLayers(map, geo);
        bindInteractions(map);
        setLoading(false);
      });
    } else if (mapRef.current) {
      const src = mapRef.current.getSource("props") as mapboxgl.GeoJSONSource | undefined;
      if (src) src.setData(geo);
      else {
        // In case style was reloaded
        ensureLayers(mapRef.current, geo);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, block, area, governorate, minSize, maxSize, savedOnly]);

  useEffect(() => {
    if (flyTo && mapRef.current) {
      mapRef.current.flyTo({ center: [flyTo.lon, flyTo.lat], zoom: 17, essential: true });
    }
  }, [flyTo]);

  return (
    <Wrapper ref={mapContainer} sx={{ borderRadius: 8, overflow: "hidden", pl: 2, pr: 2 }}>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(2px)",
            zIndex: 5,
          }}
        >
          <img src="/assets/images/media/loader.svg" width={48} height={48} alt="Loading…" />
        </Box>
      )}

      {hoverPos && hover && (
        <FirmPropertyHover
          x={hoverPos.x}
          y={hoverPos.y}
          savedByFirm
          status={hover.status}
          parcelNo={hover.parcel}
        />
      )}
    </Wrapper>
  );
}
