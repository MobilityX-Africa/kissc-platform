export type TimePeriod = "daily" | "weekly" | "monthly" | "yearly" | "all";

export type AssetStatus = "active" | "inactive" | "maintenance";

// ---------- Electric Bikes (Green / MFI-financed) ----------
export interface SpvBike {
  id: string;
  assetTag: string;
  model: string;
  status: AssetStatus;
  // Technical
  frameNumber: string;
  motorPowerW: number;
  batteryCapacityAh: number;
  maxRangeKm: number;
  // Utilization
  assignedRider: string;
  kmPerDay: number;
  kmPerWeek: number;
  kmPerMonth: number;
  kmTotal: number;
  tripsPerDay: number;
  tripsPerWeek: number;
  tripsPerMonth: number;
  tripsTotal: number;
  // Financial
  purchaseCostUSD: number;
  monthlyLeaseUSD: number;
  totalPaidUSD: number;
  outstandingUSD: number;
  paymentsMade: number;
  paymentsTotal: number;
  revenueToDateUSD: number;
  createdAt: string;
}

// ---------- Batteries (Blue / Energy infrastructure) ----------
export interface SpvBattery {
  id: string;
  serialNumber: string;
  model: string;
  status: AssetStatus;
  // Technical
  capacityKwh: number;
  nominalVoltage: number;
  chemistry: string;
  maxCycles: number;
  currentSoH: number;
  // Utilization
  cyclesUsed: number;
  swapsPerDay: number;
  swapsPerWeek: number;
  swapsPerMonth: number;
  swapsTotal: number;
  lastSwapDate: string;
  currentLocation: string;
  // Financial
  purchaseCostUSD: number;
  revenuePerSwapUSD: number;
  totalRevenueUSD: number;
  maintenanceCostUSD: number;
  breakEvenSwaps: number;
  createdAt: string;
}

// ---------- Swap Boxes (Orange / Infrastructure SPV) ----------
export interface SpvSwapBox {
  id: string;
  stationId: string;
  name: string;
  status: AssetStatus;
  // Technical
  totalSlots: number;
  solarCapacityW: number;
  gridConnected: boolean;
  location: string;
  latitude: number;
  longitude: number;
  // Utilization
  swapsPerDay: number;
  swapsPerWeek: number;
  swapsPerMonth: number;
  swapsTotal: number;
  avgSlotUtilization: number;
  operationalDays: number;
  // Financial
  installCostUSD: number;
  monthlyOpexUSD: number;
  revenuePerSwapUSD: number;
  totalRevenueUSD: number;
  totalCostUSD: number;
  paybackProgressPct: number;
  createdAt: string;
}

// ---------- Form field config ----------
export interface SpvFormField {
  name: string;
  label: string;
  type: "text" | "number" | "select";
  section: "technical" | "utilization" | "financial";
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
}

// ---------- Card display config ----------
export interface SpvCardItem {
  label: string;
  value: string | number;
  suffix?: string;
  highlight?: boolean;
}

// ---------- Dashboard Analytics ----------

export interface TimeSeriesPoint {
  label: string;
  revenue: number;
  batteryCount: number;
  stationCount: number;
}

export interface SpvRepaymentItem {
  name: string;
  expected: number;
  actual: number;
  ratio: number;
  color: string;
}

export interface SpvRepaymentSummary {
  items: SpvRepaymentItem[];
  totalExpected: number;
  totalActual: number;
  overallRatio: number;
  overallColor: string;
}

export interface DashboardMetrics {
  activeRiders: number;
  totalSwaps: number;
  totalRevenue: number;
  repayment: SpvRepaymentSummary;
  timeSeries: TimeSeriesPoint[];
  lastUpdated: Date;
}

// ---------- SPV Vehicle (Entity Container) ----------

export type SpvStatus = "raising" | "active" | "completed" | "closed";

export interface InvestorInfo {
  name: string;
  commitmentUSD: number;
  equityPct?: number;
  investorType: string;
}

export interface WaterfallSplitConfig {
  financePct: number;
  operatorPct: number;
  mobilityxPct: number;
}

export interface SpvVehicle {
  id: string;
  name: string;
  city: string;
  country: string;
  status: SpvStatus;
  targetAmountUSD: number;
  raisedAmountUSD: number;
  createdAt: string;

  // Asset type flags
  includesBikes: boolean;
  includesBatteries: boolean;
  includesSwapStations: boolean;

  // Unit economics (USD per unit)
  bikePriceUSD?: number;
  batteryPriceUSD?: number;
  swapStationPriceUSD?: number;

  // Insurance costs (monthly per unit)
  insuranceCostPerBatteryUSD?: number;
  insuranceCostPerStationUSD?: number;

  // Replacement costs
  batteryReplacementCostUSD?: number;

  // Waterfall split (must sum to 100)
  waterfallFinancePct: number;
  waterfallOperatorPct: number;
  waterfallMobilityxPct: number;

  // Local operator
  localOperatorName: string;

  // Financing structure
  monthsToPayback: number;
  interestRatePct: number;
  interestCoverageRatio: number;

  // Dates
  inceptionDate: string;
  maturityDate: string;

  // Deployment tracking
  bikesDeployed: number;
  batteriesDeployed: number;
  stationsDeployed: number;

  // Financial performance
  totalRevenueCollectedUSD: number;
  currentIcr?: number;

  // Investors (JSON string or parsed array)
  investorsJson: string;

  // Linked asset IDs
  bikeIds: string[];
  batteryIds: string[];
  swapBoxIds: string[];
}

// ---------- Capital Allocator (Investor) ----------

export interface CapitalAllocator {
  id: string;
  spvId: string;
  name: string;
  email: string;
  investedAmountUSD: number;
  ownershipPct: number;
  totalReturnedUSD: number;
  createdAt: string;
}

// ---------- Revenue Waterfall Split ----------

export interface WaterfallSplit {
  investorPoolUSD: number;
  operatorPoolUSD: number;
  platformPoolUSD: number;
  totalRevenueUSD: number;
}

// ---------- Per-Investor Return ----------

export interface InvestorReturn {
  allocatorId: string;
  name: string;
  investedAmountUSD: number;
  ownershipPct: number;
  totalReturnedUSD: number;
  outstandingUSD: number;
  repaymentPct: number;
}

// ---------- SPV Computed Metrics ----------

export interface SpvComputedMetrics {
  totalAssets: number;
  bikeCount: number;
  batteryCount: number;
  swapBoxCount: number;
  totalRevenueUSD: number;
  waterfall: WaterfallSplit;
  investorReturns: InvestorReturn[];
  repaymentPct: number;
  projectedPaybackDate: string | null;
}
