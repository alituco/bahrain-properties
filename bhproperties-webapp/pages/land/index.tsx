'use client';

import { Fragment, useState } from 'react';
import Seo from '@/shared/layouts-components/seo/seo';
import Hero       from '@/components/marketplace/land/Hero';
import FilterBar  from '@/components/marketplace/land/FilterBar';
import { PageWithLayout } from '@/types/PageWithLayout';

const LandPage: PageWithLayout = () => {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleApply = (f: Record<string, string>) => {
    setFilters(f);
    // later: trigger fetch for grid of land listings
  };

  return (
    <Fragment>
      <Seo title="Land for Sale in Bahrain" />

      {/* hero banner */}
      <Hero onFilterClick={() => {
        // scroll to FilterBar when button pressed
        document.getElementById('land-filters')?.scrollIntoView({ behavior:'smooth' });
      }} />

      {/* filter bar (grid & sidebar will follow) */}
      <div id="land-filters">
        <FilterBar onApply={handleApply} />
      </div>
    </Fragment>
  );
};

LandPage.layout = 'BlankLayout';
export default LandPage;
