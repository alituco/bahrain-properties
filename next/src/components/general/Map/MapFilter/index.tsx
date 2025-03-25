"use client"; 

import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

interface MapFilterProps {
  onFilterChange: (blockNo: string, areaName: string) => void;
}

const MapFilter: React.FC<MapFilterProps> = ({ onFilterChange }) => {
  const [blockNo, setBlockNo] = useState("");
  const [areaName, setAreaName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(blockNo, areaName);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}
    >
      <TextField
        label="Block Number"
        variant="outlined"
        value={blockNo}
        onChange={(e) => setBlockNo(e.target.value)}
      />
      <TextField
        label="Area Name (English)"
        variant="outlined"
        value={areaName}
        onChange={(e) => setAreaName(e.target.value)}
      />
      <Button variant="contained" type="submit">
        Filter
      </Button>
    </Box>
  );
};

export default MapFilter;
