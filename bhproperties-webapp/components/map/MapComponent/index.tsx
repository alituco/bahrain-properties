"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { Box, styled } from "@mui/material";
import ValuationHover from "../ValuationHover";
import FirmPropertyHover from "../FirmPropertyHover";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
  width: "100%",
}));

interface MapComponentProps {
  statusFilter: string; // "all" | "sold" | "listed" | ...
}

type PropertyFeature = GeoJSON.Feature<
  GeoJSON.Polygon,
  {
    parcel_no: string;
    status?: string;
    asking_price?: number;
    sold_price?: number;
    firm_saved?: boolean;
  }
>;

export default function MapComponent({ statusFilter }: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // tooltip state ------------------------------------------------------------
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [hoverFeature, setHoverFeature] =
    useState<PropertyFeature | null>(null);

  // --------------------------------------------------------------------------
  function removeMap() {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  }

  useEffect(() => {
    // ------------------------------------------------------------------------
    async function fetchGeoJSON() {
      try {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.append("status", statusFilter);

        const { data } = await axios.get(
          `${API_URL}/firm-properties/geojson?${params.toString()}`,
          { withCredentials: true, timeout: 60000 }
        );

        if (!data?.features) return null;

        return {
          ...data,
          features: data.features.map(
            (f: PropertyFeature, i: number) => ({ ...f, id: f.properties?.parcel_no || i }) // ensure unique id
          ),
        };
      } catch (err) {
        console.error("Error fetching GeoJSON:", err);
        return null;
      }
    }

    // ------------------------------------------------------------------------
    async function render() {
      const geojson = await fetchGeoJSON();
      if (!geojson) {
        removeMap();
        return;
      }

      // first load -----------------------------------------------------------
      if (!mapRef.current) {
        const map = new mapboxgl.Map({
          container: mapContainerRef.current as HTMLElement,
          style: "mapbox://styles/mapbox/streets-v11",
          attributionControl: false,
          center: [50.55, 26.22],
          zoom: 10,
        });
        mapRef.current = map;

        map.on("load", () => {
          map.addSource("properties", { type: "geojson", data: geojson });

          // coloured polygons by status
          map.addLayer({
            id: "polygons",
            type: "fill",
            source: "properties",
            paint: {
              "fill-color": [
                "match",
                ["get", "status"],
                "sold",
                "#2ecc71",
                "listed",
                "#3498db",
                "paperwork",
                "#f39c12",
                /* default */ "#e74c3c",
              ],
              "fill-opacity": 0.65,
            },
          });

          map.addLayer({
            id: "polygons-outline",
            type: "line",
            source: "properties",
            paint: {
              "line-color": "#2c3e50",
              "line-width": 1,
            },
          });

          // hover ------------------------------------------------------------
          map.on("mousemove", "polygons", (e) => {
            const f = e.features?.[0] as mapboxgl.MapboxGeoJSONFeature | void;
            if (!f) return;
            setHoverPos({ x: e.point.x, y: e.point.y });
            setHoverFeature(f as unknown as PropertyFeature);
            map.getCanvas().style.cursor = "pointer";
          });

          map.on("mouseleave", "polygons", () => {
            setHoverPos(null);
            setHoverFeature(null);
            map.getCanvas().style.cursor = "";
          });

          // click -----------------------------------------------------------
          map.on("click", "polygons", (e) => {
            const f = e.features?.[0];
            const parcelNo = f?.properties?.parcel_no;
            if (parcelNo) window.open(`/parcel/${parcelNo}`, "_self");
          });
        });
      } else {
        // map already created – just swap data
        const src = mapRef.current.getSource("properties") as mapboxgl.GeoJSONSource;
        if (src) src.setData(geojson);
      }
    }

    render();
    return () => removeMap(); // clean up on unmount
  }, [statusFilter]);

  // --------------------------------------------------------------------------
  return (
    <Container>
      <Box
        ref={mapContainerRef}
        sx={{
          width: "100%",
          height: "600px",
          border: "2px solid #ccc",
          borderRadius: "8px",
          boxShadow: 3,
          position: "relative",
        }}
      />

      {/* simple hover tooltip (adjust as needed) */}
      {hoverPos && hoverFeature && (
        <ValuationHover
          x={hoverPos.x}
          y={hoverPos.y}
          parcelNo={hoverFeature.properties.parcel_no}
          valuationType={undefined}
          valuationAmount={hoverFeature.properties?.sold_price}
          valuationDate={undefined}
        />
      )}
    </Container>
  );
}
