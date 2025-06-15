"use client";

import React from "react";
import { useRouter } from "next/router";

export type AssetKind = "residential" | "commercial" | "land";

const HeroSearch: React.FC = () => {
  const router = useRouter();

  const go = (kind: AssetKind) => {
    router.push(`/marketplace/${kind}`);
  };

  return (
    <section className="hero d-flex flex-column justify-content-center align-items-center text-center">

      <h1 className="display-5 fw-bold text-white mb-4">
        Find your next property in&nbsp;Bahrain
      </h1>

      <div className="d-flex gap-3 flex-wrap justify-content-center">
        {(["residential", "commercial", "land"] as AssetKind[]).map(kind => (
          <button
            key={kind}
            className="pick-btn text-capitalize fw-semibold px-4 py-2"
            onClick={() => go(kind)}
          >
            {kind}
          </button>
        ))}
      </div>

      <style jsx>{`
        .hero {
          min-height: 580px;
          background: #2a3241 url("https://tbywordpress.s3.eu-west-2.amazonaws.com/wp-content/uploads/2025/02/12054745/shutterstock_2464170749.jpg") center/cover no-repeat;
          /* ↑ swap the colour / image for a real hero shot */
        }

        .pick-btn {
          background: rgba(255,255,255,0.15);
          border: 2px solid rgba(255,255,255,0.6);
          border-radius: 999px;
          color: #fff;
          font-size: 1.1rem;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
        }
        .pick-btn:hover,
        .pick-btn:focus {
          background: #fff;
          color: #212529;
          transform: translateY(-2px);
          border-color: #fff;
        }
        .pick-btn:active {
          transform: translateY(0);
        }

        /* Mobile tweaks */
        @media (max-width: 575.98px) {
          .hero          { padding: 0 1rem; }
          .pick-btn      { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default HeroSearch;
