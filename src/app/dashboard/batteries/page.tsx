"use client";

import { useEffect, useState } from "react";
import { Plus, Battery, BatteryCharging, Activity, Zap } from "lucide-react";
import { Header } from "@/components/layout/header";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SpvBanner } from "@/components/dashboard/spv-banner";
import { SpvEmptyState } from "@/components/dashboard/spv-empty-state";
import { SpvAssetCard } from "@/components/dashboard/spv-asset-card";
import { SpvAddForm } from "@/components/dashboard/spv-add-form";
import { Button } from "@/components/ui/button";
import { loadOpsBatteries, addOpsBattery, seedOpsIfEmpty } from "@/lib/ops-storage";
import type { Battery as BatteryType } from "@/types";
import type { SpvFormField, SpvCardItem } from "@/types/spv";

const FORM_FIELDS: SpvFormField[] = [
  { name: "serialNumber", label: "Serial Number", type: "text", section: "technical", placeholder: "KSC-BAT-2024-XXXX", required: true },
  { name: "capacityKwh", label: "Capacity (kWh)", type: "number", section: "technical", placeholder: "2.4", required: true },
  { name: "stateOfHealth", label: "State of Health (%)", type: "number", section: "technical", placeholder: "100" },
  { name: "currentCharge", label: "Current Charge (%)", type: "number", section: "utilization", placeholder: "100" },
  { name: "cycleCount", label: "Cycle Count", type: "number", section: "utilization", placeholder: "0" },
  { name: "currentLocation", label: "Current Location", type: "text", section: "utilization", placeholder: "Westlands Hub" },
];

function buildCardData(battery: BatteryType) {
  const healthRating = battery.stateOfHealth > 80 ? "Good" : battery.stateOfHealth > 60 ? "Fair" : "Poor";

  const technical: SpvCardItem[] = [
    { label: "Serial Number", value: battery.serialNumber },
    { label: "Capacity", value: `${battery.capacityKwh} kWh` },
    { label: "State of Health", value: `${battery.stateOfHealth}%`, highlight: battery.stateOfHealth < 60 },
  ];

  const utilization: SpvCardItem[] = [
    { label: "Current Charge", value: `${battery.currentCharge}%` },
    { label: "Cycle Count", value: battery.cycleCount.toLocaleString() },
    { label: "Location", value: battery.currentLocation },
    { label: "Health Rating", value: healthRating, highlight: true },
  ];

  return { technical, utilization, financial: [] };
}

export default function BatteriesPage() {
  const [batteries, setBatteries] = useState<BatteryType[]>([]);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    seedOpsIfEmpty();
    setBatteries(loadOpsBatteries());
  }, []);

  function handleAdd(data: Record<string, string | number>) {
    const id = `OPS-BAT-${String(batteries.length + 1).padStart(3, "0")}`;
    const newBattery: BatteryType = {
      id,
      serialNumber: String(data.serialNumber || ""),
      capacityKwh: Number(data.capacityKwh) || 2.4,
      stateOfHealth: Number(data.stateOfHealth) || 100,
      currentCharge: Number(data.currentCharge) || 100,
      status: "available",
      cycleCount: Number(data.cycleCount) || 0,
      currentLocation: String(data.currentLocation || "Warehouse"),
    };
    const updated = addOpsBattery(newBattery);
    setBatteries(updated);
  }

  const totalBatteries = batteries.length;
  const inUseCount = batteries.filter((b) => b.status === "in-use").length;
  const chargingCount = batteries.filter((b) => b.status === "charging").length;
  const avgHealth =
    batteries.length > 0
      ? Math.round(batteries.reduce((s, b) => s + b.stateOfHealth, 0) / batteries.length)
      : 0;

  return (
    <>
      <Header title="Batteries" />
      <div className="flex flex-1 flex-col gap-6 p-4">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Batteries"
            description="Monitor battery inventory, health, and charging status."
          />
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Battery
          </Button>
        </div>

        <SpvBanner
          accentColor="blue"
          title="Fleet Operations — Batteries"
          description="Track battery state of health, charge cycles, and locations. Monitor degradation trends and ensure optimal battery availability across the swap network."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Batteries"
            value={totalBatteries}
            description="In inventory"
            icon={Battery}
          />
          <KpiCard
            title="In Use"
            value={inUseCount}
            description="Deployed on bikes"
            icon={Zap}
          />
          <KpiCard
            title="Charging"
            value={chargingCount}
            description="At swap stations"
            icon={BatteryCharging}
          />
          <KpiCard
            title="Avg Health"
            value={`${avgHealth}%`}
            description="Fleet state of health"
            icon={Activity}
          />
        </div>

        {batteries.length === 0 ? (
          <SpvEmptyState assetLabel="Battery" onAdd={() => setFormOpen(true)} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {batteries.map((battery) => {
              const { technical, utilization, financial } = buildCardData(battery);
              return (
                <SpvAssetCard
                  key={battery.id}
                  id={battery.id}
                  title={battery.serialNumber}
                  subtitle={`${battery.capacityKwh} kWh`}
                  status={battery.status}
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
