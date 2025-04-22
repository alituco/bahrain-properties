"use client";

import dynamic from "next/dynamic";
import React from "react";

const MapComponent = dynamic(() => import("../MapComponent"), { ssr: false });

export interface MapFilters {
  status?: string;
  block?: string;
  area?: string;
  governorate?: string;
  minSize?:     string;
  maxSize?:     string;
}

interface Props {
  filters: MapFilters;
  flyTo?: { lat: number; lon: number } | null;
  savedOnly?: boolean;
}

export default function MapContainer({ filters, flyTo, savedOnly = false }: Props) {
  return <MapComponent {...filters} flyTo={flyTo} savedOnly={savedOnly} />;
}
