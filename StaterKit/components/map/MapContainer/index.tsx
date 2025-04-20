"use client";

import dynamic from "next/dynamic";
import React from "react";

const MapComponent = dynamic(() => import("../MapComponent"), { ssr: false });

interface MapContainerProps {
  statusFilter: string;
}

/** Thin wrapper that passes the status filter down to the actual map. */
export default function MapContainer({ statusFilter }: MapContainerProps) {
  return <MapComponent statusFilter={statusFilter} />;
}
