import type {
  TimePeriod,
  SpvBike,
  SpvBattery,
  SpvSwapBox,
  DashboardMetrics,
  SpvRepaymentSummary,
  SpvRepaymentItem,
  TimeSeriesPoint,
} from "@/types/spv";
import {
  loadBikes,
  loadBatteries,
  loadSwapBoxes,
  seedIfEmpty,
} from "@/lib/spv-storage";

// ── Color helpers ────────────────────────────────────────────

function repaymentColor(ratio: number): string {
  if (ratio >= 0.9) return "#22c55e"; // green-500
  if (ratio >= 0.7) return "#eab308"; // yellow-500
  return "#ef4444"; // red-500
}

// ── Period config ────────────────────────────────────────────

interface PeriodConfig {
  monthProportion: number; // fraction of a month
  seriesLength: number; // chart data points
}

function getPeriodConfig(period: TimePeriod): PeriodConfig {
  switch (period) {
    case "daily":
      return { monthProportion: 1 / 30, seriesLength: 30 };
    case "weekly":
      return { monthProportion: 7 / 30, seriesLength: 12 };
    case "monthly":
      return { monthProportion: 1, seriesLength: 12 };
    case "yearly":
      return { monthProportion: 12, seriesLength: 5 };
    case "all":
      return { monthProportion: 1, seriesLength: 12 };
  }
}

// ── Active Riders ────────────────────────────────────────────

function computeActiveRiders(bikes: SpvBike[]): number {
  return bikes.filter(
    (b) => b.status === "active" && b.assignedRider && b.assignedRider !== "Unassigned"
  ).length;
}

// ── Total Swaps ──────────────────────────────────────────────

function getSwaps(
  batteries: SpvBattery[],
  swapBoxes: SpvSwapBox[],
  period: TimePeriod
): number {
  // Use swap box data as the primary swap counter (station-level throughput)
  // to avoid double-counting with battery-level swaps.
  let total = 0;

  for (const box of swapBoxes) {
    switch (period) {
      case "daily":
        total += box.swapsPerDay;
        break;
      case "weekly":
        total += box.swapsPerWeek;
        break;
      case "monthly":
        total += box.swapsPerMonth;
        break;
      case "yearly":
        total += box.swapsPerMonth * 12;
        break;
      case "all":
        total += box.swapsTotal;
        break;
    }
  }

  // If no swap boxes, fall back to battery-level data
  if (swapBoxes.length === 0) {
    for (const bat of batteries) {
      switch (period) {
        case "daily":
          total += bat.swapsPerDay;
          break;
        case "weekly":
          total += bat.swapsPerWeek;
          break;
        case "monthly":
          total += bat.swapsPerMonth;
          break;
        case "yearly":
          total += bat.swapsPerMonth * 12;
          break;
        case "all":
          total += bat.swapsTotal;
          break;
      }
    }
  }

  return total;
}

// ── Total Revenue ────────────────────────────────────────────

function computeTotalRevenue(
  bikes: SpvBike[],
  batteries: SpvBattery[],
  swapBoxes: SpvSwapBox[],
  period: TimePeriod
): number {
  if (period === "all") {
    const bikeRev = bikes.reduce((s, b) => s + b.revenueToDateUSD, 0);
    const batRev = batteries.reduce((s, b) => s + b.totalRevenueUSD, 0);
    const boxRev = swapBoxes.reduce((s, b) => s + b.totalRevenueUSD, 0);
    return bikeRev + batRev + boxRev;
  }

  const { monthProportion } = getPeriodConfig(period);

  // Bike SPV: monthly lease payments
  const bikeMonthly = bikes
    .filter((b) => b.status === "active")
    .reduce((s, b) => s + b.monthlyLeaseUSD, 0);

  // Battery SPV: swaps × price per month
  const batMonthly = batteries
    .filter((b) => b.status === "active")
    .reduce((s, b) => s + b.swapsPerMonth * b.revenuePerSwapUSD, 0);

  // Swap Box SPV: swaps × price per month
  const boxMonthly = swapBoxes
    .filter((b) => b.status === "active")
    .reduce((s, b) => s + b.swapsPerMonth * b.revenuePerSwapUSD, 0);

  return Math.round((bikeMonthly + batMonthly + boxMonthly) * monthProportion);
}

