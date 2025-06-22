/* ------------------------------------------------------------------
   Marketplace ▸ Residential  (apartments + houses)
-------------------------------------------------------------------*/
'use client';

import React, { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';

import Seo        from '@/shared/layouts-components/seo/seo';
import Hero       from '@/components/marketplace/residential/Hero';
import FilterBar  from '@/components/marketplace/residential/FilterBar';
import Grid       from '@/components/marketplace/residential/Grid';

import type {
  Listing,           // union of Apartment & House plus property_type tag
  ResidentialOptions // { bedrooms:string[]; bathrooms:string[]; areas:string[]; types:string[] }
} from '@/components/marketplace/residential/types';

import type { PageWithLayout } from '@/types/PageWithLayout';

const API = process.env.NEXT_PUBLIC_API_URL!;

/* --- querystring shape we forward to the backend ---------------- */
type Filters = {
  status     : 'available' | 'listed' | 'draft';
  type?      : 'apartment' | 'house';
  bedrooms?  : string;
  bathrooms? : string;
  area_name? : string;
  sort?      : 'asc' | 'desc';
  minPrice?  : string;
  maxPrice?  : string;
};

const ResidentialPage: PageWithLayout = () => {
  /* ------------ state ------------------------------------------ */
  const [filters , setFilters ] = useState<Filters>({ status: 'available' });
  const [listings, setListings] = useState<Listing[]>([]);
  const [options , setOptions ] = useState<ResidentialOptions>({
    bedrooms: [], bathrooms: [], areas: [], types: ['apartment', 'house'],
  });
  const [loading , setLoading ] = useState(true);
  const [error   , setError   ] = useState<string | null>(null);

  /* ------------ fetch on filter change ------------------------- */
  useEffect(() => {
    (async () => {
      setLoading(true); setError(null);

      /* only defined entries → query string */
      const qs = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined)
        ) as Record<string, string>
      ).toString();

      try {
        const r = await fetch(`${API}/marketplace/residential?${qs}`, {
          credentials: 'include',
        });
        if (!r.ok) throw new Error(await r.text());

        const { listings, options } = await r.json();
        setListings(listings as Listing[]);
        setOptions(options as ResidentialOptions);
      } catch (e: any) {
        setError(e.message ?? 'Failed to load listings');
      } finally {
        setLoading(false);
      }
    })();
  }, [filters]);

  /* ------------ UI --------------------------------------------- */
  return (
    <Fragment>
      <Seo title="Properties for Sale & Rent in Bahrain" />

      {/* Hero with scroll-to-filter shortcut */}
      <Hero
        onFilterClick={() =>
          document
            .getElementById('apt-filters')
            ?.scrollIntoView({ behavior: 'smooth' })
        }
      />

      {/* filter bar */}
      <div id="apt-filters">
        <FilterBar
          options={options}
          onApply={(patch) => setFilters({ ...filters, ...patch })}
        />
      </div>

      {/* listings grid */}
      <div className="container my-4">
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: 300 }}
          >
            <Image
              src="/assets/images/media/loader.svg"
              width={64}
              height={64}
              alt="Loading…"
              priority
            />
          </div>
        ) : error ? (
          <p className="text-danger text-center my-5">{error}</p>
        ) : (
          <Grid listings={listings} />
        )}
      </div>
    </Fragment>
  );
};

/* BlankLayout is registered in your layout registry */
ResidentialPage.layout = 'BlankLayout';
export default ResidentialPage;
