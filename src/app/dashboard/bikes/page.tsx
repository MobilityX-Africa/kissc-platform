"use client";

import { useEffect, useState } from "react";
import { Plus, Bike, Wrench, CheckCircle, Route } from "lucide-react";
import { Header } from "@/components/layout/header";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SpvBanner } from "@/components/dashboard/spv-banner";
import { SpvEmptyState } from "@/components/dashboard/spv-empty-state";
import { SpvAssetCard } from "@/components/dashboard/spv-asset-card";
import { SpvAddForm } from "@/components/dashboard/spv-add-form";
import { Button } from "@/components/ui/button";
import { loadOpsBikes, addOpsBike, seedOpsIfEmpty } from "@/lib/ops-storage";
import type { Bike as BikeType } from "@/types";
import type { SpvFormField, SpvCardItem } from "@/types/spv";

const FORM_FIELDS: SpvFormField[] = [
  { name: "registrationNumber", label: "Registration Number", type: "text", section: "technical", placeholder: "KMFX XXXA", required: true },
  { name: "model", label: "Model", type: "select", section: "technical", required: true, options: [
    { label: "Spiro Gen3", value: "Spiro Gen3" },
    { label: "Spiro Gen2", value: "Spiro Gen2" },
    { label: "Roam Air", value: "Roam Air" },
    { label: "Spear EV-200", value: "Spear EV-200" },
  ]},
  { name: "currentBatteryId", label: "Battery ID", type: "text", section: "technical", placeholder: "OPS-BAT-XXX" },
  { name: "currentRiderId", label: "Assigned Rider ID", type: "text", section: "utilization", placeholder: "OPS-RD-XXX" },
  { name: "totalKm", label: "Starting Odometer (km)", type: "number", section: "utilization", placeholder: "0" },
];

function buildCardData(bike: BikeType) {
  const technical: SpvCardItem[] = [
    { label: "Registration", value: bike.registrationNumber },
    { label: "Model", value: bike.model },
    { label: "Last Service", value: new Date(bike.lastServiceDate).toLocaleDateString() },
  ];

  const utilization: SpvCardItem[] = [
    { label: "Assigned Rider", value: bike.currentRiderId ?? "Unassigned" },
    { label: "Current Battery", value: bike.currentBatteryId ?? "None" },
    { label: "Total Distance", value: bike.totalKm.toLocaleString(), suffix: "km" },
  ];

  return { technical, utilization, financial: [] };
}

export default function BikesPage() {
  const [bikes, setBikes] = useState<BikeType[]>([]);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    seedOpsIfEmpty();
    setBikes(loadOpsBikes());
  }, []);

  function handleAdd(data: Record<string, string | number>) {
    const id = `OPS-BK-${String(bikes.length + 1).padStart(3, "0")}`;
    const newBike: BikeType = {
      id,
      registrationNumber: String(data.registrationNumber || ""),
      model: String(data.model || "Spiro Gen3"),
      status: "available",
      currentRiderId: data.currentRiderId ? String(data.currentRiderId) : null,
      currentBatteryId: data.currentBatteryId ? String(data.currentBatteryId) : null,
      totalKm: Number(data.totalKm) || 0,
      lastServiceDate: new Date().toISOString().split("T")[0],
    };
    const updated = addOpsBike(newBike);
    setBikes(updated);
  }

  const totalFleet = bikes.length;
  const availableCount = bikes.filter((b) => b.status === "available").length;
  const maintenanceCount = bikes.filter((b) => b.status === "maintenance").length;
  const totalKm = bikes.reduce((s, b) => s + b.totalKm, 0);

  return (
    <>
      <Header title="Bikes" />
      <div className="flex flex-1 flex-col gap-6 p-4">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Electric Bikes"
            description="Track and manage the electric bike fleet."
          />
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Bike
          </Button>
        </div>

        <SpvBanner
          accentColor="green"
          title="Fleet Operations — Electric Bikes"
          description="Monitor your electric bike fleet in real-time. Track availability, maintenance schedules, and total fleet distance across all operational bikes."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Fleet"
            value={totalFleet}
            description="Electric bikes registered"
            icon={Bike}
          />
          <KpiCard
            title="Available"
            value={availableCount}
            description="Ready for assignment"
            icon={CheckCircle}
          />
          <KpiCard
            title="In Maintenance"
            value={maintenanceCount}
            description="Under service"
            icon={Wrench}
          />
          <KpiCard
            title="Total Distance"
            value={`${totalKm.toLocaleString()} km`}
            description="Combined fleet odometer"
            icon={Route}
          />
        </div>

        {bikes.length === 0 ? (
          <SpvEmptyState assetLabel="Electric Bike" onAdd={() => setFormOpen(true)} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {bikes.map((bike) => {
              const { technical, utilization, financial } = buildCardData(bike);
              return (
                <SpvAssetCard
                  key={bike.id}
                  id={bike.id}
                  title={bike.registrationNumber}
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
