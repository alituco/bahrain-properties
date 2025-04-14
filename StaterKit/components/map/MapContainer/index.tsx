"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import MapFilter from "../MapFilter";

// Dynamically import the map so it doesn't run on the server
const MapComponent = dynamic(() => import("../MapComponent"), { ssr: false });

export default function MapContainer() {
  // Filter states
  const [blockNoFilter, setBlockNoFilter] = useState("");
  const [areaNameFilter, setAreaNameFilter] = useState("");
  const [governorateFilter, setGovernorateFilter] = useState("");

  function handleFilterChange(
    selectedBlock: string,
    selectedArea: string,
    selectedGov: string
  ) {
    setBlockNoFilter(selectedBlock);
    setAreaNameFilter(selectedArea);
    setGovernorateFilter(selectedGov);
  }

  return (
    <div>
      {/* Filter at the top */}
      <MapFilter onFilterChange={handleFilterChange} />

      {/* The actual map, receiving filters as props */}
      <MapComponent
        blockNoFilter={blockNoFilter}
        areaNameFilter={areaNameFilter}
        governorateFilter={governorateFilter}
      />
    </div>
  );
}
