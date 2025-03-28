"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Container, Typography, styled } from "@mui/material";
import FirmPropertiesMap from "@/components/general/FirmMap/Map";

// Styled containers
const MainContainer = styled(Container)({
  padding: "16px",
});

const PropertiesContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const PropertyBox = styled(Container)({
  display: "flex",
  justifyContent: "space-between",
  padding: "16px",
  border: "1px solid #ccc",
  borderRadius: "8px",
});

// Define an interface for firm properties (adjust fields as needed)
interface FirmProperty {
  id: number;
  parcel_no: string;
  area_namee: string;
  block_no: string;
  status: string;
}

export default function SavedPropertiesPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const router = useRouter();

  const [firmProperties, setFirmProperties] = useState<FirmProperty[]>([]);

  useEffect(() => {
    const fetchFirmProperties = async () => {
      try {
        const res = await fetch(`${API_URL}/firm-properties`, {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.firmProperties) {
          setFirmProperties(data.firmProperties);
        } else {
          console.error("Failed to fetch firm properties:", data);
        }
      } catch (error) {
        console.error("Error fetching firm properties:", error);
      }
    };
    fetchFirmProperties();
  }, [API_URL]);

  const navToProperty = (parcelNo: string) => {
    router.push(`/parcel/${parcelNo}`);
  };

  return (
    <MainContainer>
      <Typography variant="h5" gutterBottom>
        Your Saved Properties
      </Typography>
      <PropertiesContainer>
        {firmProperties.map((property) => (
          <PropertyBox key={property.id}>
            <Typography>Area: {property.area_namee}</Typography>
            <Typography>Block: {property.block_no}</Typography>
            <Typography>Status: {property.status}</Typography>
            <Button onClick={() => navToProperty(property.parcel_no)}>
              View Details
            </Button>
          </PropertyBox>
        ))}
      </PropertiesContainer>
      <FirmPropertiesMap />
    </MainContainer>
  );
}
