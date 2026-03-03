"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import type { SpvRepaymentSummary } from "@/types/spv";
import { formatUSD, formatUSDCompact } from "@/lib/currency";

interface SpvRepaymentDonutProps {
  repayment: SpvRepaymentSummary;
  isEmpty: boolean;
}

const SPV_COLORS: Record<string, { fill: string; bg: string }> = {
  "Bike SPV": { fill: "#22c55e", bg: "bg-green-500" },
  "Battery SPV": { fill: "#3b82f6", bg: "bg-blue-500" },
  "Swap Box SPV": { fill: "#f97316", bg: "bg-orange-500" },
};

function ProgressBar({
  label,
  actual,
  expected,
  ratio,
  color,
}: {
  label: string;
  actual: number;
  expected: number;
  ratio: number;
  color: string;
}) {
  const pct = Math.min(100, Math.round(ratio * 100));
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {formatUSD(actual)} / {formatUSD(expected)}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground text-right">{pct}%</p>
    </div>
  );
}

export function SpvRepaymentDonut({
  repayment,
  isEmpty,
}: SpvRepaymentDonutProps) {
  const overallPct = Math.min(100, Math.round(repayment.overallRatio * 100));

  // Donut segments: each SPV's actual revenue as a proportion
  const chartData = repayment.items
    .filter((item) => item.actual > 0)
    .map((item) => ({
      name: item.name,
      value: item.actual,
      fill: SPV_COLORS[item.name]?.fill ?? "#94a3b8",
    }));

  // If no data, show a gray placeholder ring
  if (isEmpty || chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">
              SPV Repayment Status
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <div className="h-32 w-32 rounded-full border-8 border-dashed border-muted" />
            <p className="mt-4 text-lg font-bold">---</p>
            <p className="text-xs">
              Add bikes, batteries, or stations to see repayment metrics
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
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">
            SPV Repayment Status
          </CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          Cashflow health across all three SPV vehicles
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
          {/* Donut chart */}
          <div className="relative mx-auto w-[200px]">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | undefined, name: string | undefined) => [
                    formatUSDCompact(value ?? 0),
                    name ?? "",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-3xl font-bold"
                style={{ color: repayment.overallColor }}
              >
                {overallPct}%
              </span>
              <span className="text-[10px] text-muted-foreground">
                Overall
              </span>
            </div>
          </div>

          {/* Per-SPV breakdown */}
          <div className="flex flex-col justify-center gap-3">
            {repayment.items.map((item) => (
              <ProgressBar
                key={item.name}
                label={item.name}
                actual={item.actual}
                expected={item.expected}
                ratio={item.ratio}
                color={item.color}
              />
            ))}
            <div className="mt-1 border-t pt-2">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">
                  {formatUSD(repayment.totalActual)} / {formatUSD(repayment.totalExpected)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 border-t pt-3">
          {repayment.items.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: SPV_COLORS[item.name]?.fill }}
              />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
          ))}
          <div className="ml-auto text-xs text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500" /> ≥90%{" "}
            <span className="inline-block h-2 w-2 rounded-full bg-yellow-500 ml-2" /> 70-89%{" "}
            <span className="inline-block h-2 w-2 rounded-full bg-red-500 ml-2" /> &lt;70%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
