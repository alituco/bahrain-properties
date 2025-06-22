'use client';

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import AptCard   from '../AptCard';
import HouseCard from '../HouseCard';
import type { Listing } from '../types';

interface Props {
  listings: Listing[];
}

const Grid: React.FC<Props> = ({ listings }) => (
  <Row className="g-3">
    {listings.map((l) =>
      l.property_type === 'apartment' ? (
        <Col key={l.id} xxl={3} xl={4} md={6}>
          <AptCard apartment={l} />
        </Col>
      ) : (
        <Col key={l.id} xxl={3} xl={4} md={6}>
          <HouseCard house={l} />
        </Col>
      )
    )}
  </Row>
);

export default Grid;
