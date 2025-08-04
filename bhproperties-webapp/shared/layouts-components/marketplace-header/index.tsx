"use client";

import React from "react";
import Link from "next/link";
import { basePath } from "@/next.config";

/**
 * MarketplaceHeader
 * -----------------
 * • Plain white bar at page top
 * • logo |  Browse Firms   Realtor Login  |
 * • All fonts / colors are inline, so they cannot be overridden
 */
const MarketplaceHeader: React.FC = () => (
  <header
    style={{
      width: "100%",
      background: "#ffffff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
      borderBottom: "1px solid #e5e5e5",
      display: "flex",
      alignItems: "center",
      padding: "7px 100px",
      zIndex: 999,
    }}
  >
    {/* logo */}
    <Link href="/" style={{ display: "flex", alignItems: "center" }}>
      <img
        src={`${process.env.NODE_ENV === "production" ? basePath : ""}/assets/images/brand-logos/desktop-white.png`}
        alt="Logo"
        height={56}
      />
    </Link>

    {/* spacer pushes actions to the right */}
    <div style={{ flex: 1 }} />

    {/* Browse Firms (link) */}
    <Link
      href="/firms"
      style={{
        fontSize: "15px",
        fontWeight: 500,
  
        textDecoration: "none",
      }}
    >
      Browse&nbsp;Firms
    </Link>

    {/* Realtor Login (button-style link) */}
    <Link
      href="/login"
      style={{
        fontSize: "15px",
        fontWeight: 500,
        color: "red",
        border: "1px solid black",
        padding: "10px 20px",
        borderRadius: "6px",
        marginLeft: "25px",
        textDecoration: "none",
        display: "inline-block",
      }}
    >
      Realtor&nbsp;Login
    </Link>
  </header>
);

export default MarketplaceHeader;
