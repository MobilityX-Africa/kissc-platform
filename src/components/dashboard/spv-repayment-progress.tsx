"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { repaymentColor } from "@/lib/spv-computations";
import { formatUSDCompact } from "@/lib/currency";

interface SpvRepaymentProgressProps {
  repaymentPct: number;
  raisedAmountUSD: number;
  totalReturnedUSD: number;
}

export function SpvRepaymentProgress({
  repaymentPct,
  raisedAmountUSD,
  totalReturnedUSD,
}: SpvRepaymentProgressProps) {
  const color = repaymentColor(repaymentPct);
  const clampedPct = Math.min(100, repaymentPct);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Investor Repayment Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${clampedPct}%`,
              backgroundColor: color,
            }}
          />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">
            {formatUSDCompact(totalReturnedUSD)} returned of {formatUSDCompact(raisedAmountUSD)}
          </span>
          <span
            className="text-lg font-bold tabular-nums"
            style={{ color }}
          >
            {repaymentPct}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
