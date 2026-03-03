"use client";

import { useEffect, useState } from "react";
import { Plus, Battery, TrendingUp, DollarSign, RefreshCw } from "lucide-react";
import { Header } from "@/components/layout/header";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SpvBanner } from "@/components/dashboard/spv-banner";
import { SpvEmptyState } from "@/components/dashboard/spv-empty-state";
import { SpvAssetCard } from "@/components/dashboard/spv-asset-card";
import { SpvAddForm } from "@/components/dashboard/spv-add-form";
import { TimePeriodToggle } from "@/components/dashboard/time-period-toggle";
import { Button } from "@/components/ui/button";
import { loadBatteries, addBattery, seedIfEmpty } from "@/lib/spv-storage";
import { formatUSD } from "@/lib/currency";
import type { SpvBattery, TimePeriod, SpvFormField, SpvCardItem } from "@/types/spv";

const FORM_FIELDS: SpvFormField[] = [
  { name: "serialNumber", label: "Serial Number", type: "text", section: "technical", placeholder: "KSC-BAT-2024-XXXX", required: true },
  { name: "model", label: "Model", type: "text", section: "technical", placeholder: "LFP-60Ah-48V", required: true },
  { name: "capacityKwh", label: "Capacity (kWh)", type: "number", section: "technical", placeholder: "2.88" },
  { name: "nominalVoltage", label: "Nominal Voltage (V)", type: "number", section: "technical", placeholder: "48" },
  { name: "chemistry", label: "Chemistry", type: "select", section: "technical", options: [
    { label: "LiFePO4", value: "LiFePO4" },
    { label: "NMC", value: "NMC" },
    { label: "LTO", value: "LTO" },
  ] },
  { name: "maxCycles", label: "Max Cycles", type: "number", section: "technical", placeholder: "2000" },
  { name: "currentLocation", label: "Current Location", type: "text", section: "utilization", placeholder: "Station name" },
  { name: "purchaseCostUSD", label: "Purchase Cost ($)", type: "number", section: "financial", placeholder: "42000", required: true },
  { name: "revenuePerSwapUSD", label: "Revenue per Swap ($)", type: "number", section: "financial", placeholder: "120", required: true },
];

function getSwapValue(bat: SpvBattery, period: TimePeriod): number {
  switch (period) {
    case "daily": return bat.swapsPerDay;
    case "weekly": return bat.swapsPerWeek;
    case "monthly": return bat.swapsPerMonth;
    case "yearly": return bat.swapsPerMonth * 12;
    case "all": return bat.swapsTotal;
  }
}

function buildCardData(bat: SpvBattery, period: TimePeriod) {
  const remainingCycles = Math.max(0, bat.maxCycles - bat.cyclesUsed);
  const remainingSwaps = Math.max(0, bat.breakEvenSwaps - bat.swapsTotal);
  const pastBreakEven = bat.swapsTotal >= bat.breakEvenSwaps;
  const estActiveDays = bat.swapsPerDay > 0 ? Math.round(remainingCycles / bat.swapsPerDay) : 0;

  const technical: SpvCardItem[] = [
    { label: "Model", value: bat.model },
    { label: "Serial #", value: bat.serialNumber },
    { label: "Capacity", value: `${bat.capacityKwh} kWh` },
    { label: "Voltage", value: `${bat.nominalVoltage}V` },
    { label: "Chemistry", value: bat.chemistry },
    { label: "State of Health", value: `${bat.currentSoH}%` },
  ];

  const utilization: SpvCardItem[] = [
    { label: "Location", value: bat.currentLocation },
    { label: "Swaps", value: getSwapValue(bat, period).toLocaleString() },
    { label: "Cycles Used", value: `${bat.cyclesUsed} / ${bat.maxCycles}` },
    { label: "Remaining Cycles", value: remainingCycles.toLocaleString() },
    { label: "Est. Active Days Left", value: estActiveDays > 0 ? estActiveDays.toLocaleString() : "—" },
  ];

  const financial: SpvCardItem[] = [
    { label: "Purchase Cost", value: formatUSD(bat.purchaseCostUSD) },
    { label: "Revenue/Swap", value: formatUSD(bat.revenuePerSwapUSD) },
    { label: "Total Revenue", value: formatUSD(bat.totalRevenueUSD) },
    { label: "Maintenance Cost", value: formatUSD(bat.maintenanceCostUSD) },
    {
      label: "Break-Even",
      value: pastBreakEven ? "Reached" : `${remainingSwaps} swaps to go`,
      highlight: true,
    },
    {
      label: "Net Profit",
      value: formatUSD(bat.totalRevenueUSD - bat.purchaseCostUSD - bat.maintenanceCostUSD),
      highlight: true,
    },
  ];

  return { technical, utilization, financial };
}

