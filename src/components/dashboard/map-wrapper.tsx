"use client";

import dynamic from "next/dynamic";
import type { SwapStationMapData } from "@/types";

const NairobiMap = dynamic(
  () =>
    import("@/components/dashboard/nairobi-map").then((mod) => mod.NairobiMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] items-center justify-center rounded-lg border bg-muted">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    ),
  }
);

interface MapWrapperProps {
  stations: SwapStationMapData[];
}

export function MapWrapper({ stations }: MapWrapperProps) {
  return <NairobiMap stations={stations} />;
}
