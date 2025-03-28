"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

interface MapFilterProps {
  onFilterChange: (blockNo: string, areaName: string) => void;
}

const MapFilter: React.FC<MapFilterProps> = ({ onFilterChange }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [areaNames, setAreaNames] = useState<string[]>([]);
  const [blockNumbers, setBlockNumbers] = useState<string[]>([]);

  // Controlled states for the selected dropdown values
  const [blockNo, setBlockNo] = useState("");
  const [areaName, setAreaName] = useState("");

  // Called when the user clicks “Filter”
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(blockNo, areaName);
  };

  useEffect(() => {
    console.log("MapFilter mounted");

    const fetchAreaNames = async () => {
      try {
        const res = await fetch(`${API_URL}/propertyFilters/areas`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("Fetched areaNames:", data);

        // If your API returns { "areaNames": [...] }, do:
        if (res.ok && data.areaNames) {
          setAreaNames(data.areaNames);
        }
      } catch (err) {
        console.error("Failed to fetch area names:", err);
      }
    };

    const fetchBlockNumbers = async () => {
      try {
        const res = await fetch(`${API_URL}/propertyFilters/blocks`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("Fetched blockNumbers:", data);

        // If your API returns { "blockNumbers": [...] }, do:
        if (res.ok && data.blockNumbers) {
          // Convert them to strings for the dropdown values
          const blocksAsStrings = data.blockNumbers.map((bn: number) => bn.toString());
          setBlockNumbers(blocksAsStrings);
        }
      } catch (err) {
        console.error("Failed to fetch block numbers:", err);
      }
    };

    fetchAreaNames();
    fetchBlockNumbers();
  }, [API_URL]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}
    >
      {/* Block Number Dropdown */}
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel id="block-number-label">Block Number</InputLabel>
        <Select
          labelId="block-number-label"
          label="Block Number"
          value={blockNo}
          onChange={(e: SelectChangeEvent) => setBlockNo(e.target.value as string)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {blockNumbers.map((bn, index) => (
            <MenuItem key={index} value={bn}>
              {bn}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Area Name Dropdown */}
      <FormControl variant="outlined" sx={{ minWidth: 200 }}>
        <InputLabel id="area-name-label">Area Name (English)</InputLabel>
        <Select
          labelId="area-name-label"
          label="Area Name (English)"
          value={areaName}
          onChange={(e) => setAreaName(e.target.value as string)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {areaNames.map((area, index) => (
            <MenuItem key={index} value={area}>
              {area}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" type="submit">
        Filter
      </Button>
    </Box>
  );
};

export default MapFilter;
