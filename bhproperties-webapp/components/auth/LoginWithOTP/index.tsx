"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Modal,
  Button as RBButton,
} from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";        
import SpkButton from "@/shared/@spk-reusable-components/reusable-uielements/spk-button";
import SpkAlert  from "@/shared/@spk-reusable-components/reusable-uielements/spk-alert";
import { Container, styled } from "@mui/material";

export default function LoginWithOTP() {
  const router = useRouter();

  const [form, setForm]   = useState({ email: "", password: "" });
  const [msg, setMsg]     = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp]       = useState("");
  const [otpMsg, setOtpMsg] = useState("");

  const recaptchaRef = useRef<ReCAPTCHA | null>(null);          
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);   

  const resetCaptcha = () => {
    recaptchaRef.current?.reset();
    setCaptchaToken(null);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!captchaToken) {
      setMsg("Please complete the CAPTCHA.");
      return;
    }
    setMsg("Logging in…");

    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, recaptchaToken: captchaToken }),   
      });
      const d = await r.json();
      if (d.success) {
        setMsg("");
        setOtpModal(true);
        resetCaptcha();
      } else {
        setMsg(d.message || "Login failed.");
        resetCaptcha();
      }
    } catch (err) {
      console.error(err);
      setMsg("Network error.");
      resetCaptcha();
    }
  }

  async function verifyOtp() {
    setOtpMsg("Verifying…");
    try {
      const r = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ otp }),
        }
      );
      const d = await r.json();
      if (d.success) router.push("/dashboard");
      else setOtpMsg(d.message || "OTP invalid.");
    } catch (err) {
      console.error(err);
      setOtpMsg("Network error.");
    }
  }

  return (
    <>
      {msg && <SpkAlert variant="danger">{msg}</SpkAlert>}

      <Form onSubmit={handleLogin}>
        <div className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>

        <div className="mb-3">
          <Form.Label>Password</Form.Label>
          <div className="position-relative">
            <Form.Control
              name="password"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={onChange}
              required
            />
            <a
              href="#!"
              className="show-password-button text-muted"
              onClick={(e) => {
                e.preventDefault();
                setShowPwd(!showPwd);
              }}
            >
              <i className={showPwd ? "ri-eye-line" : "ri-eye-off-line"} />
            </a>
          </div>
        </div>

        <Container className="d-flex justify-content-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(token) => setCaptchaToken(token)}
            onExpired={() => setCaptchaToken(null)}
            className="mb-2"
          />
        </Container>

        <div className="d-grid mt-2">
          <SpkButton Buttontype="submit" Buttonvariant="primary">
            Send OTP
          </SpkButton>
        </div>
      </Form>

      <Modal show={otpModal} onHide={() => {}} centered>
        <Modal.Header>
          <Modal.Title>Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>OTP Code</Form.Label>
            <Form.Control
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </Form.Group>
          {otpMsg && <SpkAlert variant="danger">{otpMsg}</SpkAlert>}
        </Modal.Body>
        <Modal.Footer>
          <RBButton variant="secondary" onClick={() => setOtpModal(false)}>
            Cancel
          </RBButton>
          <RBButton variant="primary" onClick={verifyOtp}>
            Verify
          </RBButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}
