// components/firms/FirmsGrid.tsx
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FirmCard, { Firm } from '../FirmCard';

const FirmsGrid: React.FC<{ firms: Firm[] }> = ({ firms }) => {
  if (!firms || firms.length === 0) {
    return <div className="text-center text-muted my-5">No brokers found</div>;
  }

  return (
    <Row className="g-4">
      {firms.map((firm) => (
        <Col key={firm.firm_id} xs={12} md={4} lg={4}>
          <FirmCard firm={firm} />
        </Col>
      ))}
    </Row>
  );
};

export default FirmsGrid;
