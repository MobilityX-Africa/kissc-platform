import type { SwapStationMapData, SwapEvent } from "@/types";

export const SWAP_STATIONS: SwapStationMapData[] = [
  {
    id: "SS001",
    name: "Westlands Hub",
    lat: -1.2673,
    lng: 36.8112,
    address: "Westlands Rd, Nairobi",
    totalSlots: 20,
    availableBatteries: 12,
    todaySwaps: 87,
    status: "online",
  },
  {
    id: "SS002",
    name: "CBD Central",
    lat: -1.2864,
    lng: 36.8172,
    address: "Kenyatta Ave, Nairobi",
    totalSlots: 30,
    availableBatteries: 18,
    todaySwaps: 142,
    status: "online",
  },
  {
    id: "SS003",
    name: "Kilimani Point",
    lat: -1.2923,
    lng: 36.7852,
    address: "Argwings Kodhek Rd, Nairobi",
    totalSlots: 15,
    availableBatteries: 8,
    todaySwaps: 63,
    status: "online",
  },
  {
    id: "SS004",
    name: "Eastleigh Depot",
    lat: -1.2741,
    lng: 36.8456,
    address: "1st Avenue, Eastleigh",
    totalSlots: 12,
    availableBatteries: 0,
    todaySwaps: 0,
    status: "offline",
  },
  {
    id: "SS005",
    name: "Karen Gateway",
    lat: -1.3197,
    lng: 36.7112,
    address: "Karen Rd, Nairobi",
    totalSlots: 10,
    availableBatteries: 6,
    todaySwaps: 34,
    status: "online",
  },
  {
    id: "SS006",
    name: "Kahawa West Station",
    lat: -1.1872,
    lng: 36.8234,
    address: "Kahawa West, Nairobi",
    totalSlots: 12,
    availableBatteries: 7,
    todaySwaps: 45,
    status: "online",
  },
  {
    id: "SS007",
    name: "Kahawa Sukari Hub",
    lat: -1.1945,
    lng: 36.8412,
    address: "Kahawa Sukari, Nairobi",
    totalSlots: 10,
    availableBatteries: 4,
    todaySwaps: 31,
    status: "online",
  },
  {
    id: "SS008",
    name: "Roysambu Point",
    lat: -1.2189,
    lng: 36.8734,
    address: "Thika Rd, Roysambu",
    totalSlots: 18,
    availableBatteries: 11,
    todaySwaps: 76,
    status: "online",
  },
  {
    id: "SS009",
    name: "Kasarani Station",
    lat: -1.2067,
    lng: 36.8912,
    address: "Thika Rd, Kasarani",
    totalSlots: 15,
    availableBatteries: 9,
    todaySwaps: 58,
    status: "online",
  },
  {
    id: "SS010",
    name: "Adams Arcade Hub",
    lat: -1.3012,
    lng: 36.7823,
    address: "Ngong Rd, Adams Arcade",
    totalSlots: 14,
    availableBatteries: 5,
    todaySwaps: 41,
    status: "online",
  },
  {
    id: "SS011",
    name: "Ngong Town Depot",
    lat: -1.3612,
    lng: 36.6578,
    address: "Ngong Town",
    totalSlots: 8,
    availableBatteries: 3,
    todaySwaps: 22,
    status: "maintenance",
  },
  {
    id: "SS012",
    name: "Mathare Station",
    lat: -1.2567,
    lng: 36.8567,
    address: "Mathare, Nairobi",
    totalSlots: 10,
    availableBatteries: 6,
    todaySwaps: 52,
    status: "online",
  },
  {
    id: "SS013",
    name: "Embakasi Hub",
    lat: -1.3234,
    lng: 36.8945,
    address: "Embakasi, Nairobi",
    totalSlots: 16,
    availableBatteries: 10,
    todaySwaps: 68,
    status: "online",
  },
  {
    id: "SS014",
    name: "Donholm Point",
    lat: -1.3012,
    lng: 36.8823,
    address: "Donholm, Nairobi",
    totalSlots: 12,
    availableBatteries: 7,
    todaySwaps: 39,
    status: "online",
  },
  {
    id: "SS015",
    name: "Langata Station",
    lat: -1.3423,
    lng: 36.7456,
    address: "Langata Rd, Nairobi",
    totalSlots: 10,
    availableBatteries: 4,
    todaySwaps: 28,
    status: "online",
  },
  {
    id: "SS016",
    name: "Juja Hub",
    lat: -1.1012,
    lng: 37.0123,
    address: "Juja Town",
    totalSlots: 8,
    availableBatteries: 5,
    todaySwaps: 19,
    status: "online",
  },
  {
    id: "SS017",
    name: "Ruiru Station",
    lat: -1.1456,
    lng: 36.9612,
    address: "Ruiru Town",
    totalSlots: 10,
    availableBatteries: 6,
    todaySwaps: 33,
    status: "online",
  },
  {
    id: "SS018",
    name: "Kikuyu Depot",
    lat: -1.2456,
    lng: 36.6812,
    address: "Kikuyu Town",
    totalSlots: 8,
    availableBatteries: 2,
    todaySwaps: 15,
    status: "maintenance",
  },
];

const RIDER_NAMES = [
  "James Mwangi",
  "Grace Wanjiku",
  "Peter Ochieng",
  "Amina Hassan",
  "David Kamau",
  "Faith Njeri",
  "Samuel Otieno",
  "Wanjiru Muthoni",
  "Joseph Kipchoge",
  "Mercy Akinyi",
  "Brian Nyabuto",
  "Sarah Wambui",
  "Kevin Odhiambo",
  "Esther Mwende",
  "Daniel Mutua",
];

function generateRecentTimestamp(minutesAgo: number): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - minutesAgo);
  return now.toISOString();
}

// Simple seeded PRNG for deterministic SSR/client hydration
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const _rand = seededRandom(42);

function generateBatterySerial(): string {
  const num = Math.floor(_rand() * 9000) + 1000;
  return `KSC-BAT-2024-${num}`;
}

export const RECENT_SWAP_EVENTS: SwapEvent[] = Array.from(
  { length: 20 },
  (_, i) => {
    const station =
      SWAP_STATIONS[Math.floor(_rand() * SWAP_STATIONS.length)];
    const rider = RIDER_NAMES[Math.floor(_rand() * RIDER_NAMES.length)];
    return {
      id: `EVT-${String(i + 1).padStart(3, "0")}`,
      timestamp: generateRecentTimestamp(i * 6 + Math.floor(_rand() * 5)),
      stationId: station.id,
      stationName: station.name,
      riderName: rider,
      batterySerialOut: generateBatterySerial(),
      batterySerialIn: generateBatterySerial(),
    };
  }
);

export function getTotalSwapsToday(): number {
  return SWAP_STATIONS.reduce((sum, s) => sum + s.todaySwaps, 0);
}

export function getActiveStationsCount(): number {
  return SWAP_STATIONS.filter((s) => s.status === "online").length;
}

export function getSwapRate(): number {
  const active = getActiveStationsCount();
  if (active === 0) return 0;
  return Math.round(getTotalSwapsToday() / active);
}
