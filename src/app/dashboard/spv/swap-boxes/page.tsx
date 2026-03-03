"use client";

import { useEffect, useState } from "react";
import { Plus, Box, TrendingUp, DollarSign, Gauge } from "lucide-react";
import { Header } from "@/components/layout/header";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SpvBanner } from "@/components/dashboard/spv-banner";
import { SpvEmptyState } from "@/components/dashboard/spv-empty-state";
import { SpvAssetCard } from "@/components/dashboard/spv-asset-card";
import { SpvAddForm } from "@/components/dashboard/spv-add-form";
import { TimePeriodToggle } from "@/components/dashboard/time-period-toggle";
import { Button } from "@/components/ui/button";
import { loadSwapBoxes, addSwapBox, seedIfEmpty } from "@/lib/spv-storage";
import { formatUSD } from "@/lib/currency";
import type { SpvSwapBox, TimePeriod, SpvFormField, SpvCardItem } from "@/types/spv";

const FORM_FIELDS: SpvFormField[] = [
  { name: "name", label: "Station Name", type: "text", section: "technical", placeholder: "Westlands Hub", required: true },
  { name: "stationId", label: "Station ID", type: "text", section: "technical", placeholder: "SS-XXX" },
  { name: "totalSlots", label: "Total Slots", type: "number", section: "technical", placeholder: "12", required: true },
  { name: "solarCapacityW", label: "Solar Capacity (W)", type: "number", section: "technical", placeholder: "2000" },
  { name: "gridConnected", label: "Grid Connected", type: "select", section: "technical", options: [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ] },
  { name: "location", label: "Location", type: "text", section: "technical", placeholder: "Westlands, Nairobi" },
  { name: "latitude", label: "Latitude", type: "number", section: "technical", placeholder: "-1.2635" },
  { name: "longitude", label: "Longitude", type: "number", section: "technical", placeholder: "36.8029" },
  { name: "installCostUSD", label: "Install Cost ($)", type: "number", section: "financial", placeholder: "850000", required: true },
  { name: "monthlyOpexUSD", label: "Monthly OPEX ($)", type: "number", section: "financial", placeholder: "35000" },
  { name: "revenuePerSwapUSD", label: "Revenue per Swap ($)", type: "number", section: "financial", placeholder: "120", required: true },
];

function getSwapValue(box: SpvSwapBox, period: TimePeriod): number {
  switch (period) {
    case "daily": return box.swapsPerDay;
    case "weekly": return box.swapsPerWeek;
    case "monthly": return box.swapsPerMonth;
    case "yearly": return box.swapsPerMonth * 12;
    case "all": return box.swapsTotal;
  }
}

function buildCardData(box: SpvSwapBox, period: TimePeriod) {
  const revenuePerSlot = box.totalSlots > 0 ? Math.round(box.totalRevenueUSD / box.totalSlots) : 0;

  const technical: SpvCardItem[] = [
    { label: "Station", value: box.name },
    { label: "Station ID", value: box.stationId },
    { label: "Total Slots", value: box.totalSlots },
    { label: "Solar", value: `${box.solarCapacityW}W` },
    { label: "Grid Connected", value: box.gridConnected ? "Yes" : "No" },
    { label: "Location", value: box.location },
  ];

  const utilization: SpvCardItem[] = [
    { label: "Swaps", value: getSwapValue(box, period).toLocaleString() },
    { label: "Slot Utilization", value: `${box.avgSlotUtilization}%` },
    { label: "Operational Days", value: box.operationalDays.toLocaleString() },
  ];

  const financial: SpvCardItem[] = [
    { label: "Install Cost", value: formatUSD(box.installCostUSD) },
    { label: "Monthly OPEX", value: formatUSD(box.monthlyOpexUSD) },
    { label: "Revenue/Swap", value: formatUSD(box.revenuePerSwapUSD) },
    { label: "Total Revenue", value: formatUSD(box.totalRevenueUSD) },
    { label: "Revenue per Slot", value: formatUSD(revenuePerSlot), highlight: true },
    { label: "Payback Progress", value: `${box.paybackProgressPct}%`, highlight: true },
    {
      label: "Net P&L",
      value: formatUSD(box.totalRevenueUSD - box.totalCostUSD),
      highlight: true,
    },
  ];

  return { technical, utilization, financial };
}

