"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Layers,
  TrendingUp,
  Percent,
  CalendarClock,
} from "lucide-react";
import {
  loadVehicleById,
  loadBikes,
  loadBatteries,
  loadSwapBoxes,
  loadAllocatorsBySpv,
  addAllocator,
  saveAllocators,
  loadAllocators,
  loadVehicles,
  saveVehicles,
  seedIfEmpty,
} from "@/lib/spv-storage";
import {
  computeSpvMetrics,
  spvStatusVariant,
} from "@/lib/spv-computations";
import { SpvWaterfallChart } from "@/components/dashboard/spv-waterfall-chart";
import { SpvInvestorTable } from "@/components/dashboard/spv-investor-table";
import { SpvRepaymentProgress } from "@/components/dashboard/spv-repayment-progress";
import { SpvAssetBreakdown } from "@/components/dashboard/spv-asset-breakdown";
import { SpvAddInvestorForm } from "@/components/dashboard/spv-add-investor-form";
import { formatUSD, formatUSDCompact } from "@/lib/currency";
import type {
  SpvVehicle,
  SpvBike,
  SpvBattery,
  SpvSwapBox,
  CapitalAllocator,
  SpvComputedMetrics,
} from "@/types/spv";

function formatPaybackDate(date: string | null): string {
  if (!date) return "---";
  if (date === "Fully Repaid") return "Fully Repaid";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function SpvDetailPage() {
  const params = useParams();
  const router = useRouter();
  const spvId = params.id as string;

  const [vehicle, setVehicle] = useState<SpvVehicle | null>(null);
  const [metrics, setMetrics] = useState<SpvComputedMetrics | null>(null);
  const [linkedBikes, setLinkedBikes] = useState<SpvBike[]>([]);
  const [linkedBatteries, setLinkedBatteries] = useState<SpvBattery[]>([]);
  const [linkedSwapBoxes, setLinkedSwapBoxes] = useState<SpvSwapBox[]>([]);
  const [allocators, setAllocators] = useState<CapitalAllocator[]>([]);
  const [showInvestorForm, setShowInvestorForm] = useState(false);

  function refresh() {
    seedIfEmpty();
    const v = loadVehicleById(spvId);
    if (!v) return;

    const bikes = loadBikes();
    const batteries = loadBatteries();
    const swapBoxes = loadSwapBoxes();
    const spvAllocators = loadAllocatorsBySpv(spvId);

    setVehicle(v);
    setAllocators(spvAllocators);
    setLinkedBikes(bikes.filter((b) => v.bikeIds.includes(b.id)));
    setLinkedBatteries(batteries.filter((b) => v.batteryIds.includes(b.id)));
    setLinkedSwapBoxes(swapBoxes.filter((b) => v.swapBoxIds.includes(b.id)));
    setMetrics(
      computeSpvMetrics(v, bikes, batteries, swapBoxes, spvAllocators)
    );
  }

  useEffect(() => {
    refresh();
  }, [spvId]);

  function handleAddInvestor(allocator: CapitalAllocator) {
    // Add allocator to storage
    addAllocator(allocator);

    // Recalculate raised amount on the vehicle
    const allAllocators = loadAllocatorsBySpv(spvId);
    const totalInvested = allAllocators.reduce(
      (s, a) => s + a.investedAmountUSD,
      0
    );

    // Update ownership percentages for all allocators
    const updatedAllocators = loadAllocators().map((a) => {
      if (a.spvId !== spvId) return a;
      return {
        ...a,
        ownershipPct:
          totalInvested > 0
            ? Math.round((a.investedAmountUSD / totalInvested) * 10000) / 100
            : 0,
      };
    });
    saveAllocators(updatedAllocators);

    // Update vehicle raised amount
    const vehicles = loadVehicles();
    const idx = vehicles.findIndex((v) => v.id === spvId);
    if (idx >= 0) {
      vehicles[idx] = { ...vehicles[idx], raisedAmountUSD: totalInvested };
      saveVehicles(vehicles);
    }

    refresh();
  }

  if (!vehicle || !metrics) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        SPV not found
      </div>
    );
  }

  const totalReturned = allocators.reduce(
    (s, a) => s + a.totalReturnedUSD,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/spv")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {vehicle.name}
            </h1>
            <Badge variant={spvStatusVariant(vehicle.status)}>
              {vehicle.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{vehicle.city}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">
                Total Assets
              </p>
            </div>
            <p className="mt-2 text-2xl font-bold">{metrics.totalAssets}</p>
            <p className="text-xs text-muted-foreground">
              {metrics.bikeCount} bikes, {metrics.batteryCount} batteries,{" "}
              {metrics.swapBoxCount} swap boxes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">
                Total Revenue
              </p>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">
              {formatUSDCompact(metrics.totalRevenueUSD)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">
                Repayment
              </p>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">
              {metrics.repaymentPct}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">
                Projected Payback
              </p>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {formatPaybackDate(metrics.projectedPaybackDate)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Waterfall + Repayment Progress */}
      <div className="grid gap-4 lg:grid-cols-2">
        <SpvWaterfallChart waterfall={metrics.waterfall} />
        <SpvRepaymentProgress
          repaymentPct={metrics.repaymentPct}
          raisedAmountUSD={vehicle.raisedAmountUSD}
          totalReturnedUSD={totalReturned}
        />
      </div>

      {/* Investor Table */}
      <SpvInvestorTable
        investors={metrics.investorReturns}
        onAddInvestor={() => setShowInvestorForm(true)}
      />

      {/* Asset Breakdown */}
      <SpvAssetBreakdown
        bikes={linkedBikes}
        batteries={linkedBatteries}
        swapBoxes={linkedSwapBoxes}
      />

      {/* Add Investor Form */}
      <SpvAddInvestorForm
        open={showInvestorForm}
        onOpenChange={setShowInvestorForm}
        spvId={spvId}
        onSubmit={handleAddInvestor}
      />
    </div>
  );
}
