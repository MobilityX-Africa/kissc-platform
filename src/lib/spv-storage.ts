import type { SpvBike, SpvBattery, SpvSwapBox, SpvVehicle, CapitalAllocator } from "@/types/spv";

const KEYS = {
  bikes: "kissc-spv-bikes",
  batteries: "kissc-spv-batteries",
  swapBoxes: "kissc-spv-swap-boxes",
  vehicles: "kissc-spv-vehicles",
  allocators: "kissc-spv-allocators",
} as const;

// ── Generic helpers ──────────────────────────────────────────

function load<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function save<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

// ── Bikes ────────────────────────────────────────────────────

export function loadBikes(): SpvBike[] {
  return load<SpvBike>(KEYS.bikes);
}

export function saveBikes(bikes: SpvBike[]) {
  save(KEYS.bikes, bikes);
}

export function addBike(bike: SpvBike) {
  const bikes = loadBikes();
  bikes.push(bike);
  saveBikes(bikes);
  return bikes;
}

// ── Batteries ────────────────────────────────────────────────

export function loadBatteries(): SpvBattery[] {
  return load<SpvBattery>(KEYS.batteries);
}

export function saveBatteries(batteries: SpvBattery[]) {
  save(KEYS.batteries, batteries);
}

export function addBattery(battery: SpvBattery) {
  const batteries = loadBatteries();
  batteries.push(battery);
  saveBatteries(batteries);
  return batteries;
}

// ── Swap Boxes ───────────────────────────────────────────────

export function loadSwapBoxes(): SpvSwapBox[] {
  return load<SpvSwapBox>(KEYS.swapBoxes);
}

export function saveSwapBoxes(boxes: SpvSwapBox[]) {
  save(KEYS.swapBoxes, boxes);
}

export function addSwapBox(box: SpvSwapBox) {
  const boxes = loadSwapBoxes();
  boxes.push(box);
  saveSwapBoxes(boxes);
  return boxes;
}

// ── SPV Vehicles ─────────────────────────────────────────────

export function loadVehicles(): SpvVehicle[] {
  return load<SpvVehicle>(KEYS.vehicles);
}

export function saveVehicles(vehicles: SpvVehicle[]) {
  save(KEYS.vehicles, vehicles);
}

export function addVehicle(vehicle: SpvVehicle) {
  const vehicles = loadVehicles();
  vehicles.push(vehicle);
  saveVehicles(vehicles);
  return vehicles;
}

export function updateVehicle(updated: SpvVehicle) {
  const vehicles = loadVehicles();
  const idx = vehicles.findIndex((v) => v.id === updated.id);
  if (idx >= 0) vehicles[idx] = updated;
  saveVehicles(vehicles);
  return vehicles;
}

export function loadVehicleById(id: string): SpvVehicle | undefined {
  return loadVehicles().find((v) => v.id === id);
}

// ── Capital Allocators ───────────────────────────────────────

export function loadAllocators(): CapitalAllocator[] {
  return load<CapitalAllocator>(KEYS.allocators);
}

export function saveAllocators(allocators: CapitalAllocator[]) {
  save(KEYS.allocators, allocators);
}

export function addAllocator(allocator: CapitalAllocator) {
  const allocators = loadAllocators();
  allocators.push(allocator);
  saveAllocators(allocators);
  return allocators;
}

export function loadAllocatorsBySpv(spvId: string): CapitalAllocator[] {
  return loadAllocators().filter((a) => a.spvId === spvId);
}

// ── Seed data ────────────────────────────────────────────────

