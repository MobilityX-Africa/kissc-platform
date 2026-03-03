"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Bike, Battery, Box } from "lucide-react";
import type { SpvVehicle } from "@/types/spv";
import { spvStatusVariant } from "@/lib/spv-computations";
import { formatUSDCompact } from "@/lib/currency";

interface SpvVehicleCardProps {
  vehicle: SpvVehicle;
  totalRevenue: number;
  repaymentPct: number;
  totalAssets: number;
}

export function SpvVehicleCard({
  vehicle,
  totalRevenue,
  repaymentPct,
  totalAssets,
}: SpvVehicleCardProps) {
  const raisePct =
    vehicle.targetAmountUSD > 0
      ? Math.round(
          (vehicle.raisedAmountUSD / vehicle.targetAmountUSD) * 100
        )
      : 0;

  return (
    <Link href={`/dashboard/spv/${vehicle.id}`}>
      <Card className="group cursor-pointer transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-sm font-semibold group-hover:text-[#5B4B8A]">
                {vehicle.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{vehicle.city}</p>
            </div>
            <Badge variant={spvStatusVariant(vehicle.status)}>
              {vehicle.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Capital raise progress */}
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-muted-foreground">Capital Raised</span>
              <span className="font-medium tabular-nums">
                {formatUSDCompact(vehicle.raisedAmountUSD)} / {formatUSDCompact(vehicle.targetAmountUSD)}
              </span>
            </div>
            <Progress value={raisePct} className="h-2" />
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-2">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-sm font-semibold tabular-nums">
                {formatUSDCompact(totalRevenue)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Repayment</p>
              <p className="text-sm font-semibold tabular-nums">
                {repaymentPct}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Assets</p>
              <p className="text-sm font-semibold tabular-nums">
                {totalAssets}
              </p>
            </div>
          </div>

          {/* Asset breakdown icons */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Bike className="h-3.5 w-3.5" />
                {vehicle.bikeIds.length}
              </span>
              <span className="flex items-center gap-1">
                <Battery className="h-3.5 w-3.5" />
                {vehicle.batteryIds.length}
              </span>
              <span className="flex items-center gap-1">
                <Box className="h-3.5 w-3.5" />
                {vehicle.swapBoxIds.length}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
