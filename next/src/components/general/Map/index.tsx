"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { Box, styled, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Initialize Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

// Styled container for the map
const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const MapComponent: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null); // Ref to store the map instance
  const router = useRouter();

  const [totalProperties, setTotalProperties] = useState<number>(-1);

  useEffect(() => {
    // Function to fetch GeoJSON data
    const fetchGeoJSON = async () => {
      try {
        const response = await axios.get<GeoJSON.FeatureCollection<GeoJSON.Polygon>>(
          `${API_URL}/coordinates`, 
          { timeout: 95000 }
        );
        console.log("Fetched GeoJSON Data:", response.data); // Log the fetched GeoJSON data
        setTotalProperties(response.data.features.length);

        // Add ID to each feature; use `parcel_no` if it exists
        const dataWithIds = {
          ...response.data,
          features: response.data.features.map((feature, index) => ({
            ...feature,
            id: feature.properties?.parcel_no || `prop-${index}`, 
          })),
        };

        console.log("GeoJSON Data with IDs:", dataWithIds);
        return dataWithIds;
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
        return null;
      }
    };

    // Initialize the map
    const initializeMap = async () => {
      if (mapRef.current) return; // Don’t initialize if already initialized

      const geojsonData = await fetchGeoJSON();
      if (!geojsonData) return;

      // Create the map
      const map = new mapboxgl.Map({
        container: mapContainerRef.current as HTMLElement,
        style: "mapbox://styles/mapbox/streets-v11", 
        center: [50.55, 26.22], // Centered on Bahrain
        zoom: 10, 
        minZoom: 2,
      });

      mapRef.current = map;

      map.on("load", () => {
        console.log("Map loaded");

        // Add GeoJSON source
        map.addSource("properties", {
          type: "geojson",
          data: geojsonData,
        });

        // Fill layer
        map.addLayer({
          id: "polygons-layer",
          type: "fill",
          source: "properties",
          paint: {
            "fill-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "#FF5733", // Hover color
              "#888888", // Default fill
            ],
            "fill-opacity": 0.7,
          },
        });

        // Outline layer
        map.addLayer({
          id: "polygons-outline",
          type: "line",
          source: "properties",
          paint: {
            "line-color": "#333333",
            "line-width": 2,
          },
        });

        /**
         * Symbol layer for labeling parcels.
         * `minzoom` ensures labels only appear at or above this zoom level.
         */
        // map.addLayer({
        //   id: "parcel-labels",
        //   type: "symbol",
        //   source: "properties",
        //   minzoom: 14, // Only show labels when zoom >= 14
        //   layout: {
        //     "text-field": ["get", "parcel_no"], // Show parcel_no property
        //     "text-size": 14,
        //     "text-variable-anchor": ["center"], 
        //     "text-allow-overlap": true, 
        //   },
        //   paint: {
        //     "text-color": "#000000", // Black text
        //   },
        // });

        let hoveredParcelNo: string | null = null; 

        // Mouse enter on the polygons
        map.on("mouseenter", "polygons-layer", (e) => {
          if (e.features && e.features.length > 0) {
            const parcelNo = e.features[0].properties?.parcel_no;
            console.log("Mouse entered parcel:", parcelNo);

            if (parcelNo) {
              // Remove hover from previous if different
              if (hoveredParcelNo && hoveredParcelNo !== parcelNo) {
                map.setFeatureState(
                  { source: "properties", id: hoveredParcelNo },
                  { hover: false }
                );
              }
              // Set new hover
              hoveredParcelNo = parcelNo;
              map.setFeatureState(
                { source: "properties", id: parcelNo },
                { hover: true }
              );
            }
            map.getCanvas().style.cursor = "pointer";
          }
        });

        // Mouse move over polygons
        map.on("mousemove", "polygons-layer", (e) => {
          if (e.features && e.features.length > 0) {
            const parcelNo = e.features[0].properties?.parcel_no;
            if (parcelNo) {
              if (hoveredParcelNo && hoveredParcelNo !== parcelNo) {
                map.setFeatureState(
                  { source: "properties", id: hoveredParcelNo },
                  { hover: false }
                );
              }
              if (hoveredParcelNo !== parcelNo) {
                map.setFeatureState(
                  { source: "properties", id: parcelNo },
                  { hover: true }
                );
                hoveredParcelNo = parcelNo;
              }
            }
            map.getCanvas().style.cursor = "pointer";
          }
        });

        // Mouse leaves polygons
        map.on("mouseleave", "polygons-layer", () => {
          if (hoveredParcelNo) {
            map.setFeatureState(
              { source: "properties", id: hoveredParcelNo },
              { hover: false }
            );
            hoveredParcelNo = null;
          }
          map.getCanvas().style.cursor = "";
        });

        // Click on polygons
        map.on("click", "polygons-layer", (e) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const parcelNo = feature.properties?.parcel_no;
            if (parcelNo) {
              console.log(`Clicked on parcel: ${parcelNo}`);
              window.open(`/parcel/${parcelNo}`);
            } else {
              console.warn("Parcel number is undefined for the clicked feature.");
            }
          }
        });
      });
    };

    initializeMap();

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [router]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Bahrain Properties Map
      </Typography>
      <Box
        ref={mapContainerRef}
        sx={{
          width: "80vw",
          height: "80vh",
          border: "2px solid #ccc",
          borderRadius: "8px",
          boxShadow: 3,
        }}
      />
      <Typography variant="body1" mt={2}>
        Total properties: {totalProperties}
      </Typography>
    </Container>
  );
};

export default MapComponent;