const SEED_BIKES: SpvBike[] = [
  {
    id: "SPV-BK-001",
    assetTag: "MX-EBK-2024-0001",
    model: "Spear Bodaboda EV-200",
    status: "active",
    frameNumber: "FR-SBE-24-00142",
    motorPowerW: 2000,
    batteryCapacityAh: 60,
    maxRangeKm: 80,
    assignedRider: "James Mwangi",
    kmPerDay: 45,
    kmPerWeek: 280,
    kmPerMonth: 1120,
    kmTotal: 8960,
    tripsPerDay: 12,
    tripsPerWeek: 72,
    tripsPerMonth: 288,
    tripsTotal: 2304,
    purchaseCostUSD: 1423,
    monthlyLeaseUSD: 96,
    totalPaidUSD: 769,
    outstandingUSD: 654,
    paymentsMade: 8,
    paymentsTotal: 18,
    revenueToDateUSD: 1206,
    createdAt: "2024-06-15T10:00:00Z",
  },
  {
    id: "SPV-BK-002",
    assetTag: "MX-EBK-2024-0002",
    model: "Spear Bodaboda EV-200",
    status: "active",
    frameNumber: "FR-SBE-24-00287",
    motorPowerW: 2000,
    batteryCapacityAh: 60,
    maxRangeKm: 80,
    assignedRider: "Grace Wanjiku",
    kmPerDay: 52,
    kmPerWeek: 320,
    kmPerMonth: 1280,
    kmTotal: 10240,
    tripsPerDay: 15,
    tripsPerWeek: 90,
    tripsPerMonth: 360,
    tripsTotal: 2880,
    purchaseCostUSD: 1423,
    monthlyLeaseUSD: 96,
    totalPaidUSD: 962,
    outstandingUSD: 462,
    paymentsMade: 10,
    paymentsTotal: 18,
    revenueToDateUSD: 1477,
    createdAt: "2024-04-20T10:00:00Z",
  },
  {
    id: "SPV-BK-003",
    assetTag: "MX-EBK-2024-0003",
    model: "Roam Air",
    status: "maintenance",
    frameNumber: "FR-RA-24-00089",
    motorPowerW: 3000,
    batteryCapacityAh: 72,
    maxRangeKm: 100,
    assignedRider: "Peter Ochieng",
    kmPerDay: 0,
    kmPerWeek: 0,
    kmPerMonth: 420,
    kmTotal: 6300,
    tripsPerDay: 0,
    tripsPerWeek: 0,
    tripsPerMonth: 112,
    tripsTotal: 1680,
    purchaseCostUSD: 1885,
    monthlyLeaseUSD: 123,
    totalPaidUSD: 492,
    outstandingUSD: 1392,
    paymentsMade: 4,
    paymentsTotal: 18,
    revenueToDateUSD: 678,
    createdAt: "2024-09-01T10:00:00Z",
  },
];

const SEED_BATTERIES: SpvBattery[] = [
  {
    id: "SPV-BAT-001",
    serialNumber: "KSC-BAT-2024-1001",
    model: "LFP-60Ah-48V",
    status: "active",
    capacityKwh: 2.88,
    nominalVoltage: 48,
    chemistry: "LiFePO4",
    maxCycles: 2000,
    currentSoH: 94,
    cyclesUsed: 320,
    swapsPerDay: 3,
    swapsPerWeek: 18,
    swapsPerMonth: 72,
    swapsTotal: 640,
    lastSwapDate: "2025-02-09T08:30:00Z",
    currentLocation: "Westlands Hub",
    purchaseCostUSD: 323,
    revenuePerSwapUSD: 0.92,
    totalRevenueUSD: 591,
    maintenanceCostUSD: 25,
    breakEvenSwaps: 350,
    createdAt: "2024-05-10T10:00:00Z",
  },
  {
    id: "SPV-BAT-002",
    serialNumber: "KSC-BAT-2024-1002",
    model: "LFP-60Ah-48V",
    status: "active",
    capacityKwh: 2.88,
    nominalVoltage: 48,
    chemistry: "LiFePO4",
    maxCycles: 2000,
    currentSoH: 88,
    cyclesUsed: 580,
    swapsPerDay: 4,
    swapsPerWeek: 24,
    swapsPerMonth: 96,
    swapsTotal: 1120,
    lastSwapDate: "2025-02-09T09:15:00Z",
    currentLocation: "CBD Central",
    purchaseCostUSD: 323,
    revenuePerSwapUSD: 0.92,
    totalRevenueUSD: 1034,
    maintenanceCostUSD: 52,
    breakEvenSwaps: 350,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "SPV-BAT-003",
    serialNumber: "KSC-BAT-2024-1003",
    model: "NMC-72Ah-48V",
    status: "inactive",
    capacityKwh: 3.46,
    nominalVoltage: 48,
    chemistry: "NMC",
    maxCycles: 1500,
    currentSoH: 72,
    cyclesUsed: 1050,
    swapsPerDay: 0,
    swapsPerWeek: 0,
    swapsPerMonth: 0,
    swapsTotal: 1890,
    lastSwapDate: "2025-01-20T14:00:00Z",
    currentLocation: "Warehouse - Ruiru",
    purchaseCostUSD: 423,
    revenuePerSwapUSD: 0.92,
    totalRevenueUSD: 1745,
    maintenanceCostUSD: 96,
    breakEvenSwaps: 458,
    createdAt: "2023-11-01T10:00:00Z",
  },
];

