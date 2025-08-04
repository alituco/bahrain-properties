"use client";

import React, { useState } from "react";
import Link from "next/link";
import { basePath } from "@/next.config";

const MarketplaceHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* ---------- top bar ---------- */}
      <header className="marketplace-header">
        {/* logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <img
            src={`${
              process.env.NODE_ENV === "production" ? basePath : ""
            }/assets/images/brand-logos/desktop-white.png`}
            alt="Logo"
            height={56}
          />
        </Link>

        <div style={{ flex: 1 }} />

        {/* desktop nav */}
        <nav className="desktop-nav">
          <Link
            href="/firms"
            style={{
              fontSize: "20px",
              fontWeight: 600,
              textDecoration: "none",
              marginRight: "28px",
            }}
          >
            Browse&nbsp;Firms
          </Link>

          <Link
            href="/login"
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#ffffff",
              backgroundColor: "#ff6a00",
              padding: "10px 28px",
              borderRadius: "6px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Realtor&nbsp;Login
          </Link>
        </nav>

        {/* hamburger (mobile only) */}
        <button
          aria-label="Open menu"
          className="mobile-toggle"
          onClick={() => setMenuOpen(true)}
        >
          &#9776;
        </button>
      </header>

      {/* ---------- mobile overlay ---------- */}
      {menuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="mobile-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close menu"
              className="close-btn"
              onClick={() => setMenuOpen(false)}
            >
              &times;
            </button>

            <Link
              href="/firms"
              className="mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              Browse Firms
            </Link>

            <Link
              href="/login"
              className="mobile-btn"
              onClick={() => setMenuOpen(false)}
            >
              Realtor Login
            </Link>
          </div>
        </div>
      )}

      {/* ---------- styles ---------- */}
      <style jsx>{`
        /* --- header --- */
        .marketplace-header {
          width: 100%;
          background: #ffffff;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          align-items: center;
          padding: 12px 24px;
          z-index: 999;
        }

        /* --- desktop nav hidden on small screens --- */
        .desktop-nav {
          display: flex;
          align-items: center;
        }

        /* --- hamburger hidden on desktop --- */
        .mobile-toggle {
          font-size: 32px;
          background: none;
          border: none;
          cursor: pointer;
          display: none;
        }

        /* --- overlay --- */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .mobile-panel {
          background: #ffffff;
          width: 85%;
          max-width: 320px;
          padding: 32px 24px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 24px;
        }
        .close-btn {
          align-self: flex-end;
          font-size: 36px;
          background: none;
          border: none;
          cursor: pointer;
          line-height: 1;
        }
        .mobile-link {
          font-size: 20px;
          font-weight: 600;
          color: #0050c8;
          text-decoration: none;
          text-align: center;
        }
        .mobile-btn {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          background: #ff6a00;
          padding: 12px 0;
          border-radius: 6px;
          text-align: center;
          text-decoration: none;
        }

        /* --- responsive rules --- */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          .mobile-toggle {
            display: block;
          }
          /* shrink header padding for narrow screens */
          .marketplace-header {
            padding: 12px 16px;
          }
        }
      `}</style>
    </>
  );
};

export default MarketplaceHeader;
