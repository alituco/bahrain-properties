/* pages/profile-settings.tsx
   front-end only – clean & typed */

import Link  from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import { Card, Col, Form, Nav, Row, Tab } from 'react-bootstrap';

import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo        from '@/shared/layouts-components/seo/seo';

import SpkButton  from '@/shared/@spk-reusable-components/reusable-uielements/spk-button';
import SpkAlert   from '@/shared/@spk-reusable-components/reusable-uielements/spk-alert';

type Role = 'admin' | 'agent' | 'viewer';

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

async function fetchUserRole(): Promise<Role> {
  /* TODO: replace with your real endpoint */
  const { role } = await fetch('/api/auth/me').then(r => r.json());
  return role as Role;
}

/* ------------------------------------------------------------------ */
/* component                                                           */
/* ------------------------------------------------------------------ */

const ProfileSettings = () => {
  /* ------------------------------------------------------------------ */
  /* form state                                                         */
  /* ------------------------------------------------------------------ */
  const [role,            setRole]            = useState<Role>('viewer');
  const [email,           setEmail]           = useState('');
  const [currentPw,       setCurrentPw]       = useState('');
  const [newPw,           setNewPw]           = useState('');
  const [confirmPw,       setConfirmPw]       = useState('');
  const [firmCode,        setFirmCode]        = useState('');
  const [confirmTarget,   setConfirmTarget]   = useState<'email' | 'password' | null>(null);
  const [successMessage,  setSuccessMessage]  = useState<string | null>(null);

  /* ------------------------------------------------------------------ */
  /* load user role on mount                                            */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    fetchUserRole().then(setRole).catch(() => setRole('viewer'));
  }, []);

  /* ------------------------------------------------------------------ */
  /* handlers                                                           */
  /* ------------------------------------------------------------------ */
  const askConfirm = (target: 'email' | 'password') => {
    setSuccessMessage(null);
    setConfirmTarget(target);
  };

  const handleConfirm = () => {
    // 👉 call your backend here
    setConfirmTarget(null);
    setSuccessMessage(
      confirmTarget === 'email'
        ? 'Email updated successfully.'
        : 'Password updated successfully.'
    );

    if (confirmTarget === 'password') {
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    }
  };

  /* ------------------------------------------------------------------ */
  /* UI                                                                 */
  /* ------------------------------------------------------------------ */
  return (
    <Fragment>
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
          {/* -------------  left nav  ------------- */}
          <Col xl={3}>
            <Card className="custom-card">
              <Card.Body>
                <Nav className="nav-tabs flex-column nav-tabs-header mb-0">
                  <Nav.Item><Nav.Link eventKey="tab-profile"><i className="ri-user-line me-2 text-primary" />Profile</Nav.Link></Nav.Item>
                  <Nav.Item><Nav.Link eventKey="tab-security"><i className="ri-lock-line me-2 text-primary" />Security</Nav.Link></Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          {/* -------------  main content  ------------- */}
          <Col xl={9}>
            <Card className="custom-card">
              <Card.Body className="p-0">
                <Tab.Content>

                  {/* ---------- Profile ---------- */}
                  <Tab.Pane eventKey="tab-profile" className="p-4">
                    <Form onSubmit={e => e.preventDefault()}>
                      <Form.Group as={Row} className="mb-3" controlId="email">
                        <Form.Label column sm={3}>Email address</Form.Label>
                        <Col sm={9}>
                          <Form.Control
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="name@example.com"
                          />
                        </Col>
                      </Form.Group>

                      {role === 'admin' && (
                        <Form.Group as={Row} className="mb-3" controlId="firmCode">
                          <Form.Label column sm={3}>Firm registration code</Form.Label>
                          <Col sm={9}>
                            <Form.Control
                              type="text"
                              value={firmCode}
                              onChange={e => setFirmCode(e.target.value)}
                              placeholder="e.g. BH-FIRM-001"
                            />
                          </Col>
                        </Form.Group>
                      )}

                      <div className="text-end">
                        <SpkButton
                          Buttontype="button"
                          Buttonvariant="primary"
                          onClickfunc={() => askConfirm('email')}
                        >
                          Save email
                        </SpkButton>
                      </div>
                    </Form>
                  </Tab.Pane>

                  {/* ---------- Security ---------- */}
                  <Tab.Pane eventKey="tab-security" className="p-4">
                    <Form onSubmit={e => e.preventDefault()}>
                      <Form.Group as={Row} className="mb-3" controlId="currentPw">
                        <Form.Label column sm={4}>Current password</Form.Label>
                        <Col sm={8}>
                          <Form.Control
                            type="password"
                            value={currentPw}
                            onChange={e => setCurrentPw(e.target.value)}
                          />
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className="mb-3" controlId="newPw">
                        <Form.Label column sm={4}>New password</Form.Label>
                        <Col sm={8}>
                          <Form.Control
                            type="password"
                            value={newPw}
                            onChange={e => setNewPw(e.target.value)}
                          />
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className="mb-4" controlId="confirmPw">
                        <Form.Label column sm={4}>Confirm new password</Form.Label>
                        <Col sm={8}>
                          <Form.Control
                            type="password"
                            value={confirmPw}
                            onChange={e => setConfirmPw(e.target.value)}
                          />
                        </Col>
                      </Form.Group>

                      <div className="text-end">
                        <SpkButton
                          Buttontype="button"
                          Buttonvariant="primary"
                          Disabled={!newPw || newPw !== confirmPw}
                          onClickfunc={() => askConfirm('password')}
                        >
                          Change password
                        </SpkButton>
                      </div>
                    </Form>
                  </Tab.Pane>

                </Tab.Content>
              </Card.Body>

              {successMessage && (
                <Card.Footer className="border-top-0 p-3">
                  <SpkAlert variant="success" CustomClass="mb-0">
                    {successMessage}
                  </SpkAlert>
                </Card.Footer>
              )}
            </Card>
          </Col>
        </Tab.Container>
      </Row>

      {/* ---------- confirm overlay ---------- */}
      {confirmTarget && (
          <div className="overlay-backdrop d-flex align-items-center justify-content-center">
          <div style={{ maxWidth: 440, width: '90%' }}>
            <SpkAlert variant="warning" dismissible={false} CustomClass="p-4">
              <p className="mb-3 fw-medium">
                {confirmTarget === 'email'
                  ? 'Are you sure you want to update your email address?'
                  : 'Are you sure you want to change your password?'}
              </p>
              <div className="d-flex justify-content-end gap-2">
                <SpkButton
                  Buttontype="button"
                  Buttonvariant="secondary"
                  Size="sm"
                  onClickfunc={() => setConfirmTarget(null)}
                >
                  Cancel
                </SpkButton>
                <SpkButton
                  Buttontype="button"
                  Buttonvariant="primary"
                  Size="sm"
                  onClickfunc={handleConfirm}
                >
                  Yes, save
                </SpkButton>
              </div>
            </SpkAlert>
          </div>
        </div>
      )}
    </Fragment>
  );
};

ProfileSettings.layout = 'ContentLayout';
export default ProfileSettings;