const SEED_SWAP_BOXES: SpvSwapBox[] = [
  {
    id: "SPV-SB-001",
    stationId: "SS-001",
    name: "Westlands Hub",
    status: "active",
    totalSlots: 12,
    solarCapacityW: 2000,
    gridConnected: true,
    location: "Westlands, Nairobi",
    latitude: -1.2635,
    longitude: 36.8029,
    swapsPerDay: 48,
    swapsPerWeek: 312,
    swapsPerMonth: 1248,
    swapsTotal: 11232,
    avgSlotUtilization: 78,
    operationalDays: 270,
    installCostUSD: 6538,
    monthlyOpexUSD: 269,
    revenuePerSwapUSD: 0.92,
    totalRevenueUSD: 10368,
    totalCostUSD: 9192,
    paybackProgressPct: 88,
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "SPV-SB-002",
    stationId: "SS-005",
    name: "CBD Central",
    status: "active",
    totalSlots: 16,
    solarCapacityW: 3000,
    gridConnected: true,
    location: "CBD, Nairobi",
    latitude: -1.2833,
    longitude: 36.8172,
    swapsPerDay: 62,
    swapsPerWeek: 400,
    swapsPerMonth: 1600,
    swapsTotal: 14400,
    avgSlotUtilization: 84,
    operationalDays: 300,
    installCostUSD: 8462,
    monthlyOpexUSD: 323,
    revenuePerSwapUSD: 0.92,
    totalRevenueUSD: 13292,
    totalCostUSD: 11692,
    paybackProgressPct: 95,
    createdAt: "2024-01-10T10:00:00Z",
  },
];

