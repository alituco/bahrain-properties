"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import MapComponent from "@/components/general/Map";
import MapFilter from "@/components/general/Map/MapFilter";

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  firm_id: number;
  real_estate_firm: string;
}

const StyledContainer = styled(Container)({
  padding: "16px",
});

const HeaderBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
});

const WelcomeTypography = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: 600,
});

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [blockNo, setBlockNo] = useState("");
  const [areaName, setAreaName] = useState("");

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // ensure cookies are sent
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          setLoading(false);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        router.push("/login");
      }
    }
    fetchUserProfile();
  }, [router]);

  async function handleLogout() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Failed to log out");
        return;
      }
    } catch (error) {
      console.error("Error logging out:", error);
      return;
    }
    setUser(null);
    router.push("/login");
  }

  const handleFilterChange = (newBlockNo: string, newAreaName: string) => {
    setBlockNo(newBlockNo);
    setAreaName(newAreaName);
  };

  if (loading) return null; // don't render anything until auth check is complete

  return (
    <StyledContainer maxWidth="lg">
      {user ? (
        <HeaderBox>
          <WelcomeTypography>
            Welcome, {user.first_name} {user.last_name} of {user.real_estate_firm}
          </WelcomeTypography>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </HeaderBox>
      ) : (
        <Box>
          <Button variant="text" href="/login">Login</Button>
          <Button variant="text" href="/register">Register</Button>
        </Box>
      )}
      <Box sx={{ marginBottom: "16px" }}>
        <MapFilter onFilterChange={handleFilterChange} />
      </Box>
      <MapComponent blockNoFilter={blockNo} areaNameFilter={areaName} />
    </StyledContainer>
  );
}
