"use client";

import { useEffect, useState } from "react";
import { Plus, Bike, TrendingUp, DollarSign, Route } from "lucide-react";
import { Header } from "@/components/layout/header";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SpvBanner } from "@/components/dashboard/spv-banner";
import { SpvEmptyState } from "@/components/dashboard/spv-empty-state";
import { SpvAssetCard } from "@/components/dashboard/spv-asset-card";
import { SpvAddForm } from "@/components/dashboard/spv-add-form";
import { TimePeriodToggle } from "@/components/dashboard/time-period-toggle";
import { Button } from "@/components/ui/button";
import { loadBikes, addBike, seedIfEmpty } from "@/lib/spv-storage";
import { formatUSD } from "@/lib/currency";
import type { SpvBike, TimePeriod, SpvFormField, SpvCardItem } from "@/types/spv";

const FORM_FIELDS: SpvFormField[] = [
  { name: "assetTag", label: "Asset Tag", type: "text", section: "technical", placeholder: "MX-EBK-2024-XXXX", required: true },
  { name: "model", label: "Model", type: "text", section: "technical", placeholder: "Spear Bodaboda EV-200", required: true },
  { name: "frameNumber", label: "Frame Number", type: "text", section: "technical", placeholder: "FR-SBE-24-XXXXX" },
  { name: "motorPowerW", label: "Motor Power (W)", type: "number", section: "technical", placeholder: "2000" },
  { name: "batteryCapacityAh", label: "Battery Capacity (Ah)", type: "number", section: "technical", placeholder: "60" },
  { name: "maxRangeKm", label: "Max Range (km)", type: "number", section: "technical", placeholder: "80" },
  { name: "assignedRider", label: "Assigned Rider", type: "text", section: "utilization", placeholder: "Rider name" },
  { name: "kmPerMonth", label: "Est. km / month", type: "number", section: "utilization", placeholder: "1000" },
  { name: "purchaseCostUSD", label: "Purchase Cost ($)", type: "number", section: "financial", placeholder: "185000", required: true },
  { name: "monthlyLeaseUSD", label: "Monthly Lease ($)", type: "number", section: "financial", placeholder: "12500", required: true },
  { name: "paymentsTotal", label: "Total Payments", type: "number", section: "financial", placeholder: "18" },
];

function getUtilizationValue(bike: SpvBike, field: "km" | "trips", period: TimePeriod): number {
  if (field === "km") {
    switch (period) {
      case "daily": return bike.kmPerDay;
      case "weekly": return bike.kmPerWeek;
      case "monthly": return bike.kmPerMonth;
      case "yearly": return bike.kmPerMonth * 12;
      case "all": return bike.kmTotal;
    }
  }
  switch (period) {
    case "daily": return bike.tripsPerDay;
    case "weekly": return bike.tripsPerWeek;
    case "monthly": return bike.tripsPerMonth;
    case "yearly": return bike.tripsPerMonth * 12;
    case "all": return bike.tripsTotal;
  }
}

function buildCardData(bike: SpvBike, period: TimePeriod) {
  const costPerKm = bike.kmPerMonth > 0 ? (bike.monthlyLeaseUSD / bike.kmPerMonth).toFixed(1) : "—";
  const compliancePct = bike.paymentsTotal > 0 ? Math.round((bike.paymentsMade / bike.paymentsTotal) * 100) : 0;
  const roi = bike.purchaseCostUSD > 0 ? Math.round(((bike.revenueToDateUSD - bike.totalPaidUSD) / bike.purchaseCostUSD) * 100) : 0;

  const technical: SpvCardItem[] = [
    { label: "Model", value: bike.model },
    { label: "Frame #", value: bike.frameNumber },
    { label: "Motor", value: `${bike.motorPowerW}W` },
    { label: "Battery", value: `${bike.batteryCapacityAh}Ah` },
    { label: "Max Range", value: bike.maxRangeKm, suffix: "km" },
  ];

  const utilization: SpvCardItem[] = [
    { label: "Assigned Rider", value: bike.assignedRider },
    { label: "Distance", value: getUtilizationValue(bike, "km", period).toLocaleString(), suffix: "km" },
    { label: "Trips", value: getUtilizationValue(bike, "trips", period).toLocaleString() },
  ];

  const financial: SpvCardItem[] = [
    { label: "Purchase Cost", value: formatUSD(bike.purchaseCostUSD) },
    { label: "Monthly Lease", value: formatUSD(bike.monthlyLeaseUSD) },
    { label: "Paid / Total", value: `${bike.paymentsMade} / ${bike.paymentsTotal}` },
    { label: "Outstanding", value: formatUSD(bike.outstandingUSD) },
    { label: "Cost per km", value: `$${costPerKm}`, highlight: true },
    { label: "Payment Compliance", value: `${compliancePct}%`, highlight: true },
    { label: "ROI", value: `${roi}%`, highlight: true },
  ];

  return { technical, utilization, financial };
}

