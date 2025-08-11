"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, Col, Nav, Row, Tab } from "react-bootstrap";

import Seo        from "@/shared/layouts-components/seo/seo";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";

import EmailForm      from "@/components/profile-settings/EmailForm";
import PasswordForm   from "@/components/profile-settings/PasswordForm";
import ConfirmDialog  from "@/components/profile-settings/ConfirmDialog";
import OtpDialog      from "@/components/profile-settings/OtpDialog";
import MessageFooter  from "@/components/profile-settings/MessageFooter";
import FirmLogoForm   from "@/components/profile-settings/FirmLogoForm";      

const API = process.env.NEXT_PUBLIC_API_URL;

type Role = "admin" | "staff";

interface User {
  user_id : number;
  email   : string;
  role    : Role;
  firm_id : number;
  firm_registration_code?: string | null;
  firm_logo_url?        : string | null;                                      
}

const Profile = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user,    setUser]    = useState<User | null>(null);

  /* ---------- fetch current-user -------------------------------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/user/me`, { credentials: "include" });
        if (!res.ok) throw new Error("Unauthenticated");
        const { user } = await res.json();
        if (!cancelled) setUser(user);
      } catch {
        if (!cancelled) router.replace("/");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, []);

  /* ---------- form states -------------------------------------- */
  const [email, setEmail]         = useState("");
  const [firmCode, setFirmCode]   = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [firmLogo, setFirmLogo]   = useState<string | null>(null);            // ← NEW

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      if (user.role === "admin" && user.firm_registration_code)
        setFirmCode(user.firm_registration_code);
      setFirmLogo(user.firm_logo_url ?? null);                                // ← NEW
    }
  }, [user]);

  /* ---------- flash messages ----------------------------------- */
  const [success, setSuccess] = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);
  const ok  = (m:string) => { setError(null);   setSuccess(m); };
  const bad = (m:string) => { setSuccess(null); setError(m);   };

  /* ---------- dialog / overlay flags --------------------------- */
  const [confirmPwFlag, setConfirmPwFlag] = useState(false);
  const [otpPhase, setOtpPhase] = useState<"idle"|"sent">("idle");
  const [otpTargetEmail, setOtpTargetEmail] = useState("");

  /* ---------- API helpers -------------------------------------- */
  const saveFirmCode = async () => {
    const r = await fetch(
      `${API}/user/firms/${user!.firm_id}/registration-code`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ new_code: firmCode }),
      }
    );
    const j = await r.json();
    j.success ? ok("Firm code updated.") : bad(j.message);
  };

  const requestEmailOtp = async () => {
    const r = await fetch(`${API}/user/email-change/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ new_email: email }),
    });
    const j = await r.json();
    if (!j.success) return bad(j.message);
    setOtpTargetEmail(email);
    setOtpPhase("sent");
  };

  const verifyEmailOtp = async (otp: string) => {
    const r = await fetch(`${API}/user/email-change/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ new_email: otpTargetEmail, otp }),
    });
    const j = await r.json();
    j.success ? ok("Email updated.") : bad(j.message);
    if (j.success) setOtpPhase("idle");
  };

  const changePassword = async () => {
    const r = await fetch(`${API}/user/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ current_password: currentPw, new_password: newPw }),
    });
    const j = await r.json();
    j.success ? ok("Password changed.") : bad(j.message);
    if (j.success) { setCurrentPw(""); setNewPw(""); setConfirmPw(""); }
  };

  /* ================================================================= */
  return (
    <>
      {!loading && user && (
        <>
          <Seo title="Profile Settings" />
          <Pageheader
            title="Settings"
            subtitle="Profile"
            currentpage="Profile Settings"
            activepage="Profile Settings"
            share={false}
            filter={false}
          />

          <Row className="mb-5">
            <Tab.Container defaultActiveKey="tab-profile">
              {/* ---------- sidebar -------------------------------- */}
              <Col xl={3}>
                <Card className="custom-card">
                  <Card.Body>
                    <Nav className="nav-tabs flex-column nav-tabs-header mb-0">
                      <Nav.Item>
                        <Nav.Link eventKey="tab-profile">
                          <i className="ri-user-line me-2 text-primary" />
                          Profile
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="tab-security">
                          <i className="ri-lock-line me-2 text-primary" />
                          Security
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Card.Body>
                </Card>
              </Col>

              {/* ---------- main content --------------------------- */}
              <Col xl={9}>
                <Card className="custom-card">
                  <Card.Body className="p-0">
                    <Tab.Content>
                      <Tab.Pane eventKey="tab-profile" className="p-4">
                        {/* ----- Email / firm code form ---------- */}
                        <EmailForm
                          email={email}
                          setEmail={setEmail}
                          role={user.role}
                          firmCode={firmCode}
                          setFirmCode={setFirmCode}
                          requestOtp={requestEmailOtp}
                          saveCode={saveFirmCode}
                        />

                        {/* ----- Firm logo uploader (admins) ----- */}
                        {user.role === "admin" && (
                          <FirmLogoForm
                            firmId={user.firm_id}
                            initialUrl={firmLogo}
                            onUploaded={url => setFirmLogo(url)}
                          />
                        )}
                      </Tab.Pane>

                      <Tab.Pane eventKey="tab-security" className="p-4">
                        <PasswordForm
                          currentPw={currentPw} setCurrentPw={setCurrentPw}
                          newPw={newPw}         setNewPw={setNewPw}
                          confirmPw={confirmPw} setConfirmPw={setConfirmPw}
                          submit={() => setConfirmPwFlag(true)}
                        />
                      </Tab.Pane>
                    </Tab.Content>
                  </Card.Body>

                  {(success || error) && (
                    <Card.Footer className="border-top-0 p-3">
                      <MessageFooter success={success} error={error} />
                    </Card.Footer>
                  )}
                </Card>
              </Col>
            </Tab.Container>
          </Row>

          {/* ---------- confirm + otp dialogs -------------------- */}
          {confirmPwFlag && (
            <ConfirmDialog
              text="Are you sure you want to change your password?"
              onConfirm={() => { setConfirmPwFlag(false); changePassword(); }}
              onCancel={()   => setConfirmPwFlag(false)}
            />
          )}

          {otpPhase === "sent" && (
            <OtpDialog
              targetEmail={otpTargetEmail}
              verifyFn={verifyEmailOtp}
              onCancel={() => setOtpPhase("idle")}
            />
          )}
        </>
      )}
    </>
  );
};

Profile.layout = "ContentLayout";
export default Profile;
