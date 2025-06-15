'use client';

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import LandCard, { Land } from '../LandCard';

const Grid: React.FC<{ land: Land[] }> = ({ land }) => (
  <Row className="g-3">
    {land.map((l) => (
      <Col key={l.id} xxl={3} xl={4} md={6}>
        <LandCard land={l} />
      </Col>
    ))}
  </Row>
);

export default Grid;
