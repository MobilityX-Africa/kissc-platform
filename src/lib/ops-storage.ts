import type { Bike, Battery, SwapStation, Rider } from "@/types";

const KEYS = {
  bikes: "kissc-ops-bikes",
  batteries: "kissc-ops-batteries",
  swapStations: "kissc-ops-swap-stations",
  riders: "kissc-ops-riders",
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

export function loadOpsBikes(): Bike[] {
  return load<Bike>(KEYS.bikes);
}

export function saveOpsBikes(bikes: Bike[]) {
  save(KEYS.bikes, bikes);
}

export function addOpsBike(bike: Bike): Bike[] {
  const bikes = loadOpsBikes();
  bikes.push(bike);
  saveOpsBikes(bikes);
  return bikes;
}

// ── Batteries ────────────────────────────────────────────────

export function loadOpsBatteries(): Battery[] {
  return load<Battery>(KEYS.batteries);
}

export function saveOpsBatteries(batteries: Battery[]) {
  save(KEYS.batteries, batteries);
}

export function addOpsBattery(battery: Battery): Battery[] {
  const batteries = loadOpsBatteries();
  batteries.push(battery);
  saveOpsBatteries(batteries);
  return batteries;
}

// ── Swap Stations ────────────────────────────────────────────

export function loadOpsSwapStations(): SwapStation[] {
  return load<SwapStation>(KEYS.swapStations);
}

export function saveOpsSwapStations(stations: SwapStation[]) {
  save(KEYS.swapStations, stations);
}

export function addOpsSwapStation(station: SwapStation): SwapStation[] {
  const stations = loadOpsSwapStations();
  stations.push(station);
  saveOpsSwapStations(stations);
  return stations;
}

// ── Riders ───────────────────────────────────────────────────

export function loadOpsRiders(): Rider[] {
  return load<Rider>(KEYS.riders);
}

export function saveOpsRiders(riders: Rider[]) {
  save(KEYS.riders, riders);
}

export function addOpsRider(rider: Rider): Rider[] {
  const riders = loadOpsRiders();
  riders.push(rider);
  saveOpsRiders(riders);
  return riders;
}

// ── Seed data ────────────────────────────────────────────────

const SEED_BIKES: Bike[] = [
  { id: "OPS-BK-001", registrationNumber: "KMFX 123A", model: "Spiro Gen3", status: "in-use", currentRiderId: "OPS-RD-001", currentBatteryId: "OPS-BAT-001", totalKm: 12450, lastServiceDate: "2025-01-10" },
  { id: "OPS-BK-002", registrationNumber: "KMFX 456B", model: "Spiro Gen3", status: "available", currentRiderId: null, currentBatteryId: "OPS-BAT-002", totalKm: 8920, lastServiceDate: "2025-01-15" },
  { id: "OPS-BK-003", registrationNumber: "KMFX 789C", model: "Roam Air", status: "maintenance", currentRiderId: null, currentBatteryId: null, totalKm: 21300, lastServiceDate: "2024-12-20" },
  { id: "OPS-BK-004", registrationNumber: "KMFX 012D", model: "Roam Air", status: "in-use", currentRiderId: "OPS-RD-004", currentBatteryId: "OPS-BAT-003", totalKm: 15780, lastServiceDate: "2025-01-08" },
  { id: "OPS-BK-005", registrationNumber: "KMFX 345E", model: "Spiro Gen2", status: "retired", currentRiderId: null, currentBatteryId: null, totalKm: 45200, lastServiceDate: "2024-11-30" },
  { id: "OPS-BK-006", registrationNumber: "KMFX 678F", model: "Spear EV-200", status: "in-use", currentRiderId: "OPS-RD-002", currentBatteryId: "OPS-BAT-004", totalKm: 9340, lastServiceDate: "2025-02-01" },
  { id: "OPS-BK-007", registrationNumber: "KMFX 901G", model: "Spiro Gen3", status: "available", currentRiderId: null, currentBatteryId: "OPS-BAT-005", totalKm: 3200, lastServiceDate: "2025-01-28" },
  { id: "OPS-BK-008", registrationNumber: "KMFX 234H", model: "Roam Air", status: "in-use", currentRiderId: "OPS-RD-005", currentBatteryId: "OPS-BAT-006", totalKm: 18950, lastServiceDate: "2025-01-20" },
];

const SEED_BATTERIES: Battery[] = [
  { id: "OPS-BAT-001", serialNumber: "KSC-BAT-2024-0042", capacityKwh: 2.4, stateOfHealth: 94, currentCharge: 78, status: "in-use", cycleCount: 245, currentLocation: "Bike KMFX 123A" },
  { id: "OPS-BAT-002", serialNumber: "KSC-BAT-2024-0087", capacityKwh: 2.4, stateOfHealth: 88, currentCharge: 100, status: "available", cycleCount: 412, currentLocation: "Westlands Hub" },
  { id: "OPS-BAT-003", serialNumber: "KSC-BAT-2024-0103", capacityKwh: 3.0, stateOfHealth: 97, currentCharge: 45, status: "in-use", cycleCount: 89, currentLocation: "Bike KMFX 012D" },
  { id: "OPS-BAT-004", serialNumber: "KSC-BAT-2024-0156", capacityKwh: 2.4, stateOfHealth: 72, currentCharge: 62, status: "charging", cycleCount: 678, currentLocation: "CBD Central" },
  { id: "OPS-BAT-005", serialNumber: "KSC-BAT-2023-0201", capacityKwh: 2.0, stateOfHealth: 45, currentCharge: 0, status: "retired", cycleCount: 1200, currentLocation: "Warehouse" },
  { id: "OPS-BAT-006", serialNumber: "KSC-BAT-2024-0278", capacityKwh: 3.0, stateOfHealth: 91, currentCharge: 33, status: "in-use", cycleCount: 156, currentLocation: "Bike KMFX 234H" },
  { id: "OPS-BAT-007", serialNumber: "KSC-BAT-2024-0312", capacityKwh: 2.4, stateOfHealth: 85, currentCharge: 100, status: "available", cycleCount: 502, currentLocation: "Kilimani Point" },
  { id: "OPS-BAT-008", serialNumber: "KSC-BAT-2024-0345", capacityKwh: 2.4, stateOfHealth: 80, currentCharge: 15, status: "charging", cycleCount: 610, currentLocation: "Westlands Hub" },
];

const SEED_SWAP_STATIONS: SwapStation[] = [
  { id: "OPS-SS-001", name: "Westlands Hub", location: { address: "Westlands Rd, Nairobi", lat: -1.2673, lng: 36.8112 }, totalSlots: 20, availableBatteries: 12, chargingBatteries: 5, emptySlots: 3, status: "online", operatingHours: "06:00 - 22:00" },
  { id: "OPS-SS-002", name: "CBD Central", location: { address: "Kenyatta Ave, Nairobi", lat: -1.2864, lng: 36.8172 }, totalSlots: 30, availableBatteries: 18, chargingBatteries: 8, emptySlots: 4, status: "online", operatingHours: "05:00 - 23:00" },
  { id: "OPS-SS-003", name: "Kilimani Point", location: { address: "Argwings Kodhek Rd, Nairobi", lat: -1.2923, lng: 36.7852 }, totalSlots: 15, availableBatteries: 2, chargingBatteries: 10, emptySlots: 3, status: "online", operatingHours: "06:00 - 21:00" },
  { id: "OPS-SS-004", name: "Eastleigh Depot", location: { address: "1st Avenue, Eastleigh", lat: -1.2741, lng: 36.8456 }, totalSlots: 12, availableBatteries: 0, chargingBatteries: 0, emptySlots: 12, status: "offline", operatingHours: "06:00 - 20:00" },
  { id: "OPS-SS-005", name: "Karen Gateway", location: { address: "Karen Rd, Nairobi", lat: -1.3197, lng: 36.7112 }, totalSlots: 10, availableBatteries: 6, chargingBatteries: 2, emptySlots: 2, status: "online", operatingHours: "07:00 - 20:00" },
  { id: "OPS-SS-006", name: "South B Depot", location: { address: "Mombasa Rd, South B", lat: -1.3102, lng: 36.8345 }, totalSlots: 18, availableBatteries: 10, chargingBatteries: 4, emptySlots: 4, status: "maintenance", operatingHours: "06:00 - 21:00" },
];

const SEED_RIDERS: Rider[] = [
  { id: "OPS-RD-001", name: "James Mwangi", phone: "+254 712 345 678", email: "james.mwangi@email.com", status: "active", assignedBikeId: "OPS-BK-001", totalTrips: 342, joinedAt: "2024-03-15" },
  { id: "OPS-RD-002", name: "Grace Wanjiku", phone: "+254 723 456 789", email: "grace.wanjiku@email.com", status: "active", assignedBikeId: "OPS-BK-006", totalTrips: 287, joinedAt: "2024-04-02" },
  { id: "OPS-RD-003", name: "Peter Ochieng", phone: "+254 734 567 890", email: "peter.ochieng@email.com", status: "inactive", assignedBikeId: null, totalTrips: 156, joinedAt: "2024-05-20" },
  { id: "OPS-RD-004", name: "Amina Hassan", phone: "+254 745 678 901", email: "amina.hassan@email.com", status: "active", assignedBikeId: "OPS-BK-004", totalTrips: 421, joinedAt: "2024-02-10" },
  { id: "OPS-RD-005", name: "David Kamau", phone: "+254 756 789 012", email: "david.kamau@email.com", status: "active", assignedBikeId: "OPS-BK-008", totalTrips: 512, joinedAt: "2024-01-15" },
  { id: "OPS-RD-006", name: "Faith Njeri", phone: "+254 767 890 123", email: "faith.njeri@email.com", status: "suspended", assignedBikeId: null, totalTrips: 89, joinedAt: "2024-07-01" },
  { id: "OPS-RD-007", name: "Brian Otieno", phone: "+254 778 901 234", email: "brian.otieno@email.com", status: "active", assignedBikeId: null, totalTrips: 203, joinedAt: "2024-06-10" },
  { id: "OPS-RD-008", name: "Lucy Wambui", phone: "+254 789 012 345", email: "lucy.wambui@email.com", status: "active", assignedBikeId: null, totalTrips: 178, joinedAt: "2024-08-20" },
];

export function seedOpsIfEmpty() {
  if (loadOpsBikes().length === 0) saveOpsBikes(SEED_BIKES);
  if (loadOpsBatteries().length === 0) saveOpsBatteries(SEED_BATTERIES);
  if (loadOpsSwapStations().length === 0) saveOpsSwapStations(SEED_SWAP_STATIONS);
  if (loadOpsRiders().length === 0) saveOpsRiders(SEED_RIDERS);
}
