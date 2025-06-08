'use client';
import React from 'react';
import { Row, Col, Button, Form, Container } from 'react-bootstrap';

type Props = {
  onApply: (filters: Record<string, string>) => void;
};

const FilterBar: React.FC<Props> = ({ onApply }) => {
  const handleApply = () => onApply({ status: 'listed' }); 
  return (
    <Container className="my-4">
      <Row className="g-2 align-items-end">
        <Col md={4}>
          <Form.Label>Location</Form.Label>
          <Form.Select disabled>
            <option>All Bahrain (coming soon)</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Label>Max Price (BHD)</Form.Label>
          <Form.Control type="number" placeholder="e.g. 200 000" disabled />
        </Col>
        <Col md={4}>
          <Button className="w-100" onClick={handleApply}>
            Apply
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default FilterBar;
