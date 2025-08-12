"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Card, Col, Nav, Row, Tab, Form, Button, InputGroup } from "react-bootstrap";

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
  phone_number?         : string | null;
}

const COUNTRY_CODES = [
  { value: "973", label: "BH +973" }, // default
];

const Profile = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user,    setUser]    = useState<User | null>(null);

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

  const [email, setEmail]         = useState("");
  const [firmCode, setFirmCode]   = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [firmLogo, setFirmLogo]   = useState<string | null>(null);

  // phone pieces
  const [phoneCode, setPhoneCode]   = useState("973"); // dropdown default
  const [phoneLocal, setPhoneLocal] = useState("");    // user types here
  const [editPhone, setEditPhone]   = useState(false);
  const [savingPhone, setSavingPhone] = useState(false);

  // keep a copy to reset on cancel
  const [initialPhoneCode, setInitialPhoneCode]   = useState("973");
  const [initialPhoneLocal, setInitialPhoneLocal] = useState("");

  // hydrate form state when user loads
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      if (user.role === "admin" && user.firm_registration_code)
        setFirmCode(user.firm_registration_code);
      setFirmLogo(user.firm_logo_url ?? null);

      const raw = user.phone_number ?? "";
      const digits = raw.replace(/[^\d]/g, "");
      // default to Bahrain (973). If the stored number starts with 973, split it off.
      if (digits.startsWith("973") && digits.length > 3) {
        const local = digits.slice(3);
        setPhoneCode("973");
        setPhoneLocal(local);
        setInitialPhoneCode("973");
        setInitialPhoneLocal(local);
      } else if (digits.length) {
        // if not prefixed, assume it's a local number in Bahrain
        setPhoneCode("973");
        setPhoneLocal(digits);
        setInitialPhoneCode("973");
        setInitialPhoneLocal(digits);
      } else {
        // no phone on file → defaults
        setPhoneCode("973");
        setPhoneLocal("");
        setInitialPhoneCode("973");
        setInitialPhoneLocal("");
      }
    }
  }, [user]);

  const [success, setSuccess] = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);
  const ok  = (m:string) => { setError(null);   setSuccess(m); };
  const bad = (m:string) => { setSuccess(null); setError(m);   };

  const [confirmPwFlag, setConfirmPwFlag] = useState(false);
  const [otpPhase, setOtpPhase] = useState<"idle"|"sent">("idle");
  const [otpTargetEmail, setOtpTargetEmail] = useState("");

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

  const digitsOnlyLocal = useMemo(() => phoneLocal.replace(/[^\d]/g, ""), [phoneLocal]);
  const normalizedPhone = useMemo(
    () => `+${phoneCode}${digitsOnlyLocal}`,
    [phoneCode, digitsOnlyLocal]
  );

  const phoneChanged =
    phoneCode !== initialPhoneCode || digitsOnlyLocal !== initialPhoneLocal.replace(/[^\d]/g, "");

  const phoneLooksValid = digitsOnlyLocal.length >= 7; // basic check

  const savePhone = async () => {
    try {
      setSavingPhone(true);
      const r = await fetch(`${API}/user/update-phone`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone_number: normalizedPhone }),
      });
      const j = await r.json();
      if (!j.success) return bad(j.message);

      ok("Phone number updated.");
      setInitialPhoneCode(phoneCode);
      setInitialPhoneLocal(digitsOnlyLocal);
      setEditPhone(false);
      if (user) setUser({ ...user, phone_number: j.phone_number });
    } finally {
      setSavingPhone(false);
    }
  };

  const cancelPhoneEdit = () => {
    setPhoneCode(initialPhoneCode);
    setPhoneLocal(initialPhoneLocal);
    setEditPhone(false);
  };

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
              {/* sidebar */}
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

              {/* main */}
              <Col xl={9}>
                <Card className="custom-card">
                  <Card.Body className="p-0">
                    <Tab.Content>
                      <Tab.Pane eventKey="tab-profile" className="p-4">
                        {/* Phone (dropdown for country code + input for local number) */}
                        <Card className="mb-42 border">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h6 className="fw-semibold mb-0">Phone Number</h6>

                            </div>

                            <Form
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (editPhone && phoneLooksValid && phoneChanged) savePhone();
                              }}
                            >
                              <Form.Label className="small text-muted">Mobile</Form.Label>
                              <InputGroup className="flex-nowrap">
                                <Form.Select
                                  value={phoneCode}
                                  onChange={(e) => setPhoneCode(e.target.value)}
                                  style={{ maxWidth: 140 }}
                                  disabled={!editPhone || savingPhone}
                                >
                                  {COUNTRY_CODES.map(c => (
                                    <option key={c.value} value={c.value}>
                                      {c.label}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control
                                  type="tel"
                                  value={phoneLocal}
                                  onChange={(e) => setPhoneLocal(e.target.value)}
                                  placeholder="3xxxxxxx"
                                  disabled={!editPhone || savingPhone}
                                />
                                {!editPhone ? (
                                  <Button
                                    type="button"
                                    variant="outline-secondary"
                                    onClick={() => setEditPhone(true)}
                                  >
                                    Edit
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      type="submit"
                                      disabled={!phoneLooksValid || !phoneChanged || savingPhone}
                                    >
                                      {savingPhone ? "Saving…" : "Save"}
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline-secondary"
                                      onClick={cancelPhoneEdit}
                                      disabled={savingPhone}
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                )}
                              </InputGroup>
                            </Form>
                          </Card.Body>
                        </Card>

                        {/* Email / firm code */}
                        <EmailForm
                          email={email}
                          setEmail={setEmail}
                          role={user.role}
                          firmCode={firmCode}
                          setFirmCode={setFirmCode}
                          requestOtp={requestEmailOtp}
                          saveCode={saveFirmCode}
                        />

                        {/* Firm logo (admins) */}
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

          {/* dialogs */}
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
