export interface Rider {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: "active" | "inactive" | "suspended";
  assignedBikeId: string | null;
  totalTrips: number;
  joinedAt: string;
}

export interface Bike {
  id: string;
  registrationNumber: string;
  model: string;
  status: "available" | "in-use" | "maintenance" | "retired";
  currentRiderId: string | null;
  currentBatteryId: string | null;
  totalKm: number;
  lastServiceDate: string;
}

export interface Battery {
  id: string;
  serialNumber: string;
  capacityKwh: number;
  stateOfHealth: number;
  currentCharge: number;
  status: "in-use" | "charging" | "available" | "retired";
  cycleCount: number;
  currentLocation: string;
}

export interface SwapStation {
  id: string;
  name: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  totalSlots: number;
  availableBatteries: number;
  chargingBatteries: number;
  emptySlots: number;
  status: "online" | "offline" | "maintenance";
  operatingHours: string;
}

export interface SpvAsset {
  id: string;
  assetType: "bike" | "battery" | "station-equipment" | "solar-panel";
  description: string;
  purchaseDate: string;
  purchaseCost: number;
  currentValue: number;
  depreciationRate: number;
  status: "active" | "disposed" | "impaired";
}

export interface SwapStationMapData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  totalSlots: number;
  availableBatteries: number;
  todaySwaps: number;
  status: "online" | "offline" | "maintenance";
}

export interface SwapEvent {
  id: string;
  timestamp: string;
  stationId: string;
  stationName: string;
  riderName: string;
  batterySerialOut: string;
  batterySerialIn: string;
}
