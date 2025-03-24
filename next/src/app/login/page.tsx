"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";

// Styled components
const StyledContainer = styled(Container)(({  }) => ({
  marginTop: 8,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const FormCard = styled(Box)(({  }) => ({
  padding: 4,
  boxShadow: '3',
  borderRadius: '3',
  backgroundColor: 'white',
  width: "100%",
}));

const StyledHeading = styled(Typography)(({  }) => ({
  fontSize: "2rem",
  textAlign: "center",
  fontWeight: 600,
  marginBottom: 2,
}));

const StyledTextField = styled(TextField)(({  }) => ({
  marginBottom: 2,
}));

const StyledButton = styled(Button)(({  }) => ({
  marginTop: 2,
}));

const ErrorMessage = styled(Typography)(({  }) => ({
  color: 'red',
  textAlign: "center",
  marginTop: 1,
}));

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"login" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [otpMessage, setOtpMessage] = useState("");

  // Check if user is already authenticated
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // cookies included
        });
        const data = await response.json();
        if (data.success) {
          router.push("/");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginMessage("Logging in...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setLoginMessage("");
        setStep("otp");
      } else {
        setLoginMessage(data.message || "Login failed.");
      }
    } catch (error) {
      console.error(error);
      setLoginMessage("An error occurred during login.");
    }
  }

  async function handleVerifyOTP() {
    setOtpMessage("Verifying OTP...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp }),
      });
      const data = await response.json();
      if (data.success) {
        setOtpMessage("");
        router.push("/");
      } else {
        setOtpMessage(data.message || "OTP verification failed.");
      }
    } catch (error) {
      console.error(error);
      setOtpMessage("An error occurred during OTP verification.");
    }
  }

  // Don't render any UI until auth check is complete
  if (loading) return null;

  return (
    <StyledContainer maxWidth="sm">
      {step === "login" && (
        <FormCard>
          <StyledHeading>Login</StyledHeading>
          <Box component="form" onSubmit={handleLogin} noValidate>
            <StyledTextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <StyledTextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {loginMessage && (
              <ErrorMessage variant="body2">{loginMessage}</ErrorMessage>
            )}
            <StyledButton type="submit" variant="contained" fullWidth>
              Send OTP
            </StyledButton>
          </Box>
        </FormCard>
      )}

      <Dialog open={step === "otp"} onClose={() => {}}>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <StyledTextField
            label="OTP"
            variant="outlined"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          {otpMessage && (
            <ErrorMessage variant="body2">{otpMessage}</ErrorMessage>
          )}
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={handleVerifyOTP} variant="contained">
            Verify OTP
          </StyledButton>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
}
