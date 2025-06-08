"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Typography } from "@mui/material";
import { basePath } from "@/next.config";

const NAV_ITEMS = [
  { href: "/buy",   label: "Buy" },
  { href: "/rent",  label: "Rent" },
  { href: "/agent", label: "Find Agent" }
];

const MarketplaceHeader: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="app-header sticky border-bottom shadow-sm px-4 py-2">
        <div className="main-header-container d-flex align-items-center">

          <Link href="/" className="header-logo d-flex align-items-center me-3">
            <img
              height={34}
              alt="Logo"
              className="desktop-dark"
              src={`${process.env.NODE_ENV === "production" ? basePath : ""}/assets/images/brand-logos/desktop-dark.png`}
            />
          </Link>

          <ul className="header-nav d-none d-lg-flex align-items-center gap-4 ms-auto mb-0">
            {NAV_ITEMS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="fw-medium text-dark link-underline-opacity-0 link-underline-opacity-75-hover"
                >
                  <Typography component="span" variant="body1">
                    {label}
                  </Typography>
                </Link>
              </li>
            ))}
          </ul>

          <button
            aria-label="Open navigation"
            className="navbar-toggler d-lg-none border-0 p-0 ms-auto"
            onClick={() => setOpen(true)}
          >
            <i className="ri-menu-line fs-24" />
          </button>
        </div>
      </header>

      {open && (
        <div className="mobile-overlay" onClick={() => setOpen(false)}>
          <div className="overlay-panel" onClick={e => e.stopPropagation()}>
            <div className="overlay-header d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
              <Link href="/" className="d-flex align-items-center">
                <img
                  height={30}
                  alt="Logo"
                  src={`${process.env.NODE_ENV === "production" ? basePath : ""}/assets/images/brand-logos/desktop-dark.png`}
                />
              </Link>
              <button
                aria-label="Close navigation"
                className="btn btn-link text-dark fs-3 p-0 m-0"
                onClick={() => setOpen(false)}
              >
                <i className="ri-close-line" />
              </button>
            </div>

            <ul className="overlay-menu list-unstyled m-0 px-3 py-4">
              {NAV_ITEMS.map(({ href, label }) => (
                <li key={href} className="mb-3">
                  <Link
                    href={href}
                    className="d-block fw-semibold text-dark overlay-link"
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <style jsx>{`
        .header-nav { list-style: none; padding: 0; }
        .navbar-toggler { background: none; cursor: pointer; }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 1055;
          background: rgba(33, 33, 33, 0.85);
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
        }

        .overlay-panel {
          width: 100%;
          background: #ffffff;
          box-shadow: 0 4px 16px rgba(0,0,0,.15);
          animation: slideDown .25s ease-out;
        }
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to   { transform: translateY(0); }
        }

        /* ----- NEW: center menu items ----- */
        .overlay-menu {
          display: flex;
          flex-direction: column;
          align-items: center;   /* horizontal centering */
        }

        .overlay-link {
          font-size: 1.75rem;
          line-height: 1.3;
          text-decoration: none;
        }
        .overlay-link:hover { text-decoration: underline; }
      `}</style>
    </>
  );
};

export default MarketplaceHeader;