export default function SpvBatteriesPage() {
  const [batteries, setBatteries] = useState<SpvBattery[]>([]);
  const [period, setPeriod] = useState<TimePeriod>("monthly");
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    seedIfEmpty();
    setBatteries(loadBatteries());
  }, []);

  function handleAdd(data: Record<string, string | number>) {
    const id = `SPV-BAT-${String(batteries.length + 1).padStart(3, "0")}`;
    const purchaseCost = Number(data.purchaseCostUSD) || 0;
    const revenuePerSwap = Number(data.revenuePerSwapUSD) || 120;
    const newBattery: SpvBattery = {
      id,
      serialNumber: String(data.serialNumber || ""),
      model: String(data.model || ""),
      status: "active",
      capacityKwh: Number(data.capacityKwh) || 2.88,
      nominalVoltage: Number(data.nominalVoltage) || 48,
      chemistry: String(data.chemistry || "LiFePO4"),
      maxCycles: Number(data.maxCycles) || 2000,
      currentSoH: 100,
      cyclesUsed: 0,
      swapsPerDay: 0,
      swapsPerWeek: 0,
      swapsPerMonth: 0,
      swapsTotal: 0,
      lastSwapDate: new Date().toISOString(),
      currentLocation: String(data.currentLocation || "Warehouse"),
      purchaseCostUSD: purchaseCost,
      revenuePerSwapUSD: revenuePerSwap,
      totalRevenueUSD: 0,
      maintenanceCostUSD: 0,
      breakEvenSwaps: revenuePerSwap > 0 ? Math.ceil(purchaseCost / revenuePerSwap) : 0,
      createdAt: new Date().toISOString(),
    };
    const updated = addBattery(newBattery);
    setBatteries(updated);
  }

  const totalAssets = batteries.length;
  const activeCount = batteries.filter((b) => b.status === "active").length;
  const totalRevenue = batteries.reduce((s, b) => s + b.totalRevenueUSD, 0);
  const avgSoH =
    batteries.length > 0
      ? Math.round(batteries.reduce((s, b) => s + b.currentSoH, 0) / batteries.length)
      : 0;

  return (
    <>
      <Header title="SPV Batteries" />
      <div className="flex flex-1 flex-col gap-6 p-4">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Batteries"
            description="SPV-financed battery packs — energy infrastructure with per-swap revenue model."
          />
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Battery
          </Button>
        </div>

        <SpvBanner
          accentColor="blue"
          title="Three-Asset SPV — Batteries"
          description="Batteries generate revenue through swap fees. Track break-even progress, remaining cycle life, state of health, and net profit per battery unit."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Batteries"
            value={totalAssets}
            description={`${activeCount} active`}
            icon={Battery}
          />
          <KpiCard
            title="Total Revenue"
            value={formatUSD(totalRevenue)}
            description="From swap fees"
            icon={DollarSign}
          />
          <KpiCard
            title="Avg SoH"
            value={`${avgSoH}%`}
            description="State of Health"
            icon={TrendingUp}
          />
          <KpiCard
            title="Total Swaps"
            value={batteries.reduce((s, b) => s + b.swapsTotal, 0).toLocaleString()}
            description="Lifetime swap count"
            icon={RefreshCw}
          />
        </div>

        <TimePeriodToggle value={period} onChange={setPeriod} />

        {batteries.length === 0 ? (
          <SpvEmptyState assetLabel="Battery" onAdd={() => setFormOpen(true)} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {batteries.map((bat) => {
              const { technical, utilization, financial } = buildCardData(bat, period);
              return (
                <SpvAssetCard
                  key={bat.id}
                  id={bat.id}
                  title={bat.serialNumber}
                  subtitle={bat.model}
                  status={bat.status}
                  accentColor="blue"
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
          title="Add Battery"
          fields={FORM_FIELDS}
          onSubmit={handleAdd}
        />
      </div>
    </>
  );
}
