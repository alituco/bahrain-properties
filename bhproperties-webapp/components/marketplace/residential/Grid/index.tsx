'use client';

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import AptCard, { Apartment } from '../AptCard';

const Grid: React.FC<{ apartments: Apartment[] }> = ({ apartments }) => (
  <Row className="g-3">
    {apartments.map(a => (
      <Col key={a.id} xxl={3} xl={4} md={6}>
        <AptCard apartment={a} />
      </Col>
    ))}
  </Row>
);

export default Grid;
