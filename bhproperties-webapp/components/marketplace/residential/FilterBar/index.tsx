'use client';

import React, { useState } from 'react';
import { Row, Col, Button, Form, Container } from 'react-bootstrap';
import type { ResidentialOptions } from '../types';

type Props = {
  options : ResidentialOptions;
  onApply : (filters: Record<string, string>) => void;   // parent handler
};

/* ──────────────────────────────────────────────────────────── */

const FilterBar: React.FC<Props> = ({ options, onApply }) => {
  /* local UI state ------------------------------------------------ */
  const [ptype , setPtype ] = useState('');   // apartment | house | ''
  const [deal  , setDeal  ] = useState('');   // sale | rent | ''
  const [beds  , setBeds  ] = useState('');
  const [baths , setBaths ] = useState('');
  const [area  , setArea  ] = useState('');
  const [sort  , setSort  ] = useState('');
  const [minP  , setMinP  ] = useState('');
  const [maxP  , setMaxP  ] = useState('');

  /* ---------- helper --------------------------------------------- */
  const push = (
    next: Partial<Record<
    'ptype'|'deal'|'beds'|'baths'|'area'|'sort'|'minP'|'maxP', string
  >>) => {
    /* merge into the in-component state … */
    const state = {
      ptype , deal , beds , baths , area  , sort , minP , maxP , ...next
    };

    /* …and sync the individual pieces of state                     */
    if ('ptype' in next) setPtype(next.ptype!);
    if ('deal'  in next) setDeal (next.deal! );
    if ('beds'  in next) setBeds (next.beds! );
    if ('baths' in next) setBaths(next.baths!);
    if ('area'  in next) setArea (next.area! );
    if ('sort'  in next) setSort (next.sort! );
    if ('minP'  in next) setMinP (next.minP! );
    if ('maxP'  in next) setMaxP (next.maxP! );

    /* build the query-string payload the back-end expects           */
    const f: Record<string, string> = { status: 'available' };

    /* NOTE: we *always* include the key – even if the value is ''.
       The parent replaces its filter object entirely, so stale keys
       disappear automatically.                                       */
    f.type          = state.ptype;          // '' | house | apartment
    f.listing_type  = state.deal;           // '' | sale | rent
    f.sort          = state.sort;
    if (state.beds ) f.bedrooms  = state.beds;
    if (state.baths) f.bathrooms = state.baths;
    if (state.area ) f.area_name = state.area;
    if (state.sort ) f.sort      = state.sort;
    if (state.minP ) f.minP      = state.minP;



    // TEMPORARY FILTER FIXES
    if (state.minP && state.minP.length > 1) {
      f.minPrice  = state.minP;
    } else {
      f.minPrice = "0";
    }

    if (state.maxP && state.maxP.length >= 1) {
      f.maxPrice  = state.maxP
    } else {
      f.maxPrice = "999999999"
    }

    /* hand the brand-new filter object to the page component ----- */
    onApply(f);
  };

  /* ---------- reset --------------------------------------------- */
  const clear = () => {
    setPtype(''); setDeal(''); setBeds(''); setBaths('');
    setArea(''); setSort(''); setMinP(''); setMaxP('');
    onApply({ status: 'available', type:'', listing_type:'' });
  };

  const hasFilters =
    ptype || deal || beds || baths || area || sort || minP || maxP;

  /* ---------- UI ------------------------------------------------- */
  return (
    <Container className="my-4">
      <h1 className="page-title fw-semibold fs-4 mb-4">Refine&nbsp;Search</h1>

      <Row className="g-3 align-items-end">
        {/* property type ---------------------------------------- */}
        <Col md={2}>
          <Form.Label className="mb-1">Property</Form.Label>
          <Form.Select
            value={ptype}
            onChange={e => push({ ptype: e.target.value })}
          >
            <option value="">Both</option>
            {options.types.map(t => (
              <option key={t} value={t}>{t[0].toUpperCase()+t.slice(1)}</option>
            ))}
          </Form.Select>
        </Col>

        {/* deal type ------------------------------------------- */}
        <Col md={2}>
          <Form.Label className="mb-1">Deal&nbsp;Type</Form.Label>
          <Form.Select
            value={deal}
            onChange={e => push({ deal: e.target.value })}
          >
            <option value="">Any</option>
            <option value="sale">Buy&nbsp;/&nbsp;Sale</option>
            <option value="rent">Rent&nbsp;/&nbsp;Lease</option>
          </Form.Select>
        </Col>

        {/* bedrooms / baths / area ----------------------------- */}
        <Col md={2}>
          <Form.Label className="mb-1">Bedrooms</Form.Label>
          <Form.Select value={beds} onChange={e=>push({beds:e.target.value})}>
            <option value="">Any</option>
            {options.bedrooms.map(n=><option key={n}>{n}</option>)}
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Label className="mb-1">Bathrooms</Form.Label>
          <Form.Select value={baths} onChange={e=>push({baths:e.target.value})}>
            <option value="">Any</option>
            {options.bathrooms.map(n=><option key={n}>{n}</option>)}
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Label className="mb-1">Area</Form.Label>
          <Form.Select value={area} onChange={e=>push({area:e.target.value})}>
            <option value="">All</option>
            {options.areas.map(a=> <option key={a}>{a}</option>)}
          </Form.Select>
        </Col>

        {/* price sort ------------------------------------------ */}
        <Col md={2}>
          <Form.Label className="mb-1">Price&nbsp;Sort</Form.Label>
          <Form.Select value={sort} onChange={e=>push({sort:e.target.value})}>
            <option value="">None</option>
            <option value="asc">Low&nbsp;→&nbsp;High</option>
            <option value="desc">High&nbsp;→&nbsp;Low</option>
          </Form.Select>
        </Col>

        {/* min / max price ------------------------------------- */}
        <Col md={2}>
          <Form.Label className="mb-1">Min&nbsp;Price&nbsp;(BHD)</Form.Label>
          <Form.Control
            type="number" 
            min="0"
            value={minP}
            onChange={ e => push({minP : e.target.value})}
          />
        </Col>

        <Col md={2}>
          <Form.Label className="mb-1">Max&nbsp;Price&nbsp;(BHD)</Form.Label>
          <Form.Control
            type="number" 
            min="0"
            value={maxP}
            onChange={ e => push({ maxP : e.target.value })}
          />
        </Col>

        {/* clear button ---------------------------------------- */}
        {hasFilters && (
          <Col md={2}>
            <Button className="w-100" variant="secondary" onClick={clear}>
              Clear
            </Button>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default FilterBar;
