"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { Box, styled, Typography } from "@mui/material";
import ValuationHover from "./ValuationHover";
import FirmPropertyHover from "./FirmPropertyHover";

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

export interface MapComponentProps {
  blockNoFilter?: string;
  areaNameFilter?: string;
  governorateFilter?: string;
}

type PropertyFeature = GeoJSON.Feature<
  GeoJSON.Polygon,
  {
    parcel_no?: string;
    valuation_date?: string;
    valuation_type?: string;
    valuation_amount?: number;
    firm_saved?: boolean;
  }
>;

interface HoverValuation {
  parcelNo: string;
  valuationType?: string;
  valuationAmount?: number;
  valuationDate?: string;
}

interface HoverFirmProp {
  // e.g., status, asking_price, etc., if you add those to your GeoJSON
  status?: string;
  savedByFirm?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({
  blockNoFilter = "",
  areaNameFilter = "",
  governorateFilter = "",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [totalProperties, setTotalProperties] = useState<number>(0);

  // For valuation popups
  const [hoverValuationPos, setHoverValuationPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverValuation, setHoverValuation] = useState<HoverValuation | null>(null);

  // For firm-property popups
  const [hoverFirmPos, setHoverFirmPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverFirmProp, setHoverFirmProp] = useState<HoverFirmProp | null>(null);

  // Clears the map if it exists
  const removeExistingMap = () => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  };

  useEffect(() => {
    const noFiltersProvided = !blockNoFilter && !areaNameFilter && !governorateFilter;
    if (noFiltersProvided) {
      setTotalProperties(0);
      removeExistingMap();
      return;
    }

    // 1) FETCH the GeoJSON from your /coordinates endpoint
    const fetchGeoJSON = async () => {
      try {
        const params = new URLSearchParams();
        if (blockNoFilter) params.append("block_no", blockNoFilter);
        if (areaNameFilter) params.append("area_namee", areaNameFilter);
        if (governorateFilter) params.append("min_min_go", governorateFilter);

        const response = await axios.get(`${API_URL}/coordinates?${params.toString()}`, {
          timeout: 90000,
          withCredentials: true,
        });
        const geojson = response.data;
        console.log("Fetched GeoJSON Data:", geojson);

        if (geojson && geojson.features) {
          setTotalProperties(geojson.features.length);

          // Add unique ID for the Mapbox feature-state usage
          const dataWithIds = {
            ...geojson,
            features: geojson.features.map((feature: PropertyFeature, index: number) => ({
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

    // 2) INIT or UPDATE the map
    const initializeMap = async () => {
      const geojsonData = await fetchGeoJSON();
      if (!geojsonData) {
        removeExistingMap();
        return;
      }

      // If no map currently, create a new one
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
          // Add our data source
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
                // If hovered => orange
                ["boolean", ["feature-state", "hover"], false],
                "#FF5733",

                // If firm_saved => BLUE
                ["==", ["get", "firm_saved"], true],
                "#0000FF",

                // If no valuation => gray
                ["==", ["get", "valuation_amount"], null],
                "#888888",

                // else => red
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

          let hoveredParcelNo: string | null = null;

          // MOUSEMOVE
          map.on("mousemove", "polygons-layer", (e) => {
            if (e.features && e.features.length > 0) {
              const feature = e.features[0] as mapboxgl.MapboxGeoJSONFeature;
              const parcelNo = feature.properties?.parcel_no;
              const valuationAmount = feature.properties?.valuation_amount;
              const valuationType = feature.properties?.valuation_type;
              const valuationDate = feature.properties?.valuation_date;
              const firmSaved = feature.properties?.firm_saved; // bool

              // Show ValuationHover
              if (valuationAmount) {
                setHoverValuationPos({ x: e.point.x, y: e.point.y });
                setHoverValuation({
                  parcelNo,
                  valuationType,
                  valuationAmount,
                  valuationDate,
                });
              } else {
                setHoverValuationPos(null);
                setHoverValuation(null);
              }

              // Show FirmPropertyHover if the property is saved
              if (firmSaved) {
                setHoverFirmPos({ x: e.point.x, y: e.point.y });
                setHoverFirmProp({
                  status: "someStatus??", // you'd have to store status in properties if you want
                  savedByFirm: true,
                });
              } else {
                setHoverFirmPos(null);
                setHoverFirmProp(null);
              }

              // Hover highlight
              if (parcelNo) {
                if (hoveredParcelNo && hoveredParcelNo !== parcelNo) {
                  map.setFeatureState(
                    { source: "properties", id: hoveredParcelNo },
                    { hover: false }
                  );
                }
                hoveredParcelNo = parcelNo;
                map.setFeatureState(
                  { source: "properties", id: parcelNo },
                  { hover: true }
                );
              }

              map.getCanvas().style.cursor = "pointer";
            }
          });

          // MOUSELEAVE
          map.on("mouseleave", "polygons-layer", () => {
            if (hoveredParcelNo) {
              map.setFeatureState(
                { source: "properties", id: hoveredParcelNo },
                { hover: false }
              );
              hoveredParcelNo = null;
            }
            setHoverValuationPos(null);
            setHoverValuation(null);

            setHoverFirmPos(null);
            setHoverFirmProp(null);

            map.getCanvas().style.cursor = "";
          });

          // CLICK
          map.on("click", "polygons-layer", (e) => {
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
        // If map already created, just update data
        const map = mapRef.current;
        const source = map.getSource("properties") as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData(geojsonData);
        }
      }
    };

    initializeMap();

    return () => {
      // optional cleanup
    };
  }, [blockNoFilter, areaNameFilter, governorateFilter]);

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" width="80vw" mb={2}>
        <Typography variant="h5" gutterBottom>
          Bahrain Properties Map
        </Typography>
        <Typography variant="subtitle1" sx={{ mr: 2 }}>
          Total properties: {totalProperties}
        </Typography>
      </Box>

      {/* MAP CONTAINER */}
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

      {/* Valuation Popup */}
      {hoverValuationPos && hoverValuation && (
        <ValuationHover
          x={hoverValuationPos.x}
          y={hoverValuationPos.y}
          parcelNo={hoverValuation.parcelNo}
          valuationType={hoverValuation.valuationType}
          valuationAmount={hoverValuation.valuationAmount}
          valuationDate={hoverValuation.valuationDate}
        />
      )}

      {/* Firm Saved Popup */}
      {hoverFirmPos && hoverFirmProp && (
        <FirmPropertyHover
          x={hoverFirmPos.x}
          y={hoverFirmPos.y}
          status={hoverFirmProp.status}
          savedByFirm={hoverFirmProp.savedByFirm}
          parcelNo="parcelNo??"
        />
      )}
    </Container>
  );
};

export default MapComponent;
