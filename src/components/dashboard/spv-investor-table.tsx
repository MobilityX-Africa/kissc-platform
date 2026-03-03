"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import type { InvestorReturn } from "@/types/spv";
import { repaymentBadgeVariant } from "@/lib/spv-computations";
import { formatUSD } from "@/lib/currency";

interface SpvInvestorTableProps {
  investors: InvestorReturn[];
  onAddInvestor: () => void;
}

export function SpvInvestorTable({
  investors,
  onAddInvestor,
}: SpvInvestorTableProps) {
  if (investors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <UserPlus className="h-10 w-10 text-muted-foreground/40" />
        <h3 className="mt-3 text-sm font-medium">
          No capital allocators added
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Add investors to track capital allocation and returns.
        </p>
        <Button size="sm" className="mt-4" onClick={onAddInvestor}>
          <UserPlus className="mr-1.5 h-3.5 w-3.5" />
          Add Investor
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Capital Allocators</h3>
        <Button size="sm" variant="outline" onClick={onAddInvestor}>
          <UserPlus className="mr-1.5 h-3.5 w-3.5" />
          Add Investor
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Invested</TableHead>
              <TableHead className="text-right">Ownership</TableHead>
              <TableHead className="text-right">Returned</TableHead>
              <TableHead className="text-right">Outstanding</TableHead>
              <TableHead className="text-right">Repayment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investors.map((inv) => (
              <TableRow key={inv.allocatorId}>
                <TableCell className="font-medium">{inv.name}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatUSD(inv.investedAmountUSD)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {inv.ownershipPct}%
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatUSD(inv.totalReturnedUSD)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatUSD(inv.outstandingUSD)}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={repaymentBadgeVariant(inv.repaymentPct)}>
                    {inv.repaymentPct}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
