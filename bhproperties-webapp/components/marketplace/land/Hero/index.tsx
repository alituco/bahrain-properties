'use client';

import React from 'react';
import { Container } from 'react-bootstrap';

type Props = { onFilterClick?: () => void };

const Hero: React.FC<Props> = ({ onFilterClick }) => (
  <section className="land-hero d-flex align-items-center">
    <Container className="text-center text-white">
      <h1 className="display-4 fw-semibold mb-3">
        Unlock Bahrain’s Prime Land
      </h1>
      <p className="display-10 lead opacity-100 mb-4">
        Residential • Commercial • Industrial — we have every plot you need.
      </p>

    </Container>

    {/* --- background styling --- */}
    <style jsx>{`
      .land-hero {
        position: relative;
        min-height: 440px;
        padding: 4rem 0;
        background: url('https://static.vecteezy.com/system/resources/previews/014/445/766/large_2x/land-plot-for-building-house-aerial-view-land-field-with-pins-pin-location-for-housing-subdivision-residential-development-owned-sale-rent-buy-or-investment-home-or-house-expand-the-city-suburb-free-photo.JPG') center/cover no-repeat;
      }
      /* faint overlay */
      .land-hero::before {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.56);
        backdrop-filter: blur(2px);
      }
      /* layer text above overlay */
      .land-hero > :global(*) {
        position: relative;
        z-index: 1;
      }
    `}</style>
  </section>
);

export default Hero;
