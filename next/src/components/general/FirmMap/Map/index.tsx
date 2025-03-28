"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Box, styled, Typography } from "@mui/material";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
  minHeight: "100vh",
}));

export default function FirmPropertiesMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [totalProperties, setTotalProperties] = useState<number>(0);

  // On mount, fetch the geojson of only firm-saved properties
  useEffect(() => {
    const fetchFirmPropertiesGeojson = async () => {
      try {
        const res = await fetch(`${API_URL}/firm-properties/geojson`, {
          credentials: "include", // to include cookies for auth
        });
        const geojson = await res.json();
        console.log("Firm-saved properties geojson:", geojson);

        // If no features or it’s an error, skip
        if (!geojson || !geojson.features) {
          return null;
        }
        setTotalProperties(geojson.features.length);
        return geojson;
      } catch (error) {
        console.error("Error fetching firm properties geojson:", error);
        return null;
      }
    };

    // Initialize or update the map
    const initializeMap = async () => {
      const geojsonData = await fetchFirmPropertiesGeojson();
      if (!geojsonData) {
        // If no data, remove map or do nothing
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
        return;
      }

      // If map not created, create it
      if (!mapRef.current) {
        const map = new mapboxgl.Map({
          container: mapContainerRef.current as HTMLElement,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [50.55, 26.22],
          zoom: 10,
          minZoom: 2,
        });
        mapRef.current = map;

        map.on("load", () => {
          map.addSource("firmProperties", {
            type: "geojson",
            data: geojsonData,
          });

          // Polygons layer
          map.addLayer({
            id: "firm-polygons-layer",
            type: "fill",
            source: "firmProperties",
            paint: {
              // color everything in blue
              "fill-color": "#0000FF",
              "fill-opacity": 0.7,
            },
          });

          // Outline
          map.addLayer({
            id: "firm-polygons-outline",
            type: "line",
            source: "firmProperties",
            paint: {
              "line-color": "#333333",
              "line-width": 2,
            },
          });

          // If you want click => route to /parcel/xxx
          map.on("click", "firm-polygons-layer", (e) => {
            if (e.features && e.features.length > 0) {
              const feature = e.features[0];
              const parcelNo = feature.properties?.parcel_no;
              if (parcelNo) {
                window.open(`/parcel/${parcelNo}`, "_self");
              }
            }
          });
        });
      } else {
        const map = mapRef.current;
        const source = map.getSource("firmProperties") as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData(geojsonData);
        }
      }
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Firm Properties
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Total saved: {totalProperties}
      </Typography>
      <Box
        ref={mapContainerRef}
        sx={{
          width: "80vw",
          height: "80vh",
          border: "2px solid #ccc",
          borderRadius: "8px",
          boxShadow: 3,
          position: "relative",
        }}
      />
    </Container>
  );
}
