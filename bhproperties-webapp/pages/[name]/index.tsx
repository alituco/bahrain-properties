'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
  Collapse,
} from 'react-bootstrap';
import Image from 'next/image';
import Seo from '@/shared/layouts-components/seo/seo';
import LandCard, { Land as LandModel } from '@/components/marketplace/land/LandCard';
import HouseCard from '@/components/marketplace/residential/HouseCard';
import AptCard from '@/components/marketplace/residential/AptCard';

const API = process.env.NEXT_PUBLIC_API_URL!;

type FirmRow = {
  firm_id: number;
  firm_name: string;
  logo_url?: string | null;
  listings_count?: string | number | null;
};

type PropertyRow = {
  id: number;
  property_type: string | null;
  listing_type: string | null;
  status: string | null;
  title: string | null;
  asking_price: number | null;
  rent_price: number | null;
  sold_price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  created_at: string;
  updated_at: string;
  block_no: string | null;
  area_name: string | null;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  geojson?: string | null;
  nzp_code?: string | null;
  shape_area?: number | null;
};

type OptionsPayload = {
  bedrooms: string[];
  bathrooms: string[];
  areas: string[];
  types: string[];
};

type PropertiesPayload = {
  properties: PropertyRow[];
  options: OptionsPayload;
};

type FormState = {
  property_type: string;
  status: string;
  bedrooms: string;
  bathrooms: string;
  minPrice: string;
  maxPrice: string;
  area_name: string;
  sort: '' | 'asc' | 'desc';
};