// ── SPV Repayment ────────────────────────────────────────────

function monthsSince(dateStr: string): number {
  const created = new Date(dateStr);
  const now = new Date();
  const diff =
    (now.getFullYear() - created.getFullYear()) * 12 +
    (now.getMonth() - created.getMonth());
  return Math.max(1, diff);
}

function computeRepayment(
  bikes: SpvBike[],
  batteries: SpvBattery[],
  swapBoxes: SpvSwapBox[],
  period: TimePeriod
): SpvRepaymentSummary {
  const { monthProportion } = getPeriodConfig(period);

  // ── Bike SPV ──
  const activeBikes = bikes.filter((b) => b.status === "active");
  const bikeExpected =
    activeBikes.reduce((s, b) => s + b.monthlyLeaseUSD, 0) * monthProportion;

  // Compliance: avg of (totalPaidUSD / expected total paid so far)
  let bikeActual = 0;
  if (activeBikes.length > 0 && bikeExpected > 0) {
    const avgCompliance =
      activeBikes.reduce((s, b) => {
        const expectedPaid = b.paymentsMade * b.monthlyLeaseUSD;
        return s + (expectedPaid > 0 ? b.totalPaidUSD / expectedPaid : 1);
      }, 0) / activeBikes.length;
    bikeActual = Math.round(bikeExpected * Math.min(1, avgCompliance));
  }

  const bikeRatio = bikeExpected > 0 ? bikeActual / bikeExpected : 0;

  // ── Battery SPV ──
  // Expected: target monthly revenue based on break-even schedule (18-month target)
  const batExpected = batteries.reduce((s, b) => {
    const targetMonthlyRev = (b.breakEvenSwaps * b.revenuePerSwapUSD) / 18;
    return s + targetMonthlyRev;
  }, 0) * monthProportion;

  // Actual: prorated from totalRevenueUSD over months active
  const batActual = batteries.reduce((s, b) => {
    const months = monthsSince(b.createdAt);
    const monthlyActual = b.totalRevenueUSD / months;
    return s + monthlyActual;
  }, 0) * monthProportion;

  const batRatio = batExpected > 0 ? Math.min(1.5, batActual / batExpected) : 0;

  // ── Swap Box SPV ──
  // Expected: slots × 4 swaps/day target × 30 days × swap price
  const boxExpected = swapBoxes.reduce((s, b) => {
    const targetMonthlyRev = b.totalSlots * 4 * 30 * b.revenuePerSwapUSD;
    return s + targetMonthlyRev;
  }, 0) * monthProportion;

  // Actual: prorated from totalRevenueUSD
  const boxActual = swapBoxes.reduce((s, b) => {
    const months = monthsSince(b.createdAt);
    const monthlyActual = b.totalRevenueUSD / months;
    return s + monthlyActual;
  }, 0) * monthProportion;

  const boxRatio = boxExpected > 0 ? Math.min(1.5, boxActual / boxExpected) : 0;

  // ── Aggregate ──
  const items: SpvRepaymentItem[] = [
    {
      name: "Bike SPV",
      expected: Math.round(bikeExpected),
      actual: Math.round(bikeActual),
      ratio: bikeRatio,
      color: repaymentColor(bikeRatio),
    },
    {
      name: "Battery SPV",
      expected: Math.round(batExpected),
      actual: Math.round(batActual),
      ratio: batRatio,
      color: repaymentColor(batRatio),
    },
    {
      name: "Swap Box SPV",
      expected: Math.round(boxExpected),
      actual: Math.round(boxActual),
      ratio: boxRatio,
      color: repaymentColor(boxRatio),
    },
  ];

  const totalExpected = items.reduce((s, i) => s + i.expected, 0);
  const totalActual = items.reduce((s, i) => s + i.actual, 0);
  const overallRatio = totalExpected > 0 ? totalActual / totalExpected : 0;

  return {
    items,
    totalExpected,
    totalActual,
    overallRatio: Math.min(1.5, overallRatio),
    overallColor: repaymentColor(overallRatio),
  };
}

