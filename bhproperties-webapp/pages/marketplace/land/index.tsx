'use client';

import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import Seo          from '@/shared/layouts-components/seo/seo';
import Hero         from '@/components/marketplace/land/Hero';
import FilterBar    from '@/components/marketplace/land/FilterBar';
import Grid         from '@/components/marketplace/land/Grid';
import { PageWithLayout } from '@/types/PageWithLayout';
import { Land }     from '@/components/marketplace/land/LandCard';
import type { LandOptions } from '@/components/marketplace/land/FilterBar';

const API = process.env.NEXT_PUBLIC_API_URL!;

const LandPage: PageWithLayout = () => {
  const [filters, setFilters] = useState<Record<string, string>>({ status:'listed' });
  const [land,       setLand] = useState<Land[]>([]);
  const [options, setOptions] = useState<LandOptions>({
    classifications:[], governorates:[], locations:[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const qs = new URLSearchParams(filters).toString();
      const res = await fetch(`${API}/land?${qs}`, { credentials:'include' });
      const data = await res.json();
      setLand(data.land);
      setOptions(data.options as LandOptions);
      setLoading(false);
    })();
  }, [filters]);

  return (
    <Fragment>
      <Seo title="Land for Sale in Bahrain" />

      <Hero onFilterClick={() =>
        document.getElementById('land-filters')?.scrollIntoView({ behavior:'smooth' })
      } />

      <div id="land-filters">
        <FilterBar options={options} onApply={setFilters}/>
      </div>

      <div className="container my-4">
        {loading
          ? 
          <div className='d-flex justify-content-center align-items-center' style={{ minHeight: "300px" }}>
            <Image
                src="/assets/images/media/loader.svg"
                width={64}
                height={64}
                alt="Loading…"
                priority
                
              />
            </div>
          : <Grid land={land}/>
        }
      </div>
    </Fragment>
  );
};

LandPage.layout = 'BlankLayout';
export default LandPage;
