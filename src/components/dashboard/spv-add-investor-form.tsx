"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CapitalAllocator } from "@/types/spv";

interface SpvAddInvestorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spvId: string;
  onSubmit: (allocator: CapitalAllocator) => void;
}

export function SpvAddInvestorForm({
  open,
  onOpenChange,
  spvId,
  onSubmit,
}: SpvAddInvestorFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const allocator: CapitalAllocator = {
      id: `CA-${Date.now().toString(36).toUpperCase()}`,
      spvId,
      name,
      email,
      investedAmountUSD: Number(amount) || 0,
      ownershipPct: 0, // recalculated by parent
      totalReturnedUSD: 0,
      createdAt: new Date().toISOString(),
    };

    onSubmit(allocator);
    setName("");
    setEmail("");
    setAmount("");
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Capital Allocator</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="inv-name">Investor Name</Label>
            <Input
              id="inv-name"
              placeholder="e.g. Amani Capital Partners"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inv-email">Email</Label>
            <Input
              id="inv-email"
              type="email"
              placeholder="e.g. invest@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inv-amount">Invested Amount (USD)</Label>
            <Input
              id="inv-amount"
              type="number"
              placeholder="e.g. 15000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Add Investor
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
