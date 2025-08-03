'use client';

import React, { useState } from 'react';
import { Row, Col, Button, Form, Container } from 'react-bootstrap';

export type LandOptions = {
  classifications: string[];
  governorates   : string[];
  locations      : string[];
};

type Props = {
  options : LandOptions;
  onApply : (filters: Record<string, string>) => void;
};

const FilterBar: React.FC<Props> = ({ options, onApply }) => {
  const [nzp , setNzp ] = useState('');
  const [gov , setGov ] = useState('');
  const [loc , setLoc ] = useState('');
  const [sort, setSort] = useState('');
  const [minA, setMinA] = useState('');
  const [maxA, setMaxA] = useState('');

  const push = (
    next: Partial<Record<'nzp'|'gov'|'loc'|'sort'|'minA'|'maxA', string>>
  ) => {
    const state = { nzp, gov, loc, sort, minA, maxA, ...next };

    if ('nzp'  in next) setNzp(next.nzp!);
    if ('gov'  in next) setGov(next.gov!);
    if ('loc'  in next) setLoc(next.loc!);
    if ('sort' in next) setSort(next.sort!);
    if ('minA' in next) setMinA(next.minA!);
    if ('maxA' in next) setMaxA(next.maxA!);

    const f: Record<string,string> = { status:'listed' };
    
    if (state.nzp ) f.nzp_code    = state.nzp;
    if (state.gov ) f.governorate = state.gov;
    if (state.loc ) f.location    = state.loc;
    if (state.sort) f.sort        = state.sort;
    if (state.minA) f.minArea     = state.minA;
    if (state.maxA) f.maxArea     = state.maxA;

    onApply(f);
  };

  const clear = () => {
    setNzp(''); setGov(''); setLoc(''); setSort(''); setMinA(''); setMaxA('');
    onApply({ status:'listed' });
  };

  const hasFilters =
    nzp || gov || loc || sort || minA || maxA;

  return (
    <Container className="my-4">
      <h1 className="page-title fw-semibold fs-4 mb-4">Start your Search</h1>

      <Row className="g-3 align-items-end">

        <Col md={2}>
          <Form.Label className="mb-1">Classification</Form.Label>
          <Form.Select
            value={nzp}
            onChange={e => push({ nzp: e.target.value })}
          >
            <option value="">All</option>
            {options.classifications.map(c => <option key={c}>{c}</option>)}
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Label className="mb-1">Governorate</Form.Label>
          <Form.Select
            value={gov}
            onChange={e => push({ gov: e.target.value })}
          >
            <option value="">All</option>
            {options.governorates.map(g => <option key={g}>{g}</option>)}
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Label className="mb-1">Location</Form.Label>
          <Form.Select
            value={loc}
            onChange={e => push({ loc: e.target.value })}
          >
            <option value="">All</option>
            {options.locations.map(l => <option key={l}>{l}</option>)}
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Label className="mb-1">Price Sort</Form.Label>
          <Form.Select
            value={sort}
            onChange={e => push({ sort: e.target.value })}
          >
            <option value="">None</option>
            <option value="asc">Low → High</option>
            <option value="desc">High → Low</option>
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Label className="mb-1">Min Area (m²)</Form.Label>
          <Form.Control
            type="number"
            min="0"
            value={minA}
            onChange={e => push({ minA: e.target.value })}
          />
        </Col>

        <Col md={2}>
          <Form.Label className="mb-1">Max Area (m²)</Form.Label>
          <Form.Control
            type="number"
            min="0"
            value={maxA}
            onChange={e => push({ maxA: e.target.value })}
          />
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
