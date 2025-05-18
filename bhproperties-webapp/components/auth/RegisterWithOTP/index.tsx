"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Modal, Button as RBButton } from "react-bootstrap";
import SpkButton from "@/shared/@spk-reusable-components/reusable-uielements/spk-button";
import SpkAlert  from "@/shared/@spk-reusable-components/reusable-uielements/spk-alert";
import { Container } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";

export default function RegisterForm() {
  const router = useRouter();

  const recaptchaRef = React.useRef<ReCAPTCHA | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName:  "",
    email:     "",
    password:  "",
    registrationCode: "",
  });
  const [msg,      setMsg]      = useState("");
  const [otp,      setOtp]      = useState("");
  const [otpMsg,   setOtpMsg]   = useState("");
  const [otpModal, setOtpModal] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!captchaToken) {
      setMsg("Please complete the CAPTCHA.");
      return;
    }

    setMsg("Registering…");
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",          
        body: JSON.stringify({
          first_name: form.firstName,
          last_name:  form.lastName,
          email:      form.email,
          password:   form.password,
          login_code: form.registrationCode,
          recaptchaToken: captchaToken,
        }),
      });
      const d = await r.json();
      if (d.success) {
        setMsg("");
        setOtpModal(true);       
        resetCaptcha();         
      } else {
        setMsg(d.message || "Registration failed.");
        resetCaptcha();
      }
    } catch {
      setMsg("Network error.");
      resetCaptcha();
    }
  }

  async function verifyOtp() {
    setOtpMsg("Verifying…");
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-register-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",              
        body: JSON.stringify({ otp }),
      });
      const d = await r.json();
      if (d.success) {
        router.push("/dashboard");
      } else setOtpMsg(d.message || "OTP invalid.");
    } catch {
      setOtpMsg("Network error.");
    }
  }

  async function resendOtp() {
    setOtpMsg("Sending new OTP…");
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-register-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const d = await r.json();
      setOtpMsg(d.success ? "OTP resent." : d.message || "Could not resend.");
    } catch {
      setOtpMsg("Network error.");
    }
  }

  const resetCaptcha = () => {
    recaptchaRef.current?.reset();
    setCaptchaToken(null);
  }

  return (
    <>
      {msg && <SpkAlert variant="danger">{msg}</SpkAlert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control name="firstName" value={form.firstName} onChange={onChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control name="lastName" value={form.lastName} onChange={onChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control name="email" type="email" value={form.email} onChange={onChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control name="password" type="password" value={form.password} onChange={onChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Registration Code</Form.Label>
          <Form.Control name="registrationCode" value={form.registrationCode} onChange={onChange} required />
        </Form.Group>

        <Container className="d-flex justify-content-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(token) => {
              setCaptchaToken(token);
              setMsg("");
            }}
            onExpired={resetCaptcha}
          />
        </Container>

        <div className="d-grid mt-4">
          <SpkButton Buttontype="submit" Buttonvariant="primary">Register</SpkButton>
        </div>
      </Form>


      <Modal show={otpModal} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>OTP</Form.Label>
            <Form.Control value={otp} onChange={(e)=>setOtp(e.target.value)} />
          </Form.Group>
          {otpMsg && <SpkAlert variant="danger">{otpMsg}</SpkAlert>}
        </Modal.Body>
        <Modal.Footer>
          <RBButton variant="link" onClick={resendOtp}>Resend OTP</RBButton>
          <RBButton variant="secondary" onClick={()=>setOtpModal(false)}>Cancel</RBButton>
          <RBButton variant="primary" onClick={verifyOtp}>Verify</RBButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}
