"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyAccountPage() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Try to get user_id from query parameters
    const idParam = searchParams.get("user_id");
    if (idParam) {
      setUserId(Number(idParam));
    } else {
      // If not found in query, try to read from cookies
      const cookies = document.cookie.split(";").reduce((acc: Record<string, string>, cookie) => {
        const [name, value] = cookie.split("=");
        acc[name.trim()] = value;
        return acc;
      }, {});
      if (cookies.user_id) {
        setUserId(Number(cookies.user_id));
      }
    }
  }, [searchParams]);

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) {
      setMessage("User ID is missing. Please log in again.");
      return;
    }
    setMessage("Verifying OTP...");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-register-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ user_id: userId, otp }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessage("OTP verified! Your account is now verified.");
        localStorage.setItem("token", data.token);
        // Optionally, redirect to a dashboard:
        // router.push("/dashboard");
      } else {
        setMessage(data.message || "OTP verification failed.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setMessage("An error occurred during OTP verification.");
    }
  }

  async function handleResendOTP() {
    if (!userId) {
      setMessage("User ID is missing. Please log in again.");
      return;
    }
    setMessage("Resending OTP...");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          // Note: backend expects { user_id: ... } (not { userId: ... })
          body: JSON.stringify({ user_id: userId }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessage("A new OTP has been sent to your email.");
      } else {
        setMessage(data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setMessage("An error occurred while resending OTP.");
    }
  }

  return (
    <div style={{ margin: "2rem" }}>
      <h1>Verify Your Account</h1>
      <p>
        Please check your email for your OTP, then enter it below to verify your account.
      </p>
      <form onSubmit={handleVerifyOTP}>
        <div style={{ marginBottom: "1rem" }}>
          <label>OTP: </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit">Verify OTP</button>
      </form>
      <button onClick={handleResendOTP} style={{ marginTop: "1rem" }}>
        Resend OTP
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
