"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpvAssetCard } from "@/components/dashboard/spv-asset-card";
import { Bike, Battery, Box } from "lucide-react";
import type { SpvBike, SpvBattery, SpvSwapBox, SpvCardItem } from "@/types/spv";
import { formatUSD } from "@/lib/currency";

interface SpvAssetBreakdownProps {
  bikes: SpvBike[];
  batteries: SpvBattery[];
  swapBoxes: SpvSwapBox[];
}

function bikeCardItems(b: SpvBike): {
  technical: SpvCardItem[];
  utilization: SpvCardItem[];
  financial: SpvCardItem[];
} {
  return {
    technical: [
      { label: "Model", value: b.model },
      { label: "Frame #", value: b.frameNumber },
      { label: "Motor Power", value: b.motorPowerW, suffix: "W" },
      { label: "Battery", value: b.batteryCapacityAh, suffix: "Ah" },
      { label: "Max Range", value: b.maxRangeKm, suffix: "km" },
    ],
    utilization: [
      { label: "Assigned Rider", value: b.assignedRider },
      { label: "Daily km", value: b.kmPerDay },
      { label: "Monthly km", value: b.kmPerMonth.toLocaleString() },
      { label: "Total km", value: b.kmTotal.toLocaleString() },
      { label: "Monthly Trips", value: b.tripsPerMonth },
    ],
    financial: [
      { label: "Purchase Cost", value: formatUSD(b.purchaseCostUSD) },
      { label: "Monthly Lease", value: formatUSD(b.monthlyLeaseUSD) },
      { label: "Total Paid", value: formatUSD(b.totalPaidUSD) },
      { label: "Outstanding", value: formatUSD(b.outstandingUSD) },
      {
        label: "Revenue to Date",
        value: formatUSD(b.revenueToDateUSD),
        highlight: true,
      },
    ],
  };
}

function batteryCardItems(b: SpvBattery): {
  technical: SpvCardItem[];
  utilization: SpvCardItem[];
  financial: SpvCardItem[];
} {
  return {
    technical: [
      { label: "Model", value: b.model },
      { label: "Serial #", value: b.serialNumber },
      { label: "Capacity", value: b.capacityKwh, suffix: "kWh" },
      { label: "Chemistry", value: b.chemistry },
      { label: "SoH", value: `${b.currentSoH}%` },
    ],
    utilization: [
      { label: "Cycles Used", value: `${b.cyclesUsed} / ${b.maxCycles}` },
      { label: "Daily Swaps", value: b.swapsPerDay },
      { label: "Monthly Swaps", value: b.swapsPerMonth },
      { label: "Total Swaps", value: b.swapsTotal.toLocaleString() },
      { label: "Location", value: b.currentLocation },
    ],
    financial: [
      { label: "Purchase Cost", value: formatUSD(b.purchaseCostUSD) },
      { label: "Rev/Swap", value: formatUSD(b.revenuePerSwapUSD) },
      { label: "Maintenance", value: formatUSD(b.maintenanceCostUSD) },
      { label: "Break-even", value: `${b.breakEvenSwaps} swaps` },
      {
        label: "Total Revenue",
        value: formatUSD(b.totalRevenueUSD),
        highlight: true,
      },
    ],
  };
}

function swapBoxCardItems(b: SpvSwapBox): {
  technical: SpvCardItem[];
  utilization: SpvCardItem[];
  financial: SpvCardItem[];
} {
  return {
    technical: [
      { label: "Station", value: b.name },
      { label: "Station ID", value: b.stationId },
      { label: "Slots", value: b.totalSlots },
      { label: "Solar", value: `${b.solarCapacityW}W` },
      { label: "Grid", value: b.gridConnected ? "Yes" : "No" },
    ],
    utilization: [
      { label: "Location", value: b.location },
      { label: "Daily Swaps", value: b.swapsPerDay },
      { label: "Monthly Swaps", value: b.swapsPerMonth.toLocaleString() },
      { label: "Total Swaps", value: b.swapsTotal.toLocaleString() },
      { label: "Slot Utilization", value: `${b.avgSlotUtilization}%` },
    ],
    financial: [
      { label: "Install Cost", value: formatUSD(b.installCostUSD) },
      { label: "Monthly OPEX", value: formatUSD(b.monthlyOpexUSD) },
      { label: "Total Cost", value: formatUSD(b.totalCostUSD) },
      { label: "Payback", value: `${b.paybackProgressPct}%` },
      {
        label: "Total Revenue",
        value: formatUSD(b.totalRevenueUSD),
        highlight: true,
      },
    ],
  };
}

export function SpvAssetBreakdown({
  bikes,
  batteries,
  swapBoxes,
}: SpvAssetBreakdownProps) {
  const totalAssets = bikes.length + batteries.length + swapBoxes.length;

  if (totalAssets === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        No assets assigned to this SPV yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Asset Breakdown</h3>
      <Tabs defaultValue="bikes" className="w-full">
        <TabsList>
          <TabsTrigger value="bikes" className="gap-1.5">
            <Bike className="h-3.5 w-3.5" />
            Bikes ({bikes.length})
          </TabsTrigger>
          <TabsTrigger value="batteries" className="gap-1.5">
            <Battery className="h-3.5 w-3.5" />
            Batteries ({batteries.length})
          </TabsTrigger>
          <TabsTrigger value="swapBoxes" className="gap-1.5">
            <Box className="h-3.5 w-3.5" />
            Swap Boxes ({swapBoxes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bikes" className="mt-4">
          {bikes.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No bikes in this SPV
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {bikes.map((b) => {
                const items = bikeCardItems(b);
                return (
                  <SpvAssetCard
                    key={b.id}
                    id={b.id}
                    title={b.model}
                    subtitle={b.assignedRider}
                    status={b.status}
                    accentColor="green"
                    technical={items.technical}
                    utilization={items.utilization}
                    financial={items.financial}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="batteries" className="mt-4">
          {batteries.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No batteries in this SPV
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {batteries.map((b) => {
                const items = batteryCardItems(b);
                return (
                  <SpvAssetCard
                    key={b.id}
                    id={b.id}
                    title={b.model}
                    subtitle={b.serialNumber}
                    status={b.status}
                    accentColor="blue"
                    technical={items.technical}
                    utilization={items.utilization}
                    financial={items.financial}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="swapBoxes" className="mt-4">
          {swapBoxes.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No swap boxes in this SPV
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {swapBoxes.map((b) => {
                const items = swapBoxCardItems(b);
                return (
                  <SpvAssetCard
                    key={b.id}
                    id={b.id}
                    title={b.name}
                    subtitle={b.location}
                    status={b.status}
                    accentColor="orange"
                    technical={items.technical}
                    utilization={items.utilization}
                    financial={items.financial}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
