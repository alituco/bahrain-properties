"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthWidget from "@/components/auth/AuthWidget";

interface User{
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    firm_id: number;
    real_estate_firm: string;
}

export default function HomePage() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

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
              router.push("/dashboard");
            } else {
              setLoading(false);
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            router.push("/");
          }
        }
        fetchUserProfile();
      }, [router]);


  return <AuthWidget />;
}
