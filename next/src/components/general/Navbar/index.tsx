"use client"
import React from "react";
import { styled } from "@mui/system";

const NavbarContainer = styled("nav")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "3rem 4rem",
  backgroundColor: "#ba112a", 
  color: "#fff",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
});

const LogoStyle = styled("div")({
  fontSize: "1.5rem",
  fontWeight: "bold",
  backgroundColor:"#ba112a",
  height:"10%"

});

const NavLinks = styled("div")({
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    flex: 1,
  });

  const LogoImage = styled("img")({
    display: "block",
    margin: "0 auto",
    width:"200px"
  });
  
const NavLink = styled("a")({
  color: "#fff",
  textDecoration: "none",
  fontSize: "1.3rem",
  transition: "color 0.3s ease",
  "&:hover": {
    color: "#df5a6d", 
  },
});

export default function Navbar() {
  return (
    <>
    <LogoStyle>
    <LogoImage src="/logo.png" alt="Logo" />
    </LogoStyle>
    <NavbarContainer>
      <NavLinks>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/services">Services</NavLink>
        <NavLink href="/register">Register</NavLink>
        <NavLink href="/map">Map</NavLink>
        <NavLink href="/dashboard">Dashboard</NavLink>
        <NavLink href="/contact">Contact</NavLink>
      </NavLinks>
    </NavbarContainer>
    </>
  );
}
