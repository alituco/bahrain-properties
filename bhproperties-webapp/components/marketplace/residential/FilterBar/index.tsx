'use client';

import React, { useState } from 'react';
import { Row, Col, Button, Form, Container } from 'react-bootstrap';
import type { AptOptions } from '../types';

type Props = {
  options : AptOptions;
  onApply : (filters: Record<string, string>) => void;
};

const FilterBar: React.FC<Props> = ({ options, onApply }) => {
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [area, setArea]   = useState('');
  const [sort, setSort]   = useState('');
  const [minP, setMinP]   = useState('');
  const [maxP, setMaxP]   = useState('');

  const push = (next: Partial<Record<'beds'|'baths'|'area'|'sort'|'minP'|'maxP', string>>) => {
    const st = { beds, baths, area, sort, minP, maxP, ...next };
    if ('beds'  in next) setBeds(next.beds!);
    if ('baths' in next) setBaths(next.baths!);
    if ('area'  in next) setArea(next.area!);
    if ('sort'  in next) setSort(next.sort!);
    if ('minP'  in next) setMinP(next.minP!);
    if ('maxP'  in next) setMaxP(next.maxP!);

    const f: Record<string, string> = { status: 'available' };
    if (st.beds)  f.bedrooms   = st.beds;
    if (st.baths) f.bathrooms  = st.baths;
    if (st.area)  f.area_name  = st.area;
    if (st.sort)  f.sort       = st.sort;
    if (st.minP)  f.minPrice   = st.minP;
    if (st.maxP)  f.maxPrice   = st.maxP;

    onApply(f);
  };

  const clear = () => {
    setBeds(''); setBaths(''); setArea(''); setSort(''); setMinP(''); setMaxP('');
    onApply({ status: 'available' });
  };

  const hasFilters = beds || baths || area || sort || minP || maxP;

  return (
    <Container className="my-4">
      <h1 className="page-title fw-semibold fs-4 mb-4">Refine Search</h1>

      <Row className="g-3 align-items-end">

        <Col md={2}>
          <Form.Label className="mb-1">Bedrooms</Form.Label>
          <Form.Select value={beds} onChange={e => push({ beds: e.target.value })}>
            <option value="">Any</option>
            {options.bedrooms.map(n => <option key={n}>{n}</option>)}
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Label className="mb-1">Bathrooms</Form.Label>
          <Form.Select value={baths} onChange={e => push({ baths: e.target.value })}>
            <option value="">Any</option>
            {options.bathrooms.map(n => <option key={n}>{n}</option>)}
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Label className="mb-1">Area</Form.Label>
          <Form.Select value={area} onChange={e => push({ area: e.target.value })}>
            <option value="">All</option>
            {options.areas.map(a => <option key={a}>{a}</option>)}
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Label className="mb-1">Price Sort</Form.Label>
          <Form.Select value={sort} onChange={e => push({ sort: e.target.value })}>
            <option value="">None</option>
            <option value="asc">Low → High</option>
            <option value="desc">High → Low</option>
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Label className="mb-1">Min Price (BHD)</Form.Label>
          <Form.Control type="number" min="0"
                        value={minP} onChange={e => push({ minP: e.target.value })}/>
        </Col>

        <Col md={2}>
          <Form.Label className="mb-1">Max Price (BHD)</Form.Label>
          <Form.Control type="number" min="0"
                        value={maxP} onChange={e => push({ maxP: e.target.value })}/>
        </Col>

        {hasFilters && (
          <Col md={2}>
            <Button variant="secondary" className="w-100" onClick={clear}>
              Clear
            </Button>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default FilterBar;
