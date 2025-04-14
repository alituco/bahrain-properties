"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  styled,
  Tooltip,
} from "@mui/material";
import SpkButton from "@/shared/@spk-reusable-components/reusable-uielements/spk-button";
import SpkDropdown from "@/shared/@spk-reusable-components/reusable-uielements/spk-dropdown";
import Dropdown from "react-bootstrap/Dropdown";

interface MapFilterProps {
  onFilterChange: (
    selectedBlock: string,
    selectedAreaName: string,
    selectedGovernorate: string
  ) => void;
}

export default function MapFilter({ onFilterChange }: MapFilterProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [areaNames, setAreaNames] = useState<string[]>([]);
  const [blockNumbers, setBlockNumbers] = useState<string[]>([]);
  const [governorates, setGovernorates] = useState<string[]>([]);

  // Default each filter to an empty string
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [selectedGovernorate, setSelectedGovernorate] = useState("");

  // Helper to check if at least one filter is selected
  const isFilterSelected =
    selectedBlock !== "" || selectedAreaName !== "" || selectedGovernorate !== "";

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(selectedBlock, selectedAreaName, selectedGovernorate);
  };

  // Fetch filter data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        // AREA NAMES
        const areaRes = await fetch(`${API_URL}/propertyFilters/areas`, {
          credentials: "include",
        });
        const areaData = await areaRes.json();
        if (areaRes.ok && areaData.areaNames) {
          setAreaNames(areaData.areaNames);
        }

        // BLOCK NUMBERS
        const blockRes = await fetch(`${API_URL}/propertyFilters/blocks`, {
          credentials: "include",
        });
        const blockData = await blockRes.json();
        if (blockRes.ok && blockData.blockNumbers) {
          // Convert numeric block numbers to string
          const blocksAsStrings = blockData.blockNumbers.map((bn: number) =>
            bn.toString()
          );
          setBlockNumbers(blocksAsStrings);
        }

        // GOVERNORATES
        const govRes = await fetch(`${API_URL}/propertyFilters/governorates`, {
          credentials: "include",
        });
        const govData = await govRes.json();
        if (govRes.ok && govData.governorates) {
          setGovernorates(govData.governorates);
        }
      } catch (err) {
        console.error("Error fetching filter data:", err);
      }
    }
    fetchData();
  }, [API_URL]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}
    >
      <SpkDropdown
        toggleas="a"
        Customtoggleclass="btn btn-lg btn-light text-muted"
        Toggletext={selectedBlock || "None"}
      >
        <Dropdown.Item onClick={() => setSelectedBlock("")}>
          None
        </Dropdown.Item>
        {blockNumbers.map((bn, index) => (
          <Dropdown.Item key={index} onClick={() => setSelectedBlock(bn)}>
            {bn}
          </Dropdown.Item>
        ))}
      </SpkDropdown>
      <Tooltip
        title={!isFilterSelected ? "Please select a filter" : ""}
        arrow
      >
        <span>
          <SpkButton Buttontype="submit" Size="lg" >
            Filter
          </SpkButton>
        </span>
      </Tooltip>
    </Box>
  );
}
