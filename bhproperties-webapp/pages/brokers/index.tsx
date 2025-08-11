'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Container } from 'react-bootstrap';

import Seo from '@/shared/layouts-components/seo/seo';
import Hero from '@/components/firms/Hero';
import FirmsGrid from '@/components/firms/FirmGrid';
import { Firm } from '@/components/firms/FirmCard';

const API = process.env.NEXT_PUBLIC_API_URL!;

const BrokersPage = () => {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/marketplace/firms`);
        if (!r.ok) throw new Error('Unable to fetch brokers.');
        const { firms } = await r.json();
        setFirms(firms);
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  const filteredFirms = useMemo(
    () => firms.filter((f) => f.firm_name.toLowerCase().includes(query.toLowerCase())),
    [firms, query]
  );

  useEffect(() => {
    if (!query || !gridRef.current) return;
    gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      window.scrollBy({ top: -72, left: 0, behavior: 'smooth' });
    }, 250);
  }, [query]);

  if (busy)
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
          <Image
            src="/assets/images/media/loader.svg"
            width={64}
            height={64}
            alt="Loading…"
            priority
          />
      </div>
    );

  if (err) return <p className="text-danger text-center my-5">{err}</p>;

  return (
    <>
      <Seo title="Brokers" />
      <Hero query={query} setQuery={setQuery} />
      <Container className="py-5" ref={gridRef}>
        <FirmsGrid firms={filteredFirms} />
      </Container>
    </>
  );
};

(BrokersPage as any).layout = 'BlankLayout';
export default BrokersPage;