export default function SpvSwapBoxesPage() {
  const [boxes, setBoxes] = useState<SpvSwapBox[]>([]);
  const [period, setPeriod] = useState<TimePeriod>("monthly");
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    seedIfEmpty();
    setBoxes(loadSwapBoxes());
  }, []);

  function handleAdd(data: Record<string, string | number>) {
    const id = `SPV-SB-${String(boxes.length + 1).padStart(3, "0")}`;
    const newBox: SpvSwapBox = {
      id,
      stationId: String(data.stationId || `SS-${String(boxes.length + 1).padStart(3, "0")}`),
      name: String(data.name || ""),
      status: "active",
      totalSlots: Number(data.totalSlots) || 12,
      solarCapacityW: Number(data.solarCapacityW) || 0,
      gridConnected: String(data.gridConnected) === "true",
      location: String(data.location || ""),
      latitude: Number(data.latitude) || -1.2833,
      longitude: Number(data.longitude) || 36.8172,
      swapsPerDay: 0,
      swapsPerWeek: 0,
      swapsPerMonth: 0,
      swapsTotal: 0,
      avgSlotUtilization: 0,
      operationalDays: 0,
      installCostUSD: Number(data.installCostUSD) || 0,
      monthlyOpexUSD: Number(data.monthlyOpexUSD) || 0,
      revenuePerSwapUSD: Number(data.revenuePerSwapUSD) || 120,
      totalRevenueUSD: 0,
      totalCostUSD: Number(data.installCostUSD) || 0,
      paybackProgressPct: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = addSwapBox(newBox);
    setBoxes(updated);
  }

  const totalAssets = boxes.length;
  const activeCount = boxes.filter((b) => b.status === "active").length;
  const totalRevenue = boxes.reduce((s, b) => s + b.totalRevenueUSD, 0);
  const avgUtilization =
    boxes.length > 0
      ? Math.round(boxes.reduce((s, b) => s + b.avgSlotUtilization, 0) / boxes.length)
      : 0;

  return (
    <>
      <Header title="SPV Swap Boxes" />
      <div className="flex flex-1 flex-col gap-6 p-4">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Swap Boxes"
            description="SPV-financed swap station infrastructure — per-swap revenue model."
          />
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Swap Box
          </Button>
        </div>

        <SpvBanner
          accentColor="orange"
          title="Three-Asset SPV — Swap Boxes"
          description="Swap box infrastructure earns revenue per battery swap. Track payback progress, revenue per slot, slot utilization, and operational performance."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Swap Boxes"
            value={totalAssets}
            description={`${activeCount} active`}
            icon={Box}
          />
          <KpiCard
            title="Total Revenue"
            value={formatUSD(totalRevenue)}
            description="From swap fees"
            icon={DollarSign}
          />
          <KpiCard
            title="Avg Utilization"
            value={`${avgUtilization}%`}
            description="Slot utilization"
            icon={Gauge}
          />
          <KpiCard
            title="Total Swaps"
            value={boxes.reduce((s, b) => s + b.swapsTotal, 0).toLocaleString()}
            description="All-time swaps"
            icon={TrendingUp}
          />
        </div>

        <TimePeriodToggle value={period} onChange={setPeriod} />

        {boxes.length === 0 ? (
          <SpvEmptyState assetLabel="Swap Box" onAdd={() => setFormOpen(true)} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {boxes.map((box) => {
              const { technical, utilization, financial } = buildCardData(box, period);
              return (
                <SpvAssetCard
                  key={box.id}
                  id={box.id}
                  title={box.name}
                  subtitle={box.stationId}
                  status={box.status}
                  accentColor="orange"
                  technical={technical}
                  utilization={utilization}
                  financial={financial}
                />
              );
            })}
          </div>
        )}

        <SpvAddForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title="Add Swap Box"
          fields={FORM_FIELDS}
          onSubmit={handleAdd}
        />
      </div>
    </>
  );
}
