"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Modal,
  Button as RBButton,
} from "react-bootstrap";
import SpkButton from "@/shared/@spk-reusable-components/reusable-uielements/spk-button";
import SpkAlert  from "@/shared/@spk-reusable-components/reusable-uielements/spk-alert";

export default function LoginWithOTP() {
  const router = useRouter();

  const [form, setForm]   = useState({ email: "", password: "" });
  const [msg, setMsg]     = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp]       = useState("");
  const [otpMsg, setOtpMsg] = useState("");

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg("Logging in…");

    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form }),
      });
      const d = await r.json();
      if (d.success) {
        setMsg("");
        setOtpModal(true);
      } else {
        setMsg(d.message || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      setMsg("Network error.");
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

  async function resendOtp() {
    setOtpMsg("Resending OTP…");
    try {
      const r = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-login-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: form.email }),
        }
      );
      const d = await r.json();
      if (d.success) setOtpMsg("");
      else setOtpMsg(d.message || "Failed to resend OTP.");
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
          <RBButton variant="link" onClick={resendOtp}>
            Resend OTP
          </RBButton>
          <RBButton variant="primary" onClick={verifyOtp}>
            Verify
          </RBButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}
