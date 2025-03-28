"use client";

import React, {useEffect, useState} from 'react'
import {useRouter} from "next/navigation";
import {Button, Container, Typography, styled} from "@mui/material";
import FirmPropertiesMap  from "@/components/general/FirmMap/Map";

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

const page = () => {

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const router = useRouter();

    const [firmProperties, setFirmProperties] = useState<any[]>([])

    useEffect(() => {

        const fetchFirmProperties = async () => {
            try {
                const res = await fetch(`${API_URL}/firm-properties`, {
                    credentials: "include",
                });
                const data = await res.json();

                if (res.ok) {
                    setFirmProperties(data.firmProperties);
                } else {
                    console.error("Failed to fetch firm properties:", data);
                }
            } catch (error) {
                console.error("Error fetching firm properties:", error);
            }
        };
        fetchFirmProperties();
    }, [])


    const navToProperty = (parcelNo: string) => {
        router.push(`/parcel/${parcelNo}`);
    }

  return (
    <MainContainer>
        <Typography> 
            Your Saved Properties
        </Typography>
        <PropertiesContainer>
            {firmProperties.map((property) => (
                <PropertyBox key={property.id}>
                    <Typography>
                        Area: {property.area_namee}
                    </Typography>
                    <Typography>
                        Block: {property.block_no}
                    </Typography>
                    <Typography>
                        Status: {property.status}
                    </Typography>
                    <Button onClick={() => navToProperty(property.parcel_no)}>
                        View Details
                    </Button>
                </PropertyBox>
            ))}
        </PropertiesContainer>
        <FirmPropertiesMap />

    </MainContainer>
  )
}

export default page