export default function SpvBikesPage() {
  const [bikes, setBikes] = useState<SpvBike[]>([]);
  const [period, setPeriod] = useState<TimePeriod>("monthly");
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    seedIfEmpty();
    setBikes(loadBikes());
  }, []);

  function handleAdd(data: Record<string, string | number>) {
    const id = `SPV-BK-${String(bikes.length + 1).padStart(3, "0")}`;
    const newBike: SpvBike = {
      id,
      assetTag: String(data.assetTag || ""),
      model: String(data.model || ""),
      status: "active",
      frameNumber: String(data.frameNumber || ""),
      motorPowerW: Number(data.motorPowerW) || 2000,
      batteryCapacityAh: Number(data.batteryCapacityAh) || 60,
      maxRangeKm: Number(data.maxRangeKm) || 80,
      assignedRider: String(data.assignedRider || "Unassigned"),
      kmPerDay: 0,
      kmPerWeek: 0,
      kmPerMonth: Number(data.kmPerMonth) || 0,
      kmTotal: 0,
      tripsPerDay: 0,
      tripsPerWeek: 0,
      tripsPerMonth: 0,
      tripsTotal: 0,
      purchaseCostUSD: Number(data.purchaseCostUSD) || 0,
      monthlyLeaseUSD: Number(data.monthlyLeaseUSD) || 0,
      totalPaidUSD: 0,
      outstandingUSD: Number(data.purchaseCostUSD) || 0,
      paymentsMade: 0,
      paymentsTotal: Number(data.paymentsTotal) || 18,
      revenueToDateUSD: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = addBike(newBike);
    setBikes(updated);
  }

  const totalAssets = bikes.length;
  const activeCount = bikes.filter((b) => b.status === "active").length;
  const totalRevenue = bikes.reduce((s, b) => s + b.revenueToDateUSD, 0);
  const avgCompliance =
    bikes.length > 0
      ? Math.round(
          bikes.reduce(
            (s, b) =>
              s +
              (b.paymentsTotal > 0
                ? (b.paymentsMade / b.paymentsTotal) * 100
                : 0),
            0
          ) / bikes.length
        )
      : 0;

  return (
    <>
      <Header title="SPV Electric Bikes" />
      <div className="flex flex-1 flex-col gap-6 p-4">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Electric Bikes"
            description="SPV-financed electric bikes — MFI/Bank lease model with monthly rider payments."
          />
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Bike
          </Button>
        </div>

        <SpvBanner
          accentColor="green"
          title="Three-Asset SPV — Electric Bikes"
          description="Each bike is financed through MFI/Bank partnerships. Riders pay monthly lease fees, building towards ownership. Track cost per km, payment compliance, and ROI per asset."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Bikes"
            value={totalAssets}
            description={`${activeCount} active`}
            icon={Bike}
          />
          <KpiCard
            title="Total Revenue"
            value={formatUSD(totalRevenue)}
            description="From lease payments"
            icon={DollarSign}
          />
          <KpiCard
            title="Avg Compliance"
            value={`${avgCompliance}%`}
            description="Payment compliance rate"
            icon={TrendingUp}
          />
          <KpiCard
            title="Fleet km/month"
            value={bikes.reduce((s, b) => s + b.kmPerMonth, 0).toLocaleString()}
            description="Combined monthly distance"
            icon={Route}
          />
        </div>

        <TimePeriodToggle value={period} onChange={setPeriod} />

        {bikes.length === 0 ? (
          <SpvEmptyState assetLabel="Electric Bike" onAdd={() => setFormOpen(true)} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {bikes.map((bike) => {
              const { technical, utilization, financial } = buildCardData(bike, period);
              return (
                <SpvAssetCard
                  key={bike.id}
                  id={bike.id}
                  title={bike.assetTag}
                  subtitle={bike.model}
                  status={bike.status}
                  accentColor="green"
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
          title="Add Electric Bike"
          fields={FORM_FIELDS}
          onSubmit={handleAdd}
        />
      </div>
    </>
  );
}
