"use client";

import React, { useEffect, useState } from "react";
import { Row, Col, Spinner, Card } from "react-bootstrap";
import Spkcardscomponent from "@/shared/@spk-reusable-components/reusable-dashboards/spk-cards";
import Link from "next/link";

/* ---------- response shapes ---------- */
export type VolumePoint = { period_start: string; volume_bhd: string };
export type VolumeResp  = { periodDays: number; series: VolumePoint[] };
export type SummaryResp = {
  current: number | null;
  previous: number | null;
  percentChange: number | null;
  periodDays: number;
};
type PipelineResp = {
  periodDays: number;
  [status: string]:
    | { current: number; previous: number; percentChange: number | null }
    | number;
};

interface Props { firmId: number }

/* ---------- helpers ---------- */
const fmtMoney = new Intl.NumberFormat("en-US", {
  style: "currency", currency: "BHD", minimumFractionDigits: 0,
});

const pctChange = (curr: number | null, prev: number | null): number | null =>
  prev == null ? null : prev === 0 ? (curr ? 100 : 0) : ((curr! - prev) / prev) * 100;

const trendMeta = (pct: number | null) => {
  if (pct == null)  return { pctStr: "—", color: "muted",  icon: "ti ti-minus" };
  if (pct > 0)      return { pctStr: `+${pct.toFixed(1)}%`, color: "success", icon: "ti ti-arrow-narrow-up" };
  if (pct < 0)      return { pctStr:  `${pct.toFixed(1)}%`, color: "danger",  icon: "ti ti-arrow-narrow-down" };
  return { pctStr: "0.0%", color: "muted", icon: "ti ti-minus" };
};

const safeJson = async <T,>(r: Response): Promise<T | null> => (r.ok ? r.json() : null);

/* =================================================================== */
const FirmStatsCards: React.FC<Props> = ({ firmId }) => {
  const [loading, setLoading] = useState(true);
  const [cards,   setCards]   = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL;

        const [volume, soldMedian, pipeline] = await Promise.all([
          fetch(`${base}/firmSpecificData/firm/${firmId}/volume-sold`,        { credentials: "include" }).then<VolumeResp  | null>(safeJson),
          fetch(`${base}/firmSpecificData/firm/${firmId}/median-sold-psqft`,  { credentials: "include" }).then<SummaryResp | null>(safeJson),
          fetch(`${base}/firmSpecificData/firm/${firmId}/pipeline-counts`,    { credentials: "include" }).then<PipelineResp | null>(safeJson),
        ]);
        if (cancelled) return;

        /* ---- derive volume summary from series ---- */
        const series = volume?.series ?? [];
        const L      = series.length;
        const vSum: SummaryResp = L
          ? {
              periodDays: 90,
              current:       Number(series[L-1].volume_bhd),
              previous:      L >= 2 ? Number(series[L-2].volume_bhd) : null,
              percentChange: pctChange(Number(series[L-1].volume_bhd), L >= 2 ? Number(series[L-2].volume_bhd) : null),
            }
          : { periodDays: 90, current: null, previous: null, percentChange: null };

        const s = soldMedian ?? { current: null, previous: null, percentChange: null, periodDays: 90 };
        const p = pipeline   ?? { periodDays: 30 };

        const listed  = p["listed"] as { current: number; percentChange: number | null } | undefined;
        const soldCnt = p["sold"]   as { current: number; percentChange: number | null } | undefined;

        /* ---------- build dashboard cards ---------- */
        const cardsArr = [
          // total volume
          (() => {
            const { pctStr, color, icon } = trendMeta(vSum.percentChange);
            return {
              title: "Total Volume Sold",
              count: vSum.current ? fmtMoney.format(vSum.current) : "—",
              inc:   `Last ${vSum.periodDays} days`,
              percentageChange: pctStr, color, icon,
              backgroundColor: "primary", iconClass: "ti ti-cash",
            };
          })(),
          // median sold / ft²
          (() => {
            const { pctStr, color, icon } = trendMeta(s.percentChange);
            return {
              title: "Firm Median Sold / ft²",
              count: s.current ? fmtMoney.format(s.current) : "—",
              inc:   `Last ${s.periodDays} days`,
              percentageChange: pctStr, color, icon,
              backgroundColor: "info", iconClass: "ti ti-home-dollar",
            };
          })(),
          // listed count
          (() => {
            const { pctStr, color, icon } = trendMeta(listed?.percentChange ?? null);
            return {
              title: "Properties Listed",
              count: listed?.current ?? 0,
              inc:   `Updated ${p.periodDays} days`,
              percentageChange: pctStr, color, icon,
              backgroundColor: "warning", iconClass: "ti ti-map-pin",
            };
          })(),
          // sold count
          (() => {
            const { pctStr, color, icon } = trendMeta(soldCnt?.percentChange ?? null);
            return {
              title: "Properties Sold",
              count: soldCnt?.current ?? 0,
              inc:   `Updated ${p.periodDays} days`,
              percentageChange: pctStr, color, icon,
              backgroundColor: "success", iconClass: "ti ti-check",
            };
          })(),
        ];

        setCards(cardsArr);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, [firmId]);

  /* ---------- loader ---------- */
  if (loading) return (
    <Row className="mb-3"><Col className="text-center"><Spinner animation="border" /></Col></Row>
  );

  /* ---------- render ---------- */
  return (
    <Col className="border border-1 border-body-tertiary rounded px-3 mb-3">
      {/* header */}
      <Row className="d-flex align-items-center pt-3 px-2">
        <Card.Header className="p-0 border-0 bg-transparent">
          <Card.Title className="">Monthly Insights</Card.Title>
        </Card.Header>

        <Col xs="auto" className="ms-auto mb-2">
          <Link
            href="/advanced"
            className="small fst-italic fw-semibold text-primary link-underline-opacity-0 link-underline-opacity-75-hover"
            style={{ letterSpacing: ".2px" }}
          >
            Advanced&nbsp;Insights
          </Link>
        </Col>
      </Row>

      {/* metric tiles */}
      <Row className="">
        {cards.map((card, idx) => (
          <Col xxl={3} xl={6} key={idx}>
            <Spkcardscomponent
              cardClass="overflow-hidden main-content-card"
              headingClass="d-block mb-1"
              mainClass="d-flex align-items-start justify-content-between mb-2"
              Icon
              iconClass={card.iconClass}
              card={card}
              badgeClass="md rounded-pill"
              dataClass="mb-0"
            />
          </Col>
        ))}
      </Row>
    </Col>
  );
};

export default FirmStatsCards;
