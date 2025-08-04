"use client";

import React, { useState } from "react";
import Link from "next/link";
import { basePath } from "@/next.config";

const MarketplaceHeader: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ─────────── TOP BAR ─────────── */}
      <header
        className="mh-wrap"
        style={{
          width: "100%",
          background: "#ffffff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
          borderBottom: "1px solid #e5e5e5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1em 3em",
          zIndex: 999,
        }}
      >
        {/* logo (left) */}
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <img
            className="mh-logo"
            src={`${
              process.env.NODE_ENV === "production" ? basePath : ""
            }/assets/images/brand-logos/desktop-white.png`}
            alt="Logo"
            height={56}
          />
        </Link>

        {/* desktop links (right) */}
        <nav className="mh-links">
          <Link
            href="/firms"
            style={{
              fontSize: "15px",
              fontWeight: 500,
              textDecoration: "none",
              marginRight: "18px",
            }}
          >
            Browse&nbsp;Firms
          </Link>

          <Link
            href="/login"
            style={{
              fontSize: "15px",
              fontWeight: 500,
              color: "red",
              border: "1px solid black",
              padding: "10px 20px",
              borderRadius: "6px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Realtor&nbsp;Login
          </Link>
        </nav>

        {/* hamburger (right / mobile only) */}
        <button
          className="mh-burger"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* ─────────── DROPDOWN (mobile) ─────────── */}
      {open && (
        <div
          className="mh-dropdown"
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e5e5e5",
            boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
            padding: "8px 16px 12px",
            textAlign: "center",            // ⬅ center the links
          }}
        >
          <Link
            href="/firms"
            style={{
              display: "block",
              fontSize: "15px",
              fontWeight: 500,
              textDecoration: "none",
              margin: "0 auto 10px",
            }}
            onClick={() => setOpen(false)}
          >
            Browse&nbsp;Firms
          </Link>

          <Link
            href="/login"
            style={{
              display: "inline-block",
              fontSize: "15px",
              fontWeight: 500,
              color: "red",
              border: "1px solid black",
              padding: "8px 16px",
              borderRadius: "6px",
              textDecoration: "none",
            }}
            onClick={() => setOpen(false)}
          >
            Realtor&nbsp;Login
          </Link>
        </div>
      )}

      {/* ─────────── INLINE STYLES / MEDIA QUERIES ─────────── */}
      <style jsx>{`
        @media (max-width: 640px) {
          .mh-wrap {
            padding: 10px; !important
          }
          .mh-logo {
            height: 40px !important;
          }
          .mh-links {
            display: none !important;        /* hide desktop links */
          }
          .mh-burger {
            display: inline-flex !important;
          }
        }
        @media (min-width: 641px) {
          .mh-burger,
          .mh-dropdown {
            display: none !important;
          }
        }
        .mh-burger {
          background: none;
          border: none;
          padding: 10px;
          cursor: pointer;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .mh-burger span {
          display: block;
          width: 24px;
          height: 2px;
          background: #000;
          margin: 4px 0;
        }
      `}</style>
    </>
  );
};

export default MarketplaceHeader;
