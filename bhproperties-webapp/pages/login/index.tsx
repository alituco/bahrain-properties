"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Col } from "react-bootstrap";
import Seo from "@/shared/layouts-components/seo/seo";
import AuthWidget from "@/components/auth/AuthWidget";

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const d = await r.json();
        if (d.success) router.push("/dashboard");
        else setChecking(false);
      } catch (err) {
        console.error(err);
        setChecking(false);
      }
    })();
  }, [router]);

  if (checking) return null;

  return (
    <>
      <Seo title="Authentication" />
      <div className="container">
        <div className="row justify-content-center align-items-center authentication authentication-basic h-100 pt-3">
          <Col xxl={4} xl={5} lg={5} md={6} sm={8} className="col-12">
            <AuthWidget />
          </Col>
        </div>
      </div>  
    </>
  );
}
