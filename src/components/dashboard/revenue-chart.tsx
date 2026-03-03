"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import type { TimeSeriesPoint } from "@/types/spv";
import { formatUSDCompact, formatUSDShort } from "@/lib/currency";

interface RevenueChartProps {
  data: TimeSeriesPoint[];
  isEmpty: boolean;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      <p className="mb-1.5 text-xs font-semibold">{label}</p>
      {payload.map((entry) => (
        <div
          key={entry.name}
          className="flex items-center gap-2 text-xs"
        >
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">
            {entry.name.includes("Revenue")
              ? formatUSDCompact(entry.value)
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart({ data, isEmpty }: RevenueChartProps) {
  if (isEmpty || data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              Revenue Growth vs Asset Deployment
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            <p className="text-sm">
              No data available — add assets to see revenue trends
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">
            Revenue Growth vs Asset Deployment
          </CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          Correlation between asset deployment and revenue generation
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(v: number) => formatUSDShort(v)}
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
              label={{
                value: "Revenue ($)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 10, fill: "#94a3b8" },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
              label={{
                value: "Asset Count",
                angle: 90,
                position: "insideRight",
                style: { fontSize: 10, fill: "#94a3b8" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              iconType="line"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={2.5}
              name="Revenue ($)"
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="batteryCount"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="8 4"
              name="Batteries"
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="stationCount"
              stroke="#f97316"
              strokeWidth={2}
              strokeDasharray="3 3"
              name="Swap Stations"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
