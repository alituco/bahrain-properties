"use client";

import React, { useEffect, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import Spkcardscomponent from "@/shared/@spk-reusable-components/reusable-dashboards/spk-cards";

type MedianResp = {
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

interface Props {
  firmId: number;
}

const numberFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "BHD",
  minimumFractionDigits: 2,
});

/** convert pct → label + color + arrow icon */
const trendMeta = (pct: number | null) => {
  if (pct == null)
    return { pctStr: "—", color: "muted", icon: "ti ti-minus" };
  if (pct > 0)
    return {
      pctStr: `+${pct.toFixed(1)}%`,
      color: "success",
      icon: "ti ti-arrow-narrow-up",
    };
  if (pct < 0)
    return {
      pctStr: `${pct.toFixed(1)}%`,
      color: "danger",
      icon: "ti ti-arrow-narrow-down",
    };
  return { pctStr: "0.0%", color: "muted", icon: "ti ti-minus" };
};

/** helper that never throws on non-200 */
const safeJson = async <T,>(r: Response): Promise<T | null> =>
  r.ok ? r.json() : null;

const FirmStatsCards: React.FC<Props> = ({ firmId }) => {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL;

        const [asking, sold, pipeline] = await Promise.all([
          fetch(
            `${base}/firmSpecificData/firm/${firmId}/median-asking-psqft`,
            { credentials: "include" }
          ).then<MedianResp | null>(safeJson),
          fetch(
            `${base}/firmSpecificData/firm/${firmId}/median-sold-psqft`,
            { credentials: "include" }
          ).then<MedianResp | null>(safeJson),
          fetch(
            `${base}/firmSpecificData/firm/${firmId}/pipeline-counts`,
            { credentials: "include" }
          ).then<PipelineResp | null>(safeJson),
        ]);

        if (cancelled) return;

        // fallbacks so we never hit undefined
        const a = asking ?? {
          current: null,
          previous: null,
          percentChange: null,
          periodDays: 90,
        };
        const s = sold ?? {
          current: null,
          previous: null,
          percentChange: null,
          periodDays: 90,
        };
        const p = pipeline ?? { periodDays: 30 };

        const listed = p["listed"] as
          | { current: number; percentChange: number | null }
          | undefined;
        const soldCnt = p["sold"] as
          | { current: number; percentChange: number | null }
          | undefined;

        const assembled = [
          // Median asking
          (() => {
            const { pctStr, color, icon } = trendMeta(a.percentChange);
            return {
              title: "Firm Median Asking / ft²",
              count: a.current ? numberFmt.format(a.current) : "—",
              inc: `Last ${a.periodDays} days`,
              percentageChange: pctStr,
              color,
              icon,
              backgroundColor: "primary",
              iconClass: "ti ti-currency-dollar",
            };
          })(),
          // Median sold
          (() => {
            const { pctStr, color, icon } = trendMeta(s.percentChange);
            return {
              title: "Firm Median Sold / ft²",
              count: s.current ? numberFmt.format(s.current) : "—",
              inc: `Last ${s.periodDays} days`,
              percentageChange: pctStr,
              color,
              icon,
              backgroundColor: "info",
              iconClass: "ti ti-home-dollar",
            };
          })(),
          // Listed
          (() => {
            const pct = listed?.percentChange ?? null;
            const { pctStr, color, icon } = trendMeta(pct);
            return {
              title: "Properties Listed",
              count: listed?.current ?? 0,
              inc: `Updated ${p.periodDays} days`,
              percentageChange: pctStr,
              color,
              icon,
              backgroundColor: "warning",
              iconClass: "ti ti-map-pin",
            };
          })(),
          // Sold count
          (() => {
            const pct = soldCnt?.percentChange ?? null;
            const { pctStr, color, icon } = trendMeta(pct);
            return {
              title: "Properties Sold",
              count: soldCnt?.current ?? 0,
              inc: `Updated ${p.periodDays} days`,
              percentageChange: pctStr,
              color,
              icon,
              backgroundColor: "success",
              iconClass: "ti ti-check",
            };
          })(),
        ];

        setCards(assembled);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [firmId]);

  if (loading)
    return (
      <Row className="mb-3">
        <Col className="text-center">
          <Spinner animation="border" />
        </Col>
      </Row>
    );

  return (
    <Row className="mb-3">
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
  );
};

export default FirmStatsCards;
