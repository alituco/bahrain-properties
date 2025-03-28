"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Container } from "@mui/material";
import ParcelInfo from "@/components/pages/Property/ParcelInfo";
import NotesSection from "@/components/pages/Property/NotesSection";
import FirmPropertyBox from "@/components/pages/Property/FirmPropertyBox";
import ParcelMap from "@/components/pages/Property/ParcelMap";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface User {
  user_id: number;
  role: string;
  firm_id: number;
  first_name?: string;
  last_name?: string;
}

export default function ParcelPage() {
  const params = useParams();
  const parcelNo = params.parcelNo as string;

  // Store the user data for isAdmin checks and to show their name
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Fetch current user from /user/me
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/user/me`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCurrentUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  if (!parcelNo) {
    return <div>Invalid parcel number.</div>;
  }

  const isAdmin = currentUser?.role === "admin";
  const userFirstName = currentUser?.first_name || "";
  const userLastName = currentUser?.last_name || "";

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <ParcelInfo parcelNo={parcelNo} />
      <NotesSection
        parcelNo={parcelNo}
        isAdmin={isAdmin}
        userFirstName={userFirstName}
        userLastName={userLastName}
      />
      <FirmPropertyBox parcelNo={parcelNo} />
      <ParcelMap parcelNo={parcelNo} />
    </Container>
  );
}
