"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Landmark, TrendingUp, Percent, Layers } from "lucide-react";
import {
  loadVehicles,
  loadBikes,
  loadBatteries,
  loadSwapBoxes,
  loadAllocators,
  addVehicle,
  seedIfEmpty,
} from "@/lib/spv-storage";
import { computeSpvMetrics } from "@/lib/spv-computations";
import { SpvVehicleCard } from "@/components/dashboard/spv-vehicle-card";
import { SpvAddVehicleForm } from "@/components/dashboard/spv-add-vehicle-form";
import { formatUSDCompact } from "@/lib/currency";
import type { SpvVehicle, SpvComputedMetrics } from "@/types/spv";

interface VehicleWithMetrics {
  vehicle: SpvVehicle;
  metrics: SpvComputedMetrics;
}

export default function SpvListPage() {
  const [vehiclesWithMetrics, setVehiclesWithMetrics] = useState<
    VehicleWithMetrics[]
  >([]);
  const [showForm, setShowForm] = useState(false);

  function refresh() {
    seedIfEmpty();
    const vehicles = loadVehicles();
    const bikes = loadBikes();
    const batteries = loadBatteries();
    const swapBoxes = loadSwapBoxes();
    const allocators = loadAllocators();

    const items = vehicles.map((vehicle) => ({
      vehicle,
      metrics: computeSpvMetrics(
        vehicle,
        bikes,
        batteries,
        swapBoxes,
        allocators.filter((a) => a.spvId === vehicle.id)
      ),
    }));

    setVehiclesWithMetrics(items);
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleAddVehicle(vehicle: SpvVehicle) {
    addVehicle(vehicle);
    refresh();
  }

  // Aggregate KPIs
  const totalSpvs = vehiclesWithMetrics.length;
  const totalRaised = vehiclesWithMetrics.reduce(
    (s, v) => s + v.vehicle.raisedAmountUSD,
    0
  );
  const totalRevenue = vehiclesWithMetrics.reduce(
    (s, v) => s + v.metrics.totalRevenueUSD,
    0
  );
  const avgRepayment =
    totalSpvs > 0
      ? Math.round(
          vehiclesWithMetrics.reduce((s, v) => s + v.metrics.repaymentPct, 0) /
            totalSpvs
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SPV Overview</h1>
          <p className="text-sm text-muted-foreground">
            Manage Special Purpose Vehicles and investor capital
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Create SPV
        </Button>
      </div>

      {/* Banner */}
      <div className="rounded-lg border-l-4 border-l-[#5B4B8A] bg-purple-50 p-4">
        <h3 className="text-sm font-semibold text-purple-700">
          SPV Investment Model
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Each SPV groups e-mobility assets and distributes revenue via a 70-20-10
          waterfall: 70% to investors, 20% to operators, 10% to MobilityX.
          Capital allocators receive proportional returns based on their
          investment share.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Landmark className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">
                Total SPVs
              </p>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalSpvs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">
                Capital Raised
              </p>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">
              {formatUSDCompact(totalRaised)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">
                Total Revenue
              </p>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">
              {formatUSDCompact(totalRevenue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">
                Avg Repayment
              </p>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">
              {avgRepayment}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Cards or Empty State */}
      {vehiclesWithMetrics.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Landmark className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-medium">
            No SPV Vehicles yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first SPV to start tracking investor capital and asset
            returns.
          </p>
          <Button className="mt-4" onClick={() => setShowForm(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Create SPV
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {vehiclesWithMetrics.map(({ vehicle, metrics }) => (
            <SpvVehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              totalRevenue={metrics.totalRevenueUSD}
              repaymentPct={metrics.repaymentPct}
              totalAssets={metrics.totalAssets}
            />
          ))}
        </div>
      )}

      {/* Form */}
      <SpvAddVehicleForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleAddVehicle}
      />
    </div>
  );
}
