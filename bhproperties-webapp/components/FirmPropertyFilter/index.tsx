"use client";

import React, { useState } from "react";
import { Card, Form } from "react-bootstrap";
import SpkButton from "@/shared/@spk-reusable-components/reusable-uielements/spk-button";

interface Props {
  areaOptions: string[];
  onApply: (f: Record<string, string>) => void;
  onClear: () => void;
}

const STATUSES = ["listed", "sold", "paperwork", "under_contract"];

export default function FirmPropertyFilter({ areaOptions, onApply, onClear }: Props) {
  const [block, setBlock] = useState("");
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleApply = () => {
    onApply({ block, area, status, minPrice, maxPrice });
  };

  const handleClear = () => {
    onApply({});
  };

  return (
    <Card className="custom-card products-navigation-card">
      <div className="card-header justify-content-between">
        <div className="card-title">Filter</div>
        <SpkButton
          Size="sm"
          Buttonvariant="link"
          onClickfunc={handleClear}
        >
          Clear All
        </SpkButton>
      </div>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Block Number</Form.Label>
          <Form.Control
            type="number"
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            placeholder="e.g. 123"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Area</Form.Label>
          <Form.Select value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">All</option>
            {areaOptions.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Status</Form.Label>
          <Form.Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Price Range ($)</Form.Label>
          <div className="d-flex align-items-center gap-2">
            <Form.Control
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span>–</span>
            <Form.Control
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </Form.Group>

        <SpkButton
          Buttonvariant="primary"
          onClickfunc={handleApply}
        >
          Apply Filters
        </SpkButton>
      </Card.Body>
    </Card>
  );
}
