"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function OTPPage() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const param = searchParams.get("user_id");
    if (param) {
      setUserId(Number(param));
    }
  }, [searchParams]);

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) {
      setMessage("No user ID provided.");
      return;
    }

    setMessage("Verifying OTP...");

    try {
      const response = await fetch("/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, otp }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("OTP verified! Logged in successfully.");
        // store token (JWT) somewhere, e.g. local storage
        localStorage.setItem("token", data.token);
        // redirect to some dashboard:
        // router.push("/dashboard");
      } else {
        setMessage(data.message || "OTP verification failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred during OTP verification.");
    }
  }

  return (
    <div style={{ margin: "2rem" }}>
      <h1>Enter Your OTP</h1>
      {userId ? (
        <form onSubmit={handleVerifyOTP}>
          <div>
            <label>OTP: </label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button type="submit">Verify</button>
        </form>
      ) : (
        <p>No user ID in query params. Go back to login.</p>
      )}
      <p>{message}</p>
    </div>
  );
}