const SEED_VEHICLES: SpvVehicle[] = [
  {
    id: "SPV-VH-001",
    name: "Nairobi 1 EV Fleet SPV",
    city: "Nairobi",
    country: "KEN",
    status: "active",
    targetAmountUSD: 15385,
    raisedAmountUSD: 13846,
    createdAt: "2024-03-01T10:00:00Z",
    // Asset types
    includesBikes: true,
    includesBatteries: true,
    includesSwapStations: true,
    // Unit economics
    bikePriceUSD: 1423,
    batteryPriceUSD: 323,
    swapStationPriceUSD: 6538,
    // Insurance
    insuranceCostPerBatteryUSD: 2.50,
    insuranceCostPerStationUSD: 25.00,
    // Replacement
    batteryReplacementCostUSD: 120.00,
    // Waterfall
    waterfallFinancePct: 70.0,
    waterfallOperatorPct: 20.0,
    waterfallMobilityxPct: 10.0,
    // Operator
    localOperatorName: "Guardian Mobility Kenya",
    // Financing
    monthsToPayback: 36,
    interestRatePct: 8.5,
    interestCoverageRatio: 1.75,
    // Dates
    inceptionDate: "2024-03-01",
    maturityDate: "2027-03-01",
    // Deployment
    bikesDeployed: 2,
    batteriesDeployed: 2,
    stationsDeployed: 1,
    // Performance
    totalRevenueCollectedUSD: 12165,
    currentIcr: 1.82,
    // Investors
    investorsJson: JSON.stringify([
      { name: "Amani Capital Partners", commitmentUSD: 7692, equityPct: 55.56, investorType: "DFI" },
      { name: "Green Mobility Fund", commitmentUSD: 3846, equityPct: 27.78, investorType: "Private Equity" },
      { name: "Wanjiku Angel Investor", commitmentUSD: 2308, equityPct: 16.67, investorType: "Angel" },
    ]),
    // Linked assets
    bikeIds: ["SPV-BK-001", "SPV-BK-002"],
    batteryIds: ["SPV-BAT-001", "SPV-BAT-002"],
    swapBoxIds: ["SPV-SB-001"],
  },
  {
    id: "SPV-VH-002",
    name: "Nairobi 2 Infrastructure SPV",
    city: "Nairobi",
    country: "KEN",
    status: "raising",
    targetAmountUSD: 23077,
    raisedAmountUSD: 9231,
    createdAt: "2024-08-15T10:00:00Z",
    // Asset types
    includesBikes: true,
    includesBatteries: true,
    includesSwapStations: true,
    // Unit economics
    bikePriceUSD: 1885,
    batteryPriceUSD: 423,
    swapStationPriceUSD: 8462,
    // Insurance
    insuranceCostPerBatteryUSD: 3.00,
    insuranceCostPerStationUSD: 30.00,
    // Replacement
    batteryReplacementCostUSD: 150.00,
    // Waterfall
    waterfallFinancePct: 65.0,
    waterfallOperatorPct: 30.0,
    waterfallMobilityxPct: 5.0,
    // Operator
    localOperatorName: "EcoRide Nairobi Ltd",
    // Financing
    monthsToPayback: 48,
    interestRatePct: 9.0,
    interestCoverageRatio: 1.5,
    // Dates
    inceptionDate: "2024-08-15",
    maturityDate: "2028-08-15",
    // Deployment
    bikesDeployed: 1,
    batteriesDeployed: 1,
    stationsDeployed: 1,
    // Performance
    totalRevenueCollectedUSD: 15715,
    currentIcr: 1.45,
    // Investors
    investorsJson: JSON.stringify([
      { name: "Impact Africa Ventures", commitmentUSD: 6154, equityPct: 66.67, investorType: "Corporate VC" },
      { name: "Ochieng Family Office", commitmentUSD: 3077, equityPct: 33.33, investorType: "Family Office" },
    ]),
    // Linked assets
    bikeIds: ["SPV-BK-003"],
    batteryIds: ["SPV-BAT-003"],
    swapBoxIds: ["SPV-SB-002"],
  },
];

const SEED_ALLOCATORS: CapitalAllocator[] = [
  {
    id: "CA-001",
    spvId: "SPV-VH-001",
    name: "Amani Capital Partners",
    email: "invest@amanicapital.co.ke",
    investedAmountUSD: 7692,
    ownershipPct: 55.56,
    totalReturnedUSD: 3231,
    createdAt: "2024-03-05T10:00:00Z",
  },
  {
    id: "CA-002",
    spvId: "SPV-VH-001",
    name: "Green Mobility Fund",
    email: "admin@greenmobility.fund",
    investedAmountUSD: 3846,
    ownershipPct: 27.78,
    totalReturnedUSD: 1615,
    createdAt: "2024-03-10T10:00:00Z",
  },
  {
    id: "CA-003",
    spvId: "SPV-VH-001",
    name: "Wanjiku Angel Investor",
    email: "wanjiku@gmail.com",
    investedAmountUSD: 2308,
    ownershipPct: 16.67,
    totalReturnedUSD: 969,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "CA-004",
    spvId: "SPV-VH-002",
    name: "Impact Africa Ventures",
    email: "deals@impactafrica.vc",
    investedAmountUSD: 6154,
    ownershipPct: 66.67,
    totalReturnedUSD: 654,
    createdAt: "2024-09-01T10:00:00Z",
  },
  {
    id: "CA-005",
    spvId: "SPV-VH-002",
    name: "Ochieng Family Office",
    email: "peter.o@familyoffice.co.ke",
    investedAmountUSD: 3077,
    ownershipPct: 33.33,
    totalReturnedUSD: 327,
    createdAt: "2024-09-05T10:00:00Z",
  },
];

export function seedIfEmpty() {
  if (loadBikes().length === 0) saveBikes(SEED_BIKES);
  if (loadBatteries().length === 0) saveBatteries(SEED_BATTERIES);
  if (loadSwapBoxes().length === 0) saveSwapBoxes(SEED_SWAP_BOXES);
  if (loadVehicles().length === 0) saveVehicles(SEED_VEHICLES);
  if (loadAllocators().length === 0) saveAllocators(SEED_ALLOCATORS);
}
