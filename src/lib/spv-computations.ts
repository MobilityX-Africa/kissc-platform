import type {
  SpvVehicle,
  SpvBike,
  SpvBattery,
  SpvSwapBox,
  CapitalAllocator,
  WaterfallSplit,
  InvestorReturn,
  SpvComputedMetrics,
} from "@/types/spv";

// ── Constants ────────────────────────────────────────────────

export const WATERFALL_INVESTOR_PCT = 0.7;
export const WATERFALL_OPERATOR_PCT = 0.2;
export const WATERFALL_PLATFORM_PCT = 0.1;

// ── Revenue from linked assets ───────────────────────────────

export function computeSpvRevenue(
  vehicle: SpvVehicle,
  bikes: SpvBike[],
  batteries: SpvBattery[],
  swapBoxes: SpvSwapBox[]
): number {
  const bikeRev = bikes
    .filter((b) => vehicle.bikeIds.includes(b.id))
    .reduce((s, b) => s + b.revenueToDateUSD, 0);
  const batRev = batteries
    .filter((b) => vehicle.batteryIds.includes(b.id))
    .reduce((s, b) => s + b.totalRevenueUSD, 0);
  const boxRev = swapBoxes
    .filter((b) => vehicle.swapBoxIds.includes(b.id))
    .reduce((s, b) => s + b.totalRevenueUSD, 0);
  return bikeRev + batRev + boxRev;
}

// ── Waterfall Split ──────────────────────────────────────────

export function computeWaterfall(
  totalRevenue: number,
  vehicle?: SpvVehicle
): WaterfallSplit {
  // Use vehicle-specific waterfall percentages if available, otherwise defaults
  const investorPct =
    vehicle?.waterfallFinancePct != null
      ? vehicle.waterfallFinancePct / 100
      : WATERFALL_INVESTOR_PCT;
  const operatorPct =
    vehicle?.waterfallOperatorPct != null
      ? vehicle.waterfallOperatorPct / 100
      : WATERFALL_OPERATOR_PCT;
  const platformPct =
    vehicle?.waterfallMobilityxPct != null
      ? vehicle.waterfallMobilityxPct / 100
      : WATERFALL_PLATFORM_PCT;

  return {
    investorPoolUSD: Math.round(totalRevenue * investorPct),
    operatorPoolUSD: Math.round(totalRevenue * operatorPct),
    platformPoolUSD: Math.round(totalRevenue * platformPct),
    totalRevenueUSD: totalRevenue,
  };
}

// ── Investor Returns ─────────────────────────────────────────

export function computeInvestorReturns(
  allocators: CapitalAllocator[],
  totalRaised: number
): InvestorReturn[] {
  return allocators.map((a) => {
    const ownershipPct =
      totalRaised > 0 ? (a.investedAmountUSD / totalRaised) * 100 : 0;
    const outstandingUSD = Math.max(0, a.investedAmountUSD - a.totalReturnedUSD);
    const repaymentPct =
      a.investedAmountUSD > 0
        ? Math.round((a.totalReturnedUSD / a.investedAmountUSD) * 100)
        : 0;
    return {
      allocatorId: a.id,
      name: a.name,
      investedAmountUSD: a.investedAmountUSD,
      ownershipPct: Math.round(ownershipPct * 100) / 100,
      totalReturnedUSD: a.totalReturnedUSD,
      outstandingUSD,
      repaymentPct,
    };
  });
}

// ── Repayment Health ─────────────────────────────────────────

export function repaymentColor(pct: number): string {
  if (pct >= 90) return "#22c55e";
  if (pct >= 70) return "#eab308";
  return "#ef4444";
}

export function repaymentBadgeVariant(
  pct: number
): "default" | "secondary" | "destructive" {
  if (pct >= 90) return "default";
  if (pct >= 70) return "secondary";
  return "destructive";
}

// ── Projected Payback Date ───────────────────────────────────

export function computeProjectedPayback(
  totalRaised: number,
  totalReturned: number,
  totalRevenue: number,
  createdAt: string,
  vehicle?: SpvVehicle
): string | null {
  if (totalReturned >= totalRaised) return "Fully Repaid";
  const investorPct =
    vehicle?.waterfallFinancePct != null
      ? vehicle.waterfallFinancePct / 100
      : WATERFALL_INVESTOR_PCT;
  const investorPoolSoFar = totalRevenue * investorPct;
  if (investorPoolSoFar <= 0) return null;

  const created = new Date(createdAt);
  if (isNaN(created.getTime())) return null;

  const now = new Date();
  const monthsElapsed = Math.max(
    1,
    (now.getFullYear() - created.getFullYear()) * 12 +
      (now.getMonth() - created.getMonth())
  );

  const monthlyInvestorRev = investorPoolSoFar / monthsElapsed;
  if (monthlyInvestorRev <= 0) return null;

  const remaining = totalRaised - totalReturned;
  const monthsToRepay = Math.ceil(remaining / monthlyInvestorRev);

  const paybackDate = new Date(now);
  paybackDate.setMonth(paybackDate.getMonth() + monthsToRepay);
  if (isNaN(paybackDate.getTime())) return null;
  return paybackDate.toISOString();
}

// ── SPV Status Badge ─────────────────────────────────────────

export function spvStatusVariant(
  status: SpvVehicle["status"]
): "default" | "secondary" | "destructive" {
  switch (status) {
    case "active":
      return "default";
    case "raising":
      return "secondary";
    case "completed":
      return "default";
    case "closed":
      return "destructive";
  }
}

// ── Full SPV Metrics ─────────────────────────────────────────

export function computeSpvMetrics(
  vehicle: SpvVehicle,
  bikes: SpvBike[],
  batteries: SpvBattery[],
  swapBoxes: SpvSwapBox[],
  allocators: CapitalAllocator[]
): SpvComputedMetrics {
  const linkedBikes = bikes.filter((b) => vehicle.bikeIds.includes(b.id));
  const linkedBatteries = batteries.filter((b) =>
    vehicle.batteryIds.includes(b.id)
  );
  const linkedBoxes = swapBoxes.filter((b) =>
    vehicle.swapBoxIds.includes(b.id)
  );

  const totalRevenueUSD = computeSpvRevenue(
    vehicle,
    bikes,
    batteries,
    swapBoxes
  );
  const waterfall = computeWaterfall(totalRevenueUSD, vehicle);
  const investorReturns = computeInvestorReturns(
    allocators,
    vehicle.raisedAmountUSD
  );

  const totalReturned = allocators.reduce(
    (s, a) => s + a.totalReturnedUSD,
    0
  );
  const repaymentPct =
    vehicle.raisedAmountUSD > 0
      ? Math.round((totalReturned / vehicle.raisedAmountUSD) * 100)
      : 0;

  const projectedPaybackDate = computeProjectedPayback(
    vehicle.raisedAmountUSD,
    totalReturned,
    totalRevenueUSD,
    vehicle.createdAt,
    vehicle
  );

  return {
    totalAssets:
      linkedBikes.length + linkedBatteries.length + linkedBoxes.length,
    bikeCount: linkedBikes.length,
    batteryCount: linkedBatteries.length,
    swapBoxCount: linkedBoxes.length,
    totalRevenueUSD,
    waterfall,
    investorReturns,
    repaymentPct,
    projectedPaybackDate,
  };
}
