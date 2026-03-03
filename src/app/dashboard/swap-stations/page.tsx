"use client";

import { useEffect, useState } from "react";
import { Plus, MapPin, Wifi, Battery, Columns3 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SpvBanner } from "@/components/dashboard/spv-banner";
import { SpvEmptyState } from "@/components/dashboard/spv-empty-state";
import { SpvAssetCard } from "@/components/dashboard/spv-asset-card";
import { SpvAddForm } from "@/components/dashboard/spv-add-form";
import { Button } from "@/components/ui/button";
import { loadOpsSwapStations, addOpsSwapStation, seedOpsIfEmpty } from "@/lib/ops-storage";
import type { SwapStation } from "@/types";
import type { SpvFormField, SpvCardItem } from "@/types/spv";

const FORM_FIELDS: SpvFormField[] = [
  { name: "name", label: "Station Name", type: "text", section: "technical", placeholder: "e.g. Westlands Hub", required: true },
  { name: "address", label: "Address", type: "text", section: "technical", placeholder: "Street, Area, Nairobi", required: true },
  { name: "totalSlots", label: "Total Slots", type: "number", section: "technical", placeholder: "20", required: true },
  { name: "operatingHours", label: "Operating Hours", type: "text", section: "technical", placeholder: "06:00 - 22:00" },
  { name: "lat", label: "Latitude", type: "number", section: "utilization", placeholder: "-1.2864" },
  { name: "lng", label: "Longitude", type: "number", section: "utilization", placeholder: "36.8172" },
];

function buildCardData(station: SwapStation) {
  const occupancyPct = station.totalSlots > 0
    ? Math.round(((station.availableBatteries + station.chargingBatteries) / station.totalSlots) * 100)
    : 0;

  const technical: SpvCardItem[] = [
    { label: "Address", value: station.location.address },
    { label: "Total Slots", value: station.totalSlots },
    { label: "Operating Hours", value: station.operatingHours },
  ];

  const utilization: SpvCardItem[] = [
    { label: "Available Batteries", value: station.availableBatteries },
    { label: "Charging", value: station.chargingBatteries },
    { label: "Empty Slots", value: station.emptySlots },
    { label: "Occupancy", value: `${occupancyPct}%`, highlight: true },
  ];

  return { technical, utilization, financial: [] };
}

export default function SwapStationsPage() {
  const [stations, setStations] = useState<SwapStation[]>([]);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    seedOpsIfEmpty();
    setStations(loadOpsSwapStations());
  }, []);

  function handleAdd(data: Record<string, string | number>) {
    const id = `OPS-SS-${String(stations.length + 1).padStart(3, "0")}`;
    const totalSlots = Number(data.totalSlots) || 20;
    const newStation: SwapStation = {
      id,
      name: String(data.name || ""),
      location: {
        address: String(data.address || ""),
        lat: Number(data.lat) || -1.2864,
        lng: Number(data.lng) || 36.8172,
      },
      totalSlots,
      availableBatteries: 0,
      chargingBatteries: 0,
      emptySlots: totalSlots,
      status: "online",
      operatingHours: String(data.operatingHours || "06:00 - 22:00"),
    };
    const updated = addOpsSwapStation(newStation);
    setStations(updated);
  }

  const totalStations = stations.length;
  const onlineCount = stations.filter((s) => s.status === "online").length;
  const totalAvailable = stations.reduce((s, st) => s + st.availableBatteries, 0);
  const totalSlots = stations.reduce((s, st) => s + st.totalSlots, 0);

  return (
    <>
      <Header title="Swap Stations" />
      <div className="flex flex-1 flex-col gap-6 p-4">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Swap Stations"
            description="Monitor battery swap station network across Nairobi."
          />
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Station
          </Button>
        </div>

        <SpvBanner
          accentColor="orange"
          title="Fleet Operations — Swap Stations"
          description="Real-time monitoring of your battery swap station network. Track slot utilization, battery availability, and station uptime across all locations."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Stations"
            value={totalStations}
            description="Across Nairobi"
            icon={MapPin}
          />
          <KpiCard
            title="Online"
            value={onlineCount}
            description="Currently operational"
            icon={Wifi}
          />
          <KpiCard
            title="Available Batteries"
            value={totalAvailable}
            description="Ready for swap"
            icon={Battery}
          />
          <KpiCard
            title="Total Slots"
            value={totalSlots}
            description="Network capacity"
            icon={Columns3}
          />
        </div>

        {stations.length === 0 ? (
          <SpvEmptyState assetLabel="Swap Station" onAdd={() => setFormOpen(true)} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stations.map((station) => {
              const { technical, utilization, financial } = buildCardData(station);
              return (
                <SpvAssetCard
                  key={station.id}
                  id={station.id}
                  title={station.name}
                  subtitle={station.location.address}
                  status={station.status}
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
          title="Add Swap Station"
          fields={FORM_FIELDS}
          onSubmit={handleAdd}
        />
      </div>
    </>
  );
}