// ── Synthetic Time Series ────────────────────────────────────

function generateTimeSeries(
  bikes: SpvBike[],
  batteries: SpvBattery[],
  swapBoxes: SpvSwapBox[],
  period: TimePeriod
): TimeSeriesPoint[] {
  const { seriesLength, monthProportion } = getPeriodConfig(period);
  const now = new Date();

  // Current monthly revenue (for scaling)
  const bikeMonthly = bikes
    .filter((b) => b.status === "active")
    .reduce((s, b) => s + b.monthlyLeaseUSD, 0);
  const batMonthly = batteries
    .filter((b) => b.status === "active")
    .reduce((s, b) => s + b.swapsPerMonth * b.revenuePerSwapUSD, 0);
  const boxMonthly = swapBoxes
    .filter((b) => b.status === "active")
    .reduce((s, b) => s + b.swapsPerMonth * b.revenuePerSwapUSD, 0);
  const currentMonthlyRevenue = bikeMonthly + batMonthly + boxMonthly;

  const totalBatteries = batteries.length;
  const totalStations = swapBoxes.length;

  // Collect all createdAt dates
  const allDates = [
    ...batteries.map((b) => new Date(b.createdAt)),
    ...swapBoxes.map((b) => new Date(b.createdAt)),
    ...bikes.map((b) => new Date(b.createdAt)),
  ];

  const points: TimeSeriesPoint[] = [];

  for (let i = seriesLength - 1; i >= 0; i--) {
    const pointDate = new Date(now);
    let label: string;

    switch (period) {
      case "daily":
        pointDate.setDate(now.getDate() - i);
        label = pointDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        break;
      case "weekly":
        pointDate.setDate(now.getDate() - i * 7);
        label = `W${seriesLength - i}`;
        break;
      case "monthly":
      case "all":
        pointDate.setMonth(now.getMonth() - i);
        label = pointDate.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        break;
      case "yearly":
        pointDate.setFullYear(now.getFullYear() - i);
        label = String(pointDate.getFullYear());
        break;
    }

    // Count assets deployed by this point
    const batCount = allDates.length > 0
      ? batteries.filter((b) => new Date(b.createdAt) <= pointDate).length
      : Math.round((totalBatteries * (seriesLength - i)) / seriesLength);

    const stationCount = allDates.length > 0
      ? swapBoxes.filter((b) => new Date(b.createdAt) <= pointDate).length
      : Math.round((totalStations * (seriesLength - i)) / seriesLength);

    // Revenue proportional to deployed assets
    const totalAssets = totalBatteries + totalStations;
    const deployedAssets = batCount + stationCount;
    const assetFraction = totalAssets > 0 ? deployedAssets / totalAssets : 0;

    // Revenue for this period point with slight jitter
    const jitter = 0.95 + Math.random() * 0.1; // 0.95 to 1.05
    const revenue = Math.round(
      currentMonthlyRevenue * monthProportion * assetFraction * jitter
    );

    points.push({
      label,
      revenue: Math.max(0, revenue),
      batteryCount: batCount,
      stationCount: stationCount,
    });
  }

  return points;
}

// ── Main Entry Point ─────────────────────────────────────────

export function computeDashboardMetrics(period: TimePeriod): DashboardMetrics {
  seedIfEmpty();

  const bikes = loadBikes();
  const batteries = loadBatteries();
  const swapBoxes = loadSwapBoxes();

  return {
    activeRiders: computeActiveRiders(bikes),
    totalSwaps: getSwaps(batteries, swapBoxes, period),
    totalRevenue: computeTotalRevenue(bikes, batteries, swapBoxes, period),
    repayment: computeRepayment(bikes, batteries, swapBoxes, period),
    timeSeries: generateTimeSeries(bikes, batteries, swapBoxes, period),
    lastUpdated: new Date(),
  };
}
