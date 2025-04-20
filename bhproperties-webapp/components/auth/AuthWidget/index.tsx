"use client";

import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Col, Form, Nav, Tab, Modal, Button as RBButton } from "react-bootstrap";

import Seo from "@/shared/layouts-components/seo/seo";
import SpkButton from "@/shared/@spk-reusable-components/reusable-uielements/spk-button";
import SpkAlert from "@/shared/@spk-reusable-components/reusable-uielements/spk-alert";
import { basePath } from "@/next.config";

export default function AuthWithOTP() {
  const router = useRouter();

  // -----------------------------
  // Authentication Check
  // -----------------------------
  const [loading, setLoading] = useState(true);
  const [err, setError] = useState("");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginMessage, setLoginMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpMessage, setOtpMessage] = useState("");

  useEffect(() => {
    document.querySelector("body")?.classList.add("authentication-background");
    return () => {
      document.querySelector("body")?.classList.remove("authentication-background");
    };
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Include cookies
        });
        const data = await response.json();
        if (data.success) {
          // If already authenticated, redirect to home (or dashboard)
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

  // Don't show any UI until we've checked user auth
  if (loading) return null;

  function handleLoginChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError("");
    setLoginMessage("");
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginMessage("Logging in...");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginData),
      });
      const data = await response.json();

      if (data.success) {
        // If login is successful, we proceed to OTP
        setLoginMessage("");
        setShowOTPModal(true);
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
        setShowOTPModal(false);
        router.push("/dashboard");
      } else {
        setOtpMessage(data.message || "OTP verification failed.");
      }
    } catch (error) {
      console.error(error);
      setOtpMessage("An error occurred during OTP verification.");
    }
  }

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <Fragment>
      <Seo title="Login with OTP" />
      <div className="container">
        <div className="row justify-content-center align-items-center authentication authentication-basic h-100 pt-3">
          <Col xxl={4} xl={5} lg={5} md={6} sm={8} className="col-12">
            {/* Logo */}
            <div className="mb-3 d-flex justify-content-center">
              <Link href="#!">
                <img
                  src={`${
                    process.env.NODE_ENV === "production" ? basePath : ""
                  }/assets/images/brand-logos/desktop-white.png`}
                  alt="logo"
                  className="desktop-logo"
                />
              </Link>
            </div>

            {/* Card / Tabs - You could add a Register tab if you like */}
            <Card className="custom-card my-4">
              <Tab.Container id="auth-tabs" defaultActiveKey="login">
                <Nav
                  variant="pills"
                  className="justify-content-center authentication-tabs"
                >
                  <Nav.Item>
                    <Nav.Link eventKey="login">Login</Nav.Link>
                  </Nav.Item>
                  {/* If you need a "Sign Up" tab, you can add it here */}
                </Nav>
                <Tab.Content>
                  {/* ------------ LOGIN TAB ------------ */}
                  <Tab.Pane eventKey="login" className="border-0 p-3">
                    <Card.Body>
                      <p className="h5 mb-2 text-center">Sign In (OTP)</p>
                      <p className="mb-4 text-muted op-7 fw-normal text-center">
                        Please enter your credentials
                      </p>

                      {/* Show errors or statuses */}
                      {loginMessage && <SpkAlert variant="danger">{loginMessage}</SpkAlert>}
                      {err && <SpkAlert variant="danger">{err}</SpkAlert>}

                      <Form onSubmit={handleLoginSubmit}>
                        {/* Email */}
                        <div className="mb-3">
                          <Form.Label className="text-default">Email</Form.Label>
                          <Form.Control
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            required
                          />
                        </div>

                        {/* Password */}
                        <div className="mb-3">
                          <Form.Label className="text-default d-block">
                            Password
                          </Form.Label>
                          <div className="position-relative">
                            <Form.Control
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              value={loginData.password}
                              onChange={handleLoginChange}
                              required
                            />
                            <Link
                              href="#!"
                              className="show-password-button text-muted"
                              onClick={(e) => {
                                e.preventDefault();
                                setShowPassword(!showPassword);
                              }}
                            >
                              <i
                                className={
                                  showPassword
                                    ? "ri-eye-line align-middle"
                                    : "ri-eye-off-line align-middle"
                                }
                              ></i>
                            </Link>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="d-grid mt-4">
                          <SpkButton Buttontype="submit" Buttonvariant="primary">
                            Send OTP
                          </SpkButton>
                        </div>
                      </Form>
                    </Card.Body>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card>
          </Col>
        </div>
      </div>

      {/* ----------------- OTP Modal ----------------- */}
      <Modal show={showOTPModal} onHide={() => {}} centered>
        <Modal.Header>
          <Modal.Title>Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>OTP Code</Form.Label>
            <Form.Control
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </Form.Group>
          {otpMessage && <SpkAlert variant="danger">{otpMessage}</SpkAlert>}
        </Modal.Body>
        <Modal.Footer>
          <RBButton variant="secondary" onClick={() => setShowOTPModal(false)}>
            Cancel
          </RBButton>
          <RBButton variant="primary" onClick={handleVerifyOTP}>
            Verify OTP
          </RBButton>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
