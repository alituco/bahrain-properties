"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { Box, styled, Typography } from "@mui/material";
import ValuationHover from "./ValuationHover"; // <— Our new component

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

// Props for optional filters
interface MapComponentProps {
  blockNoFilter?: string;
  areaNameFilter?: string;
}

// A simple interface for storing hovered valuation info
interface HoverValuation {
  parcelNo: string;
  valuationType?: string;
  valuationAmount?: number;
  valuationDate?: string;
}

// Our main React component
const MapComponent: React.FC<MapComponentProps> = ({
  blockNoFilter = "",
  areaNameFilter = "",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Track total properties
  const [totalProperties, setTotalProperties] = useState<number>(-1);

  // State to track hover location + valuation details
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverValuation, setHoverValuation] = useState<HoverValuation | null>(null);

  useEffect(() => {
    // 1) FETCH THE GEOJSON
    const fetchGeoJSON = async () => {
      try {
        const params = new URLSearchParams();
        if (blockNoFilter) params.append("block_no", blockNoFilter);
        if (areaNameFilter) params.append("area_namee", areaNameFilter);

        const response = await axios.get(`${API_URL}/coordinates?${params.toString()}`, {
          timeout: 950000000,
        });
        const geojson = response.data;
        console.log("Fetched GeoJSON Data:", geojson);

        if (geojson && geojson.features) {
          setTotalProperties(geojson.features.length);

          // Add ID to each feature
          const dataWithIds = {
            ...geojson,
            features: geojson.features.map((feature: any, index: number) => ({
              ...feature,
              id: feature.properties?.parcel_no || `prop-${index}`,
            })),
          };

          return dataWithIds;
        }
        return null;
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
        return null;
      }
    };

    // 2) INIT OR UPDATE THE MAP
    const initializeMap = async () => {
      const geojsonData = await fetchGeoJSON();
      if (!geojsonData) {
        // If no data, clear or remove map
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
        return;
      }

      if (!mapRef.current) {
        // CREATE A NEW MAP
        const map = new mapboxgl.Map({
          container: mapContainerRef.current as HTMLElement,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [50.55, 26.22],
          zoom: 10,
          minZoom: 2,
        });

        mapRef.current = map;

        map.on("load", () => {
          console.log("Map loaded");

          // Add source
          map.addSource("properties", {
            type: "geojson",
            data: geojsonData,
          });

          // Polygons layer
          map.addLayer({
            id: "polygons-layer",
            type: "fill",
            source: "properties",
            paint: {
              "fill-color": [
                "case",
                // If hovered
                ["boolean", ["feature-state", "hover"], false], "#FF5733",
                // If valuation_amount is null => gray
                ["==", ["get", "valuation_amount"], null], "#888888",
                // Else => red
                "#FF0000",
              ],
              "fill-opacity": 0.7,
            },
          });

          // Outline
          map.addLayer({
            id: "polygons-outline",
            type: "line",
            source: "properties",
            paint: {
              "line-color": "#333333",
              "line-width": 2,
            },
          });

          // HOVER LOGIC
          let hoveredParcelNo: string | null = null;

          map.on("mousemove", "polygons-layer", (e) => {
            if (e.features && e.features.length > 0) {
              const feature = e.features[0];
              const parcelNo = feature.properties?.parcel_no;
              const valuationAmount = feature.properties?.valuation_amount;
              const valuationType = feature.properties?.valuation_type;
              const valuationDate = feature.properties?.valuation_date;

              // Show MUI popup if there's a valuation
              if (valuationAmount) {
                setHoverPos({ x: e.point.x, y: e.point.y });
                setHoverValuation({
                  parcelNo,
                  valuationType,
                  valuationAmount,
                  valuationDate,
                });
              } else {
                // if no valuation, clear the popup
                setHoverPos(null);
                setHoverValuation(null);
              }

              // Hover color logic
              if (parcelNo) {
                if (hoveredParcelNo && hoveredParcelNo !== parcelNo) {
                  map.setFeatureState(
                    { source: "properties", id: hoveredParcelNo },
                    { hover: false }
                  );
                }
                hoveredParcelNo = parcelNo;
                map.setFeatureState({ source: "properties", id: parcelNo }, { hover: true });
              }

              map.getCanvas().style.cursor = "pointer";
            }
          });

          map.on("mouseleave", "polygons-layer", () => {
            if (hoveredParcelNo) {
              map.setFeatureState(
                { source: "properties", id: hoveredParcelNo },
                { hover: false }
              );
              hoveredParcelNo = null;
            }
            // Hide the popup
            setHoverPos(null);
            setHoverValuation(null);
            map.getCanvas().style.cursor = "";
          });

          // CLICK LOGIC
          map.on("click", "polygons-layer", (e) => {
            if (e.features && e.features.length > 0) {
              const feature = e.features[0];
              const parcelNo = feature.properties?.parcel_no;
              if (parcelNo) {
                console.log(`Clicked on parcel: ${parcelNo}`);
                window.open(`/parcel/${parcelNo}`);
              }
            }
          });
        });
      } else {
        // Map already exists, just update the data
        const map = mapRef.current;
        const source = map.getSource("properties") as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData(geojsonData);
        }
      }
    };

    initializeMap();

    // CLEANUP
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [blockNoFilter, areaNameFilter]);

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Bahrain Properties Map
      </Typography>

      {/* Map container */}
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

      <Typography variant="body1" mt={2}>
        Total properties: {totalProperties}
      </Typography>

      {/* Render the MUI popup only if we have a hovered valuation */}
      {hoverPos && hoverValuation && (
        <ValuationHover
          x={hoverPos.x}
          y={hoverPos.y}
          parcelNo={hoverValuation.parcelNo}
          valuationType={hoverValuation.valuationType}
          valuationAmount={hoverValuation.valuationAmount}
          valuationDate={hoverValuation.valuationDate}
        />
      )}
    </Container>
  );
};

export default MapComponent;
