"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrationCode, setRegistrationCode] = useState("");
  const [message, setMessage] = useState("");


  useEffect(() => {

    // Check if user is already authenticated
    async function checkAuth() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          // If authenticated, redirect to home page
          router.push("/");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    }
    checkAuth();

  }, [router]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Registering...");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            login_code: registrationCode,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessage("Registration successful. Redirecting to OTP verification...");
        // Automatically redirect to the OTP verification page with the user_id as a query parameter.
        router.push(`/verify-account?user_id=${data.user_id}`);
      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("An error occurred during registration.");
    }
  }

  return (
    <div style={{ margin: "2rem" }}>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: "1rem" }}>
          <label>First Name: </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Last Name: </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Registration Code: </label>
          <input
            type="text"
            value={registrationCode}
            onChange={(e) => setRegistrationCode(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
