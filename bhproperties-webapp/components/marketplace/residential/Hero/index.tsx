'use client';

import React from 'react';
import { Container, Button } from 'react-bootstrap';

type Props = { onFilterClick?: () => void };

const Hero: React.FC<Props> = ({ onFilterClick }) => (
  <section className="apt-hero d-flex align-items-center">
    <Container className="text-center text-white">
      <h1 className="display-5 fw-semibold mb-3">Find Your Next Home</h1>
      <p className="lead opacity-100 mb-4">
        Browse Bahrain’s best apartments — furnished & unfurnished, rent or sale.
      </p>
      {onFilterClick && (
        <Button size="lg" variant="light" onClick={onFilterClick}>
          Start Searching
        </Button>
      )}
    </Container>

    <style jsx>{`
      .apt-hero {
        position: relative;
        min-height: 440px;
        padding: 4rem 0;
        background:
          url('https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg') center/cover
          no-repeat;
      }
      .apt-hero::before {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, .55);
      }
      .apt-hero > :global(*) { position: relative; z-index: 1; }
    `}</style>
  </section>
);

export default Hero;
