"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Box, styled, Typography } from "@mui/material";
import { Feature, Geometry, GeoJsonProperties } from "geojson";

// Set your Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Styled container for the small map
const MapContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "300px", // Adjust height as needed
  border: "2px solid #ccc",
  borderRadius: "8px",
  marginTop: theme.spacing(2),
}));

// Our ParcelGeoData interface; we expect a valid GeoJSON Feature with a Polygon geometry
interface ParcelGeoData extends Feature<Geometry, GeoJsonProperties> {
  properties: {
    parcel_no: string;
    ewa_edd?: string;
    ewa_wdd?: string;
    roads?: string;
    sewer?: string;
    nzp_code?: string;
    shape_area?: number;
    longitude?: number;
    latitude?: number;
    block_no?: string;
  };
}

interface ParcelMapProps {
  parcelNo: string;
}

const ParcelMap: React.FC<ParcelMapProps> = ({ parcelNo }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [parcelGeo, setParcelGeo] = useState<ParcelGeoData | null>(null);

  // Fetch the GeoJSON data for this parcel
  useEffect(() => {
    const fetchParcelGeoData = async () => {
      try {
        const res = await fetch(`${API_URL}/parcelData/geo/${parcelNo}`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("Parcel GeoData:", data);
        setParcelGeo(data);
      } catch (error) {
        console.error("Error fetching parcel geo data:", error);
      }
    };

    if (parcelNo) {
      fetchParcelGeoData();
    }
  }, [parcelNo]);

  // Initialize or update the map when parcelGeo is available
  useEffect(() => {
    if (!parcelGeo) return;

    // Determine the map center:
    // 1) If properties include longitude and latitude, use them.
    // 2) Otherwise, if geometry is a Polygon, use the first coordinate.
    let center: [number, number] = [50.55, 26.22]; // default fallback
    if (
      parcelGeo.properties &&
      typeof parcelGeo.properties.longitude === "number" &&
      typeof parcelGeo.properties.latitude === "number"
    ) {
      center = [parcelGeo.properties.longitude, parcelGeo.properties.latitude];
    } else if (parcelGeo.geometry && parcelGeo.geometry.type === "Polygon") {
      const coords = parcelGeo.geometry.coordinates as number[][][];
      if (coords && coords.length > 0 && coords[0].length > 0 && coords[0][0].length >= 2) {
        center = [coords[0][0][0], coords[0][0][1]];
      }
    }

    if (!mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current as HTMLElement,
        style: "mapbox://styles/mapbox/streets-v11",
        center: center, // [lng, lat]
        zoom: 16,       // Zoom in on the property
      });
      mapRef.current = map;

      map.on("load", () => {
        // Add the GeoJSON as a source
        map.addSource("parcel", {
          type: "geojson",
          data: parcelGeo,
        });

        // Add a fill layer to display the property polygon
        map.addLayer({
          id: "parcel-fill",
          type: "fill",
          source: "parcel",
          paint: {
            "fill-color": "#00FF00", // Green fill
            "fill-opacity": 0.5,
          },
        });

        // Add an outline layer for the polygon
        map.addLayer({
          id: "parcel-outline",
          type: "line",
          source: "parcel",
          paint: {
            "line-color": "#000000",
            "line-width": 2,
          },
        });
      });
    } else {
      // If the map already exists, update the source and recenter the map
      const map = mapRef.current;
      const source = map.getSource("parcel") as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(parcelGeo);
      }
      map.flyTo({
        center: center,
        zoom: 16,
      });
    }
  }, [parcelGeo]);

  return (
    <MapContainer ref={mapContainerRef}>
      {!parcelGeo && <Typography>Loading map...</Typography>}
    </MapContainer>
  );
};

export default ParcelMap;
