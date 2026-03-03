"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import type { SwapEvent } from "@/types";

interface LiveSwapFeedProps {
  initialEvents: SwapEvent[];
  stationNames: string[];
  riderNames?: string[];
}

const DEFAULT_RIDER_NAMES = [
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
];

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

function generateBatterySerial(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `KSC-BAT-2024-${num}`;
}

export function LiveSwapFeed({
  initialEvents,
  stationNames,
  riderNames = DEFAULT_RIDER_NAMES,
}: LiveSwapFeedProps) {
  const [events, setEvents] = useState<SwapEvent[]>(initialEvents);
  const [eventCounter, setEventCounter] = useState(initialEvents.length);

  const generateEvent = useCallback((): SwapEvent => {
    const station = stationNames[Math.floor(Math.random() * stationNames.length)];
    const rider = riderNames[Math.floor(Math.random() * riderNames.length)];
    const newCount = eventCounter + 1;
    setEventCounter(newCount);
    return {
      id: `EVT-LIVE-${newCount}`,
      timestamp: new Date().toISOString(),
      stationId: `SS-LIVE`,
      stationName: station,
      riderName: rider,
      batterySerialOut: generateBatterySerial(),
      batterySerialIn: generateBatterySerial(),
    };
  }, [stationNames, riderNames, eventCounter]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((prev) => {
        const newEvent = generateEvent();
        return [newEvent, ...prev].slice(0, 20);
      });
    }, 8000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, [generateEvent]);

  // Re-render time-ago labels every 30s
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          Live Swap Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {events.map((event, i) => (
            <div
              key={event.id}
              className={`flex items-start gap-3 text-xs border-b pb-2 last:border-0 transition-opacity duration-500 ${i === 0 ? "opacity-100" : ""}`}
            >
              <div className="flex-shrink-0 mt-1">
                <Activity className="h-3 w-3 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{event.riderName}</p>
                <p className="text-muted-foreground truncate">
                  Swapped at {event.stationName}
                </p>
                <p className="text-muted-foreground font-mono text-[10px]">
                  {event.batterySerialIn} → {event.batterySerialOut}
                </p>
              </div>
              <time className="text-muted-foreground whitespace-nowrap flex-shrink-0">
                {formatTimeAgo(event.timestamp)}
              </time>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
