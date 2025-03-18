"use client";

import MapComponent from "@/components/general/Map";
import MapFilter from "@/components/general/Map/MapFilter";
import { useState } from "react";

export default function Home() {
  const [blockNo, setBlockNo] = useState("");
  const [areaName, setAreaName] = useState("");

  const handleFilterChange = (newBlockNo: string, newAreaName: string) => {
    setBlockNo(newBlockNo);
    setAreaName(newAreaName);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Welcome to My Bahrain Properties</h2>
      <MapFilter onFilterChange={handleFilterChange} />
      <MapComponent blockNoFilter={blockNo} areaNameFilter={areaName} />
    </div>
  );
}
