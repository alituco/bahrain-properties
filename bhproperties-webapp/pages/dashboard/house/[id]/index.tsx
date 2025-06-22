/* ------------------------------------------------------------------
   House detail / management – firm internal
-------------------------------------------------------------------*/
'use client';

import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Spinner } from 'react-bootstrap';
import Seo        from '@/shared/layouts-components/seo/seo';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import SpkAlert   from '@/shared/@spk-reusable-components/reusable-uielements/spk-alert';

import HouseInfoCard     from '@/components/house/HouseInfoCard';
import FirmHouseCard     from '@/components/house/FirmHouseCard';
import HouseNotesCard    from '@/components/house/HouseNotesCard';
import HouseMap          from '@/components/house/HouseMap';

const API = process.env.NEXT_PUBLIC_API_URL!;

interface User {
  user_id: number;
  role   : string;
  first_name?: string;
  last_name? : string;
}

export default function HouseOverviewPage() {
  const router = useRouter();
  const propId = router.isReady ? Number(router.query.id) : undefined;

  const [me,  setMe ] = useState<User | null>(null);
  const [err, setErr] = useState<string | null>(null);

  /* -------- auth guard -------- */
  useEffect(() => { if (!router.isReady) return;
    (async () => {
      try {
        const r = await fetch(`${API}/user/me`, { credentials: 'include' });
        if (!r.ok) { router.replace('/'); return; }
        const { user } = await r.json();
        setMe(user);
      } catch (e: any) { setErr(e.message); }
    })();
  }, [router.isReady, router]);

  if (!router.isReady || propId == null || !me)
    return <div className="d-flex justify-content-center py-5"><Spinner animation="border" /></div>;

  if (err)
    return <SpkAlert variant="danger" CustomClass="m-4" show>{err}</SpkAlert>;

  const isAdmin = me.role.toLowerCase() === 'admin';

  return (
    <Fragment>
      <Seo title={`House #${propId}`} />
      <Pageheader
        title="House"
        currentpage={`ID ${propId}`}
        activepage="Overview"
        filter={false}
        share={true}
      />

      <Row>
        <Col xxl={8}>
          <HouseInfoCard   propertyId={propId} />
          <FirmHouseCard   propertyId={propId} />
        </Col>

        <Col xxl={4}>
          <HouseNotesCard
            propertyId={propId.toString()}
            isAdmin={isAdmin}
            userFirstName={me.first_name ?? ''}
            userLastName={me.last_name ?? ''}
          />
          <HouseMap propertyId={propId} />
        </Col>
      </Row>
    </Fragment>
  );
}

HouseOverviewPage.layout = 'ContentLayout';