function slugify(s: string) {
  return (s || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const initialForm: FormState = {
  property_type: '',
  status: '',
  bedrooms: '',
  bathrooms: '',
  minPrice: '',
  maxPrice: '',
  area_name: '',
  sort: '',
};

const FirmPage: React.FC = () => {
  const router = useRouter();
  const { name } = router.query as { name?: string };

  const [firm, setFirm] = useState<FirmRow | null>(null);
  const [loadingFirm, setLoadingFirm] = useState(true);
  const [firmErr, setFirmErr] = useState<string | null>(null);

  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [options, setOptions] = useState<OptionsPayload | null>(null);
  const [loadingProps, setLoadingProps] = useState(false);
  const [propsErr, setPropsErr] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(initialForm);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') setShowFilters(window.innerWidth >= 768);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setForm(initialForm);
  };

  const findFirmAndId = useCallback(async () => {
    if (!name) return;
    setLoadingFirm(true);
    setFirmErr(null);
    try {
      const r = await fetch(`${API}/marketplace/firms`);
      if (!r.ok) throw new Error('Failed to load firms list.');
      const data = await r.json();
      const firms: FirmRow[] = data.firms || [];

      const numeric = /^\d+$/.test(name);
      let found: FirmRow | undefined;

      if (numeric) {
        const id = Number(name);
        found = firms.find(f => f.firm_id === id);
      } else {
        const slug = (name || '').toLowerCase();
        found =
          firms.find(f => slugify(f.firm_name) === slug) ||
          firms.find(f => f.firm_name.toLowerCase() === decodeURIComponent(slug));
      }

      if (!found) throw new Error('Firm not found.');
      setFirm(found);
    } catch (e: any) {
      setFirmErr(e.message || 'Error loading firm.');
    } finally {
      setLoadingFirm(false);
    }
  }, [name]);

  const fetchProperties = useCallback(
    async (firmId: number) => {
      setLoadingProps(true);
      setPropsErr(null);
      try {
        const qs = new URLSearchParams();
        ([
          'property_type',
          'status',
          'bedrooms',
          'bathrooms',
          'minPrice',
          'maxPrice',
          'area_name',
          'sort',
        ] as const).forEach(k => {
          const v = form[k];
          if (v !== undefined && v !== null && String(v).trim() !== '') qs.set(k, String(v).trim());
        });

        const r = await fetch(`${API}/marketplace/firms/${firmId}/properties?${qs.toString()}`);
        if (!r.ok) throw new Error('Failed to load properties.');
        const data: PropertiesPayload = await r.json();

        setProperties(data.properties || []);
        setOptions(data.options || { bedrooms: [], bathrooms: [], areas: [], types: [] });
      } catch (e: any) {
        setPropsErr(e.message || 'Error loading properties.');
      } finally {
        setLoadingProps(false);
      }
    },
    [form]
  );

  useEffect(() => {
    findFirmAndId();
  }, [findFirmAndId]);

  useEffect(() => {
    if (firm?.firm_id) fetchProperties(firm.firm_id);
  }, [firm?.firm_id, fetchProperties]);

  const total = properties.length;
  const firmTitle = firm?.firm_name ?? 'Firm';
  const firmLogo = firm?.logo_url || '';

  const propertyTypeOpts = useMemo(() => [''].concat(options?.types ?? []), [options]);
  const bedroomOpts = useMemo(() => [''].concat(options?.bedrooms ?? []), [options]);
  const bathroomOpts = useMemo(() => [''].concat(options?.bathrooms ?? []), [options]);
  const areaOpts = useMemo(() => [''].concat(options?.areas ?? []), [options]);

  const labelize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Any');

  const renderCard = (p: PropertyRow) => {
    const kind = (p.property_type || '').toLowerCase();

    if (kind.includes('land')) {
      const land: LandModel = {
        id: p.id,
        title: p.title ?? null,
        asking_price: p.asking_price ?? null,
        longitude: p.longitude ?? 0,
        latitude: p.latitude ?? 0,
        geojson: p.geojson ?? '',
        area_namee: p.area_name ?? '',
        nzp_code: p.nzp_code ?? '',
        shape_area: p.shape_area ?? 0,
        description: '',
        block_no: p.block_no ?? '',
        status: p.status ?? '',
        realtor_name: '',
        email: '',
        phone_number: null,
      };
      return <LandCard land={land} />;
    }

    if (kind.includes('apartment') || kind.includes('unit')) {
      const apt = {
        id: p.id,
        title: p.title ?? null,
        listing_type: (p.listing_type || 'rent') as 'sale' | 'rent',
        asking_price: p.asking_price ?? 0,
        rent_price: p.rent_price ?? 0,
        area_name: p.area_name ?? '',
        bedrooms: p.bedrooms ?? 0,
        bathrooms: p.bathrooms ?? 0,
        images: Array.isArray(p.images) ? p.images : [],
      } as any;
      return <AptCard apartment={apt} />;
    }

    const house = {
      id: p.id,
      title: p.title ?? null,
      listing_type: (p.listing_type || 'rent') as 'sale' | 'rent',
      asking_price: p.asking_price ?? 0,
      rent_price: p.rent_price ?? 0,
      area_name: p.area_name ?? '',
      bedrooms: p.bedrooms ?? 0,
      bathrooms: p.bathrooms ?? 0,
      images: Array.isArray(p.images) ? p.images : [],
    } as any;
    return <HouseCard house={house} />;
  };

  return (
    <>
      <Seo title={`${firmTitle} – Listings`} />
      <section
        style={{
          background:
            'linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.55)), url(https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80) center/cover',
          minHeight: '32vh',
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
        }}
      >
        <Container>
          {loadingFirm ? (
            <div className="d-flex justify-content-center py-5">
              <Image
                src="/assets/images/media/loader.svg"
                width={64}
                height={64}
                alt="Loading…"
                priority
                />
            </div>
          ) : firmErr ? (
            <div className="text-center py-5">
              <h2 className="mb-3">Couldn’t load firm</h2>
              <div className="text-white-50">{firmErr}</div>
            </div>
          ) : (
            <Row className="align-items-center gy-3">
              <Col xs="auto">
                <div
                  style={{
                    width: 72,
                    height: 72,
                    background: 'rgba(255,255,255,.9)',
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {firmLogo ? (
                    <img
                      src={firmLogo}
                      alt={`${firmTitle} logo`}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <span className="text-dark fw-semibold">Logo</span>
                  )}
                </div>
              </Col>
              <Col>
                <h1 className="fw-semibold mb-1">{firmTitle}</h1>
                <div className="text-white-50">{firm?.listings_count ?? 0} total listings</div>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      <Container className="py-4">
        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body>
            <div className="d-flex d-md-none justify-content-between align-items-center mb-2">
              <div className="fw-semibold">Filters</div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowFilters(v => !v)}
                aria-controls="filters-collapse"
                aria-expanded={showFilters}
              >
                {showFilters ? 'Hide' : 'Show'}
              </Button>
            </div>

            <Collapse in={showFilters}>
              <div id="filters-collapse">
                <Form
                  onSubmit={e => {
                    e.preventDefault();
                    if (firm?.firm_id) fetchProperties(firm.firm_id);
                  }}
                >
                  <Row className="g-3">
                    <Col xs={12} md={3}>
                      <Form.Label className="small text-muted mb-1">Property Type</Form.Label>
                      <Form.Select name="property_type" value={form.property_type} onChange={handleChange}>
                        {propertyTypeOpts.map(opt => (
                          <option key={opt} value={opt}>
                            {opt ? labelize(opt) : 'Any'}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>

                    <Col xs={6} md={2}>
                      <Form.Label className="small text-muted mb-1">Bedrooms</Form.Label>
                      <Form.Select name="bedrooms" value={form.bedrooms} onChange={handleChange}>
                        {bedroomOpts.map(opt => (
                          <option key={opt} value={opt}>
                            {opt || 'Any'}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>

                    <Col xs={6} md={2}>
                      <Form.Label className="small text-muted mb-1">Bathrooms</Form.Label>
                      <Form.Select name="bathrooms" value={form.bathrooms} onChange={handleChange}>
                        {bathroomOpts.map(opt => (
                          <option key={opt} value={opt}>
                            {opt || 'Any'}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>

                    <Col xs={12} md={3}>
                      <Form.Label className="small text-muted mb-1">Area</Form.Label>
                      <Form.Select name="area_name" value={form.area_name} onChange={handleChange}>
                        {areaOpts.map(opt => (
                          <option key={opt} value={opt}>
                            {opt || 'Any'}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>

                    <Col xs={6} md={2}>
                      <Form.Label className="small text-muted mb-1">Sort</Form.Label>
                      <Form.Select name="sort" value={form.sort} onChange={handleChange}>
                        <option value="">Latest</option>
                        <option value="asc">Price: Low → High</option>
                        <option value="desc">Price: High → Low</option>
                      </Form.Select>
                    </Col>

                    <Col xs={6} md={2}>
                      <Form.Label className="small text-muted mb-1">Min Price</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>BD</InputGroup.Text>
                        <Form.Control
                          name="minPrice"
                          type="number"
                          inputMode="numeric"
                          value={form.minPrice}
                          onChange={handleChange}
                          placeholder="0"
                        />
                      </InputGroup>
                    </Col>

                    <Col xs={6} md={2}>
                      <Form.Label className="small text-muted mb-1">Max Price</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>BD</InputGroup.Text>
                        <Form.Control
                          name="maxPrice"
                          type="number"
                          inputMode="numeric"
                          value={form.maxPrice}
                          onChange={handleChange}
                          placeholder="Any"
                        />
                      </InputGroup>
                    </Col>

                    <Col xs={12} className="d-flex justify-content-end gap-2">
                      <Button type="button" variant="outline-secondary" onClick={handleClear}>
                        Clear
                      </Button>
                      <Button
                        type="submit"
                        className="px-4"
                        style={{ backgroundColor: '#1B365D', borderColor: '#1B365D' }}
                      >
                        Apply Filters
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Collapse>
          </Card.Body>
        </Card>
      </Container>

      <Container className="pb-5">
        {loadingProps ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <Image
              src="/assets/images/media/loader.svg"
              width={64}
              height={64}
              alt="Loading…"
              priority
            />
          </div>
        ) : propsErr ? (
          <div className="text-center text-danger my-5">{propsErr}</div>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="text-muted">
                {total} result{total === 1 ? '' : 's'}
              </div>
            </div>

            {properties.length === 0 ? (
              <div className="text-center text-muted my-5">No properties found</div>
            ) : (
              <Row className="g-4">
                {properties.map(p => (
                  <Col key={p.id} xs={12} md={6} lg={4}>
                    {renderCard(p)}
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </Container>
    </>
  );
};

(FirmPage as any).layout = 'BlankLayout';
export default FirmPage;
