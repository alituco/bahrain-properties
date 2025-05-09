"use client";

import React from "react";
import { Card, Nav, Tab } from "react-bootstrap";
import LoginWithOTP from "../LoginWithOTP";
import RegisterForm from "../RegisterWithOTP";

export default function AuthWidget() {
  return (
    <Card className="custom-card my-4">
      <Tab.Container defaultActiveKey="login">
        <Nav variant="pills" className="justify-content-center authentication-tabs">
          <Nav.Item>
            <Nav.Link eventKey="login">Login</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="register">Register</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="login" className="border-0 p-3">
            <LoginWithOTP />
          </Tab.Pane>

          <Tab.Pane eventKey="register" className="border-0 p-3">
            <RegisterForm />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Card>
  );
}
