"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WaterfallSplit } from "@/types/spv";
import { formatUSDCompact } from "@/lib/currency";

interface SpvWaterfallChartProps {
  waterfall: WaterfallSplit;
}

export function SpvWaterfallChart({ waterfall }: SpvWaterfallChartProps) {
  const { totalRevenueUSD, investorPoolUSD, operatorPoolUSD, platformPoolUSD } =
    waterfall;

  if (totalRevenueUSD <= 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Revenue Waterfall (70-20-10)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            No revenue generated yet
          </div>
        </CardContent>
      </Card>
    );
  }

  const splits = [
    {
      label: "Investors",
      pct: 70,
      amount: investorPoolUSD,
      color: "bg-green-500",
      textColor: "text-green-700",
      bgLight: "bg-green-50",
    },
    {
      label: "Operator",
      pct: 20,
      amount: operatorPoolUSD,
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgLight: "bg-blue-50",
    },
    {
      label: "MobilityX",
      pct: 10,
      amount: platformPoolUSD,
      color: "bg-purple-500",
      textColor: "text-purple-700",
      bgLight: "bg-purple-50",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Revenue Waterfall (70-20-10)
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Total Revenue: {formatUSDCompact(totalRevenueUSD)}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bar */}
        <div className="flex h-10 w-full overflow-hidden rounded-lg">
          {splits.map((s) => (
            <div
              key={s.label}
              className={`${s.color} flex items-center justify-center text-xs font-semibold text-white`}
              style={{ width: `${s.pct}%` }}
            >
              {s.pct}%
            </div>
          ))}
        </div>

        {/* Legend rows */}
        <div className="space-y-2">
          {splits.map((s) => (
            <div
              key={s.label}
              className={`flex items-center justify-between rounded-md px-3 py-2 ${s.bgLight}`}
            >
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${s.color}`} />
                <span className={`text-sm font-medium ${s.textColor}`}>
                  {s.label} ({s.pct}%)
                </span>
              </div>
              <span className={`text-sm font-bold tabular-nums ${s.textColor}`}>
                {formatUSDCompact(s.amount)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
