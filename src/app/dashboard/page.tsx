"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Zap, DollarSign } from "lucide-react";
import type { TimePeriod, DashboardMetrics } from "@/types/spv";
import { computeDashboardMetrics } from "@/lib/dashboard-analytics";
import { formatUSD } from "@/lib/currency";

import { Header } from "@/components/layout/header";
import { PageHeader } from "@/components/dashboard/page-header";
import { TimePeriodToggle } from "@/components/dashboard/time-period-toggle";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SpvRepaymentDonut } from "@/components/dashboard/spv-repayment-donut";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { MapWrapper } from "@/components/dashboard/map-wrapper";
import { LiveSwapFeed } from "@/components/dashboard/live-swap-feed";
import { SwapStatsTable } from "@/components/dashboard/swap-stats-table";
import {
  SWAP_STATIONS,
  RECENT_SWAP_EVENTS,
} from "@/lib/mock-data";

const PERIOD_LABELS: Record<TimePeriod, string> = {
  daily: "Today",
  weekly: "This week",
  monthly: "This month",
  yearly: "This year",
  all: "All time",
};

function fmtValue(val: number | undefined): string {
  if (val === undefined || val === 0) return "---";
  return val.toLocaleString();
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<TimePeriod>("monthly");
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  const refresh = useCallback(() => {
    const data = computeDashboardMetrics(period);
    setMetrics(data);
  }, [period]);

  // Load on mount + when period changes
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const isEmpty =
    !metrics ||
    (metrics.activeRiders === 0 &&
      metrics.totalSwaps === 0 &&
      metrics.totalRevenue === 0);

  const stationNames = SWAP_STATIONS.filter((s) => s.status === "online").map(
    (s) => s.name
  );

  const emptyRepayment = {
    items: [],
    totalExpected: 0,
    totalActual: 0,
    overallRatio: 0,
    overallColor: "#ef4444",
  };

  return (
    <>
      <Header title="Overview" />
      <div className="flex flex-1 flex-col gap-6 p-4">
        {/* ── Header + Time Toggle ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            title="Dashboard"
            description="Investor overview of e-mobility operations across Nairobi."
          />
          <div className="flex flex-col items-end gap-1.5">
            <TimePeriodToggle value={period} onChange={setPeriod} />
            {metrics?.lastUpdated && (
              <span className="text-[10px] text-muted-foreground">
                Updated {metrics.lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* ── SPV Repayment Hero Card (full width) ── */}
        <SpvRepaymentDonut
          repayment={metrics?.repayment ?? emptyRepayment}
          isEmpty={isEmpty}
        />

        {/* ── Three KPI Cards ── */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <KpiCard
            title="Revenue"
            value={metrics?.totalRevenue ? formatUSD(metrics.totalRevenue) : "---"}
            description={PERIOD_LABELS[period]}
            icon={DollarSign}
          />
          <KpiCard
            title="Number of Swaps"
            value={fmtValue(metrics?.totalSwaps)}
            description={`${PERIOD_LABELS[period]} — batteries + stations`}
            icon={Zap}
          />
          <KpiCard
            title="Active Riders"
            value={fmtValue(metrics?.activeRiders)}
            description="Assigned riders on active bikes"
            icon={Users}
          />
        </div>

        {/* ── Revenue Growth vs Asset Deployment Chart ── */}
        <RevenueChart
          data={metrics?.timeSeries ?? []}
          isEmpty={isEmpty}
        />

        {/* ── Map + Live Feed (preserved) ── */}
        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <MapWrapper stations={SWAP_STATIONS} />
          <LiveSwapFeed
            initialEvents={RECENT_SWAP_EVENTS}
            stationNames={stationNames}
          />
        </div>

        {/* ── Station Stats Table (preserved) ── */}
        <SwapStatsTable stations={SWAP_STATIONS} />
      </div>
    </>
  );
}
