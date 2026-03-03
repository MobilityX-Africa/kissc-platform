"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { SwapStationMapData } from "@/types";

interface NairobiMapProps {
  stations: SwapStationMapData[];
}

const statusColor: Record<SwapStationMapData["status"], string> = {
  online: "#22c55e",
  offline: "#ef4444",
  maintenance: "#eab308",
};

export function NairobiMap({ stations }: NairobiMapProps) {
  return (
    <div className="h-[500px] w-full overflow-hidden rounded-lg border">
      <MapContainer
        center={[-1.2621, 36.8219]}
        zoom={11}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stations.map((station) => (
          <CircleMarker
            key={station.id}
            center={[station.lat, station.lng]}
            radius={Math.max(8, Math.min(18, station.todaySwaps / 8))}
            pathOptions={{
              color: statusColor[station.status],
              fillColor: statusColor[station.status],
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Popup>
              <div className="min-w-[200px] font-sans">
                <h3 className="text-sm font-bold">{station.name}</h3>
                <p className="text-xs text-gray-500">{station.address}</p>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <span className="text-gray-500">Today&apos;s Swaps:</span>
                  <span className="font-bold text-right">
                    {station.todaySwaps}
                  </span>
                  <span className="text-gray-500">Available:</span>
                  <span className="font-bold text-right">
                    {station.availableBatteries}/{station.totalSlots}
                  </span>
                  <span className="text-gray-500">Status:</span>
                  <span
                    className={`font-bold text-right ${
                      station.status === "online"
                        ? "text-green-600"
                        : station.status === "offline"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {station.status}
                  </span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
