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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Trash2,
  Bike,
  Battery,
  Radio,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { SpvVehicle, InvestorInfo } from "@/types/spv";

interface SpvAddVehicleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (vehicle: SpvVehicle) => void;
}

const COUNTRY_OPTIONS = [
  { label: "Kenya", value: "KEN" },
  { label: "Ghana", value: "GHA" },
  { label: "Tanzania", value: "TZA" },
  { label: "Nigeria", value: "NGA" },
  { label: "Uganda", value: "UGA" },
  { label: "Rwanda", value: "RWA" },
  { label: "South Africa", value: "ZAF" },
  { label: "Ethiopia", value: "ETH" },
];

const INVESTOR_TYPES = [
  "DFI",
  "Private Equity",
  "Corporate VC",
  "Family Office",
  "Angel",
  "Impact Fund",
];

function emptyInvestor(): InvestorInfo {
  return { name: "", commitmentUSD: 0, equityPct: 0, investorType: "" };
}

export function SpvAddVehicleForm({
  open,
  onOpenChange,
  onSubmit,
}: SpvAddVehicleFormProps) {
  // Basic info
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("KEN");
  const [targetAmount, setTargetAmount] = useState("");

  // Asset types
  const [includesBikes, setIncludesBikes] = useState(false);
  const [includesBatteries, setIncludesBatteries] = useState(false);
  const [includesSwapStations, setIncludesSwapStations] = useState(false);

  // Unit economics
  const [bikePriceUSD, setBikePriceUSD] = useState("");
  const [batteryPriceUSD, setBatteryPriceUSD] = useState("");
  const [swapStationPriceUSD, setSwapStationPriceUSD] = useState("");

  // Insurance
  const [insuranceBatteryUSD, setInsuranceBatteryUSD] = useState("");
  const [insuranceStationUSD, setInsuranceStationUSD] = useState("");
  const [batteryReplacementUSD, setBatteryReplacementUSD] = useState("");

  // Waterfall
  const [financePct, setFinancePct] = useState("70");
  const [operatorPct, setOperatorPct] = useState("20");
  const [mobilityxPct, setMobilityxPct] = useState("10");

  // Operator
  const [operatorName, setOperatorName] = useState("");

  // Financing
  const [monthsToPayback, setMonthsToPayback] = useState("36");
  const [interestRate, setInterestRate] = useState("8.5");
  const [icr, setIcr] = useState("1.5");
  const [inceptionDate, setInceptionDate] = useState("");

  // Investors
  const [investors, setInvestors] = useState<InvestorInfo[]>([emptyInvestor()]);

  // Computed values
  const waterfallSum =
    (Number(financePct) || 0) +
    (Number(operatorPct) || 0) +
    (Number(mobilityxPct) || 0);
  const waterfallValid = Math.abs(waterfallSum - 100) < 0.01;

  const totalCommitments = investors.reduce(
    (sum, inv) => sum + (inv.commitmentUSD || 0),
    0
  );
  const financing = Number(targetAmount) || 0;
  const commitmentsMatch =
    financing === 0 || Math.abs(totalCommitments - financing) < 0.01;

  const hasAssetType =
    includesBikes || includesBatteries || includesSwapStations;

  // Calculate maturity date
  let maturityDate = "";
  if (inceptionDate && Number(monthsToPayback) > 0) {
    const d = new Date(inceptionDate);
    d.setMonth(d.getMonth() + Number(monthsToPayback));
    maturityDate = d.toISOString().split("T")[0];
  }

  function addInvestor() {
    setInvestors([...investors, emptyInvestor()]);
  }

  function removeInvestor(index: number) {
    if (investors.length <= 1) return;
    setInvestors(investors.filter((_, i) => i !== index));
  }

  function updateInvestor(index: number, field: keyof InvestorInfo, value: string | number) {
    const updated = [...investors];
    updated[index] = { ...updated[index], [field]: value };
    setInvestors(updated);
  }

  function resetForm() {
    setName("");
    setCity("");
    setCountry("KEN");
    setTargetAmount("");
    setIncludesBikes(false);
    setIncludesBatteries(false);
    setIncludesSwapStations(false);
    setBikePriceUSD("");
    setBatteryPriceUSD("");
    setSwapStationPriceUSD("");
    setInsuranceBatteryUSD("");
    setInsuranceStationUSD("");
    setBatteryReplacementUSD("");
    setFinancePct("70");
    setOperatorPct("20");
    setMobilityxPct("10");
    setOperatorName("");
    setMonthsToPayback("36");
    setInterestRate("8.5");
    setIcr("1.5");
    setInceptionDate("");
    setInvestors([emptyInvestor()]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const vehicle: SpvVehicle = {
      id: `SPV-VH-${Date.now().toString(36).toUpperCase()}`,
      name,
      city,
      country,
      status: "raising",
      targetAmountUSD: Number(targetAmount) || 0,
      raisedAmountUSD: totalCommitments,
      createdAt: new Date().toISOString(),
      // Asset types
      includesBikes,
      includesBatteries,
      includesSwapStations,
      // Unit economics
      bikePriceUSD: includesBikes ? Number(bikePriceUSD) || undefined : undefined,
      batteryPriceUSD: includesBatteries ? Number(batteryPriceUSD) || undefined : undefined,
      swapStationPriceUSD: includesSwapStations ? Number(swapStationPriceUSD) || undefined : undefined,
      // Insurance
      insuranceCostPerBatteryUSD: includesBatteries ? Number(insuranceBatteryUSD) || undefined : undefined,
      insuranceCostPerStationUSD: includesSwapStations ? Number(insuranceStationUSD) || undefined : undefined,
      // Replacement
      batteryReplacementCostUSD: includesBatteries ? Number(batteryReplacementUSD) || undefined : undefined,
      // Waterfall
      waterfallFinancePct: Number(financePct) || 70,
      waterfallOperatorPct: Number(operatorPct) || 20,
      waterfallMobilityxPct: Number(mobilityxPct) || 10,
      // Operator
      localOperatorName: operatorName,
      // Financing
      monthsToPayback: Number(monthsToPayback) || 36,
      interestRatePct: Number(interestRate) || 0,
      interestCoverageRatio: Number(icr) || 1.5,
      // Dates
      inceptionDate,
      maturityDate,
      // Deployment (starts at 0)
      bikesDeployed: 0,
      batteriesDeployed: 0,
      stationsDeployed: 0,
      // Performance (starts at 0)
      totalRevenueCollectedUSD: 0,
      currentIcr: undefined,
      // Investors
      investorsJson: JSON.stringify(investors.filter((inv) => inv.name)),
      // No linked assets yet
      bikeIds: [],
      batteryIds: [],
      swapBoxIds: [],
    };

    onSubmit(vehicle);
    resetForm();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New SPV</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {/* ── Section 1: Basic Information ── */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="spv-name">SPV Name *</Label>
                <Input
                  id="spv-name"
                  placeholder="e.g. E-Mobility Ghana Fund I"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="spv-city">City *</Label>
                <Input
                  id="spv-city"
                  placeholder="e.g. Accra"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="spv-country">Country *</Label>
                <select
                  id="spv-country"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {COUNTRY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Section 2: Asset Types ── */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Asset Types *
            </h3>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIncludesBikes(!includesBikes)}
                className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  includesBikes
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <Bike className="h-4 w-4" />
                Bikes
              </button>
              <button
                type="button"
                onClick={() => setIncludesBatteries(!includesBatteries)}
                className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  includesBatteries
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <Battery className="h-4 w-4" />
                Batteries
              </button>
              <button
                type="button"
                onClick={() => setIncludesSwapStations(!includesSwapStations)}
                className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  includesSwapStations
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <Radio className="h-4 w-4" />
                Swap Stations
              </button>
            </div>
            {!hasAssetType && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Select at least one asset type
              </p>
            )}
          </div>

          {/* ── Section 3: Unit Economics (Conditional) ── */}
          {hasAssetType && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Unit Economics (USD)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {includesBikes && (
                    <div className="space-y-1.5">
                      <Label>Bike Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="1200.00"
                        value={bikePriceUSD}
                        onChange={(e) => setBikePriceUSD(e.target.value)}
                      />
                    </div>
                  )}
                  {includesBatteries && (
                    <>
                      <div className="space-y-1.5">
                        <Label>Battery Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="150.00"
                          value={batteryPriceUSD}
                          onChange={(e) => setBatteryPriceUSD(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Insurance / Battery / Month ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="2.50"
                          value={insuranceBatteryUSD}
                          onChange={(e) => setInsuranceBatteryUSD(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Battery Replacement ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="120.00"
                          value={batteryReplacementUSD}
                          onChange={(e) => setBatteryReplacementUSD(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                  {includesSwapStations && (
                    <>
                      <div className="space-y-1.5">
                        <Label>Swap Station Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="5000.00"
                          value={swapStationPriceUSD}
                          onChange={(e) => setSwapStationPriceUSD(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Insurance / Station / Month ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="25.00"
                          value={insuranceStationUSD}
                          onChange={(e) => setInsuranceStationUSD(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* ── Section 4: Waterfall Split ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Waterfall Split
              </h3>
              <Badge variant={waterfallValid ? "default" : "destructive"}>
                {waterfallValid ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> {waterfallSum.toFixed(1)}%
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {waterfallSum.toFixed(1)}%
                  </span>
                )}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Finance Payback %</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={financePct}
                  onChange={(e) => setFinancePct(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Local Operator %</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={operatorPct}
                  onChange={(e) => setOperatorPct(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>MobilityX %</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={mobilityxPct}
                  onChange={(e) => setMobilityxPct(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Section 5: Local Operator ── */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Local Operator
            </h3>
            <div className="space-y-1.5">
              <Label>Operator Name *</Label>
              <Input
                placeholder="e.g. Guardian Mobility Ghana"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                required
              />
            </div>
          </div>

          <Separator />

          {/* ── Section 6: Financing Structure ── */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Financing Structure
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Total Financing Target ($) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="1500000.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Months to Payback *</Label>
                <Input
                  type="number"
                  placeholder="36"
                  value={monthsToPayback}
                  onChange={(e) => setMonthsToPayback(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Interest Rate (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="8.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Target ICR</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="1.5"
                  value={icr}
                  onChange={(e) => setIcr(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Inception Date *</Label>
                <Input
                  type="date"
                  value={inceptionDate}
                  onChange={(e) => setInceptionDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Maturity Date</Label>
                <Input type="date" value={maturityDate} disabled className="bg-muted" />
              </div>
            </div>
          </div>

          <Separator />

          {/* ── Section 7: Investors ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Investors
              </h3>
              <span className={`text-xs font-medium ${commitmentsMatch ? "text-green-600" : "text-red-600"}`}>
                Total: ${totalCommitments.toLocaleString()}
                {financing > 0 && !commitmentsMatch && ` / $${financing.toLocaleString()}`}
              </span>
            </div>
            <div className="space-y-3">
              {investors.map((inv, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_100px_80px_100px_36px] gap-2 items-end"
                >
                  <div className="space-y-1">
                    {idx === 0 && (
                      <Label className="text-xs">Name</Label>
                    )}
                    <Input
                      placeholder="Investor name"
                      value={inv.name}
                      onChange={(e) => updateInvestor(idx, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    {idx === 0 && (
                      <Label className="text-xs">Amount ($)</Label>
                    )}
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      value={inv.commitmentUSD || ""}
                      onChange={(e) =>
                        updateInvestor(idx, "commitmentUSD", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    {idx === 0 && (
                      <Label className="text-xs">Equity %</Label>
                    )}
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      value={inv.equityPct || ""}
                      onChange={(e) =>
                        updateInvestor(idx, "equityPct", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    {idx === 0 && (
                      <Label className="text-xs">Type</Label>
                    )}
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs"
                      value={inv.investorType}
                      onChange={(e) => updateInvestor(idx, "investorType", e.target.value)}
                    >
                      <option value="">Select</option>
                      {INVESTOR_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-red-500 hover:text-red-700"
                    onClick={() => removeInvestor(idx)}
                    disabled={investors.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addInvestor}
            >
              <Plus className="h-3 w-3 mr-1" /> Add Investor
            </Button>
          </div>

          <Separator />

          {/* ── Submit ── */}
          <Button
            type="submit"
            className="w-full"
            disabled={!name || !city || !hasAssetType || !waterfallValid || !operatorName}
          >
            Create SPV
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
