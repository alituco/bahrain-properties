"use client";

import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Row, Col, Spinner } from "react-bootstrap";
import Seo        from "@/shared/layouts-components/seo/seo";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import SpkAlert   from "@/shared/@spk-reusable-components/reusable-uielements/spk-alert";

import PropertyInfoCard  from "@/components/property/PropertyInfoCard";
import FirmPropertyCard  from "@/components/property/FirmPropertyCard";
import PropertyNotesCard from "@/components/property/PropertyNotesCard";
import PropertyMap       from "@/components/property/PropertyMap";

const API = process.env.NEXT_PUBLIC_API_URL!;

interface User {
  user_id: number;
  role:     string;
  first_name?: string;
  last_name?:  string;
}

export default function PropertyOverviewPage() {
  const router = useRouter();
  const [me,   setMe]  = useState<User | null>(null);
  const [err,  setErr] = useState<string | null>(null);

  const parcelNo = router.isReady ? (router.query.id as string) : undefined;

  useEffect(() => {
    if (!router.isReady) return;

    (async () => {
      try {
        const r = await fetch(`${API}/user/me`, { credentials: "include" });
        if (!r.ok) { router.replace("/"); return; }
        const { user } = await r.json();
        setMe(user);
      } catch (e: any) {
        setErr(e.message);
      }
    })();
  }, [router.isReady, router]);

  if (!router.isReady || !parcelNo || !me)
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </div>
    );

  if (err)
    return (
      <SpkAlert variant="danger" CustomClass="m-4" show>
        {err}
      </SpkAlert>
    );

  const isAdmin = me.role.toLowerCase() === "admin";

  return (
    <Fragment>
      <Seo title={`Parcel ${parcelNo}`} />

      <Pageheader
        title="Property"
        currentpage={`Parcel ${parcelNo}`}
        activepage="Overview"
        filter={false}
        share={true}

      />

      <Row>
        <Col xxl={8}>
          <PropertyInfoCard parcelNo={parcelNo} />
          <FirmPropertyCard parcelNo={parcelNo} />
        </Col>

        <Col xxl={4}>
          <PropertyNotesCard
            parcelNo={parcelNo}
            isAdmin={isAdmin}
            userFirstName={me.first_name ?? ""}
            userLastName={me.last_name ?? ""}
          />
          <PropertyMap parcelNo={parcelNo} />
        </Col>
      </Row>
    </Fragment>
  );
}

PropertyOverviewPage.layout = "ContentLayout";
