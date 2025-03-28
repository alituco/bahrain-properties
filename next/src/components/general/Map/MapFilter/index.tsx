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
  Tooltip,
} from "@mui/material";

interface MapFilterProps {
  onFilterChange: (selectedBlock: string, selectedAreaName: string, selectedGovernorate: string) => void;
}

const MapFilter: React.FC<MapFilterProps> = ({ onFilterChange }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [areaNames, setAreaNames] = useState<string[]>([]);
  const [blockNumbers, setBlockNumbers] = useState<string[]>([]);
  const [governorates, setGovernorates] = useState<string[]>([]);

  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedAreaName, setAreaName] = useState("");
  const [selectedGovernorate, setSelectedGovernorate] = useState("");

  // Determines if at least one filter has been selected
  const isFilterSelected = selectedBlock !== "" || selectedAreaName !== "" || selectedGovernorate !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(selectedBlock, selectedAreaName, selectedGovernorate);
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
        if (res.ok && data.blockNumbers) {
          const blocksAsStrings = data.blockNumbers.map((bn: number) => bn.toString());
          setBlockNumbers(blocksAsStrings);
        }
      } catch (err) {
        console.error("Failed to fetch block numbers:", err);
      }
    };

    const fetchGovernorateNames = async () => {
      try {
        const res = await fetch(`${API_URL}/propertyFilters/governorates`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("Fetched governorateNames:", data);
        if (res.ok && data.governorates) {
          setGovernorates(data.governorates);
        }
      } catch (err) {
        console.error("Failed to fetch governorate names:", err);
      }
    };

    fetchAreaNames();
    fetchBlockNumbers();
    fetchGovernorateNames();
  }, [API_URL]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}
    >
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel id="block-number-label">Block Number</InputLabel>
        <Select
          labelId="block-number-label"
          label="Block Number"
          value={selectedBlock}
          onChange={(e: SelectChangeEvent) => setSelectedBlock(e.target.value as string)}
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

      <FormControl variant="outlined" sx={{ minWidth: 200 }}>
        <InputLabel id="area-name-label">Area Name (English)</InputLabel>
        <Select
          labelId="area-name-label"
          label="Area Name (English)"
          value={selectedAreaName}
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

      <FormControl variant="outlined" sx={{ minWidth: 200 }}>
        <InputLabel id="governorate-label">Governorate</InputLabel>
        <Select
          labelId="governorate-label"
          label="Governorate (English)"
          value={selectedGovernorate}
          onChange={(e) => setSelectedGovernorate(e.target.value as string)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {governorates.map((gov, index) => (
            <MenuItem key={index} value={gov}>
              {gov}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Tooltip title={!isFilterSelected ? "Please select a filter" : ""} arrow>
        <span>
          <Button variant="contained" type="submit" disabled={!isFilterSelected}>
            Filter
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
};

export default MapFilter;
