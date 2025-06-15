"use client";

import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import SpkButton from "@/shared/@spk-reusable-components/reusable-uielements/spk-button";

export interface MapFilters {
  block?:      string;
  area?:       string;
  governorate?:string;
  minSize?:    string;
  maxSize?:    string;
}

interface Props {
  areas:         string[];
  governorates:  string[];
  values:        MapFilters;
  onApply:      (f: MapFilters) => void;
  onClear:      () => void;
}

const MapFilter: React.FC<Props> = ({
  areas,
  governorates,
  values,
  onApply,
  onClear,
}) => {
  const [block, setBlock] = useState(values.block ?? "");
  const [area,  setArea]  = useState(values.area  ?? "");
  const [gov,   setGov]   = useState(values.governorate ?? "");
  const [minS,  setMinS]  = useState(values.minSize ?? "");
  const [maxS,  setMaxS]  = useState(values.maxSize ?? "");

  useEffect(() => {
    setBlock(values.block  ?? "");
    setArea (values.area   ?? "");
    setGov  (values.governorate ?? "");
    setMinS (values.minSize ?? "");
    setMaxS (values.maxSize ?? "");
  }, [values]);

  const primaryChosen = block || area || gov;
  const applyDisabled = !primaryChosen;   

  const handleApply = () =>
    onApply({ block, area, governorate: gov, minSize: minS, maxSize: maxS });

  const handleClear = () => {
    setBlock(""); setArea(""); setGov(""); setMinS(""); setMaxS("");
    onClear();
  };

  return (
    <Card className="custom-card">
      <Card.Header className="justify-content-between">
        <Card.Title>Filter</Card.Title>
        <SpkButton Buttonvariant="link" onClickfunc={handleClear}>
          Clear All
        </SpkButton>
      </Card.Header>

      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Block Number</Form.Label>
          <Form.Control
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            placeholder="e.g. 434"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Governorate</Form.Label>
          <Form.Select value={gov} onChange={(e) => setGov(e.target.value)}>
            <option value="">All</option>
            {governorates.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Area</Form.Label>
          <Form.Select value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">All</option>
            {areas.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Row className="g-2 mb-4">
          <Form.Label className="fw-semibold">Plot Size (m²)</Form.Label>
          <Col>
            <Form.Control
              type="number"
              min={0}
              placeholder="Min"
              value={minS}
              onChange={(e) => setMinS(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Control
              type="number"
              min={0}
              placeholder="Max"
              value={maxS}
              onChange={(e) => setMaxS(e.target.value)}
            />
          </Col>
        </Row>

        <SpkButton
          Buttonvariant="primary"
          Disabled={applyDisabled}
          onClickfunc={handleApply}
        >
          Apply Filters
        </SpkButton>
      </Card.Body>
    </Card>
  );
};

export default MapFilter;
