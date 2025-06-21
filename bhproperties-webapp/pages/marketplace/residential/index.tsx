'use client';

import { Fragment, useEffect, useState } from 'react';
import Seo        from '@/shared/layouts-components/seo/seo';
import Hero       from '@/components/marketplace/residential/Hero';
import FilterBar  from '@/components/marketplace/residential/FilterBar';
import Grid       from '@/components/marketplace/residential/Grid';
import { PageWithLayout } from '@/types/PageWithLayout';
import type { AptOptions, Apartment } from '@/components/marketplace/residential/AptCard';

const API = process.env.NEXT_PUBLIC_API_URL!;

const ResidentialPage: PageWithLayout = () => {
  const [filters, setFilters] = useState<Record<string, string>>({ status: 'available' });
  const [apts, setApts]       = useState<Apartment[]>([]);
  const [options, setOptions] = useState<AptOptions>({
    bedrooms: [], bathrooms: [], areas: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    setLoading(true);
    const qs  = new URLSearchParams(filters).toString();
    const res = await fetch(`${API}/marketplace/apartments?${qs}`, { credentials: 'include' });
    const { apartments, options } = await res.json();
    setApts(apartments);
    setOptions(options);
    setLoading(false);
  })(); }, [filters]);

  return (
    <Fragment>
      <Seo title="Apartments for Sale & Rent in Bahrain" />

      <Hero onFilterClick={() =>
        document.getElementById('apt-filters')?.scrollIntoView({ behavior: 'smooth' })
      } />

      <div id="apt-filters">
        <FilterBar options={options} onApply={setFilters} />
      </div>

      <div className="container my-4">
        {loading
          ? <p className="text-center">Loading apartments…</p>
          : <Grid apartments={apts} />}
      </div>
    </Fragment>
  );
};

ResidentialPage.layout = 'BlankLayout';
export default ResidentialPage;
