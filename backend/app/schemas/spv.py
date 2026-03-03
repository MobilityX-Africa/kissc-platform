from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator


# ── SPV Bikes ────────────────────────────────────────────────

class SpvBikeCreate(BaseModel):
    asset_tag: str = Field(alias="assetTag")
    model: str
    frame_number: str = Field("", alias="frameNumber")
    motor_power_w: int = Field(2000, alias="motorPowerW")
    battery_capacity_ah: int = Field(60, alias="batteryCapacityAh")
    max_range_km: int = Field(80, alias="maxRangeKm")
    assigned_rider: str = Field("Unassigned", alias="assignedRider")
    purchase_cost_usd: float = Field(0, alias="purchaseCostUSD")
    monthly_lease_usd: float = Field(0, alias="monthlyLeaseUSD")
    payments_total: int = Field(18, alias="paymentsTotal")

    model_config = ConfigDict(populate_by_name=True)


class SpvBikeResponse(BaseModel):
    id: str
    asset_tag: str = Field(alias="assetTag")
    model: str
    status: str
    frame_number: str = Field(alias="frameNumber")
    motor_power_w: int = Field(alias="motorPowerW")
    battery_capacity_ah: int = Field(alias="batteryCapacityAh")
    max_range_km: int = Field(alias="maxRangeKm")
    assigned_rider: str = Field(alias="assignedRider")
    km_per_day: float = Field(alias="kmPerDay")
    km_per_week: float = Field(alias="kmPerWeek")
    km_per_month: float = Field(alias="kmPerMonth")
    km_total: float = Field(alias="kmTotal")
    trips_per_day: float = Field(alias="tripsPerDay")
    trips_per_week: float = Field(alias="tripsPerWeek")
    trips_per_month: float = Field(alias="tripsPerMonth")
    trips_total: float = Field(alias="tripsTotal")
    purchase_cost_usd: float = Field(alias="purchaseCostUSD")
    monthly_lease_usd: float = Field(alias="monthlyLeaseUSD")
    total_paid_usd: float = Field(alias="totalPaidUSD")
    outstanding_usd: float = Field(alias="outstandingUSD")
    payments_made: int = Field(alias="paymentsMade")
    payments_total: int = Field(alias="paymentsTotal")
    revenue_to_date_usd: float = Field(alias="revenueToDateUSD")
    created_at: str = Field(alias="createdAt")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


# ── SPV Batteries ────────────────────────────────────────────

class SpvBatteryCreate(BaseModel):
    serial_number: str = Field(alias="serialNumber")
    model: str
    capacity_kwh: float = Field(alias="capacityKwh")
    nominal_voltage: float = Field(48, alias="nominalVoltage")
    chemistry: str = "LFP"
    max_cycles: int = Field(2000, alias="maxCycles")
    purchase_cost_usd: float = Field(0, alias="purchaseCostUSD")
    revenue_per_swap_usd: float = Field(0, alias="revenuePerSwapUSD")
    break_even_swaps: int = Field(0, alias="breakEvenSwaps")

    model_config = ConfigDict(populate_by_name=True)


class SpvBatteryResponse(BaseModel):
    id: str
    serial_number: str = Field(alias="serialNumber")
    model: str
    status: str
    capacity_kwh: float = Field(alias="capacityKwh")
    nominal_voltage: float = Field(alias="nominalVoltage")
    chemistry: str
    max_cycles: int = Field(alias="maxCycles")
    current_soh: float = Field(alias="currentSoh")
    cycles_used: int = Field(alias="cyclesUsed")
    swaps_per_day: float = Field(alias="swapsPerDay")
    swaps_per_week: float = Field(alias="swapsPerWeek")
    swaps_per_month: float = Field(alias="swapsPerMonth")
    swaps_total: int = Field(alias="swapsTotal")
    last_swap_date: str = Field(alias="lastSwapDate")
    current_location: str = Field(alias="currentLocation")
    purchase_cost_usd: float = Field(alias="purchaseCostUSD")
    revenue_per_swap_usd: float = Field(alias="revenuePerSwapUSD")
    total_revenue_usd: float = Field(alias="totalRevenueUSD")
    maintenance_cost_usd: float = Field(alias="maintenanceCostUSD")
    break_even_swaps: int = Field(alias="breakEvenSwaps")
    created_at: str = Field(alias="createdAt")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


# ── SPV Swap Boxes ───────────────────────────────────────────

class SpvSwapBoxCreate(BaseModel):
    station_id: str = Field(alias="stationId")
    name: str
    total_slots: int = Field(alias="totalSlots")
    solar_capacity_w: int = Field(0, alias="solarCapacityW")
    grid_connected: bool = Field(False, alias="gridConnected")
    location: str = ""
    latitude: float = 0
    longitude: float = 0
    install_cost_usd: float = Field(0, alias="installCostUSD")
    monthly_opex_usd: float = Field(0, alias="monthlyOpexUSD")
    revenue_per_swap_usd: float = Field(0, alias="revenuePerSwapUSD")

    model_config = ConfigDict(populate_by_name=True)


class SpvSwapBoxResponse(BaseModel):
    id: str
    station_id: str = Field(alias="stationId")
    name: str
    status: str
    total_slots: int = Field(alias="totalSlots")
    solar_capacity_w: int = Field(alias="solarCapacityW")
    grid_connected: bool = Field(alias="gridConnected")
    location: str
    latitude: float
    longitude: float
    swaps_per_day: float = Field(alias="swapsPerDay")
    swaps_per_week: float = Field(alias="swapsPerWeek")
    swaps_per_month: float = Field(alias="swapsPerMonth")
    swaps_total: int = Field(alias="swapsTotal")
    avg_slot_utilization: float = Field(alias="avgSlotUtilization")
    operational_days: int = Field(alias="operationalDays")
    install_cost_usd: float = Field(alias="installCostUSD")
    monthly_opex_usd: float = Field(alias="monthlyOpexUSD")
    revenue_per_swap_usd: float = Field(alias="revenuePerSwapUSD")
    total_revenue_usd: float = Field(alias="totalRevenueUSD")
    total_cost_usd: float = Field(alias="totalCostUSD")
    payback_progress_pct: float = Field(alias="paybackProgressPct")
    created_at: str = Field(alias="createdAt")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


# ── Investor info (embedded in SPV) ──────────────────────────

class InvestorInfo(BaseModel):
    name: str
    commitment_usd: float = Field(alias="commitmentUSD")
    equity_pct: Optional[float] = Field(None, alias="equityPct")
    investor_type: str = Field("", alias="investorType")

    model_config = ConfigDict(populate_by_name=True)


# ── Waterfall split config ───────────────────────────────────

class WaterfallSplitConfig(BaseModel):
    finance_pct: float = Field(70.0, alias="financePct")
    operator_pct: float = Field(20.0, alias="operatorPct")
    mobilityx_pct: float = Field(10.0, alias="mobilityxPct")

    model_config = ConfigDict(populate_by_name=True)

    @model_validator(mode="after")
    def check_sum(self) -> "WaterfallSplitConfig":
        total = self.finance_pct + self.operator_pct + self.mobilityx_pct
        if abs(total - 100.0) > 0.01:
            raise ValueError(f"Waterfall splits must sum to 100%. Current sum: {total}%")
        return self


# ── SPV Vehicle ──────────────────────────────────────────────

class SpvVehicleCreate(BaseModel):
    name: str
    city: str
    country: str = Field("KEN")
    target_amount_usd: float = Field(0, alias="targetAmountUSD")
    raised_amount_usd: float = Field(0, alias="raisedAmountUSD")

    # Asset type flags
    includes_bikes: bool = Field(False, alias="includesBikes")
    includes_batteries: bool = Field(False, alias="includesBatteries")
    includes_swap_stations: bool = Field(False, alias="includesSwapStations")

    # Unit economics (USD)
    bike_price_usd: Optional[float] = Field(None, alias="bikePriceUSD")
    battery_price_usd: Optional[float] = Field(None, alias="batteryPriceUSD")
    swap_station_price_usd: Optional[float] = Field(None, alias="swapStationPriceUSD")

    # Insurance costs (monthly per unit)
    insurance_cost_per_battery_usd: Optional[float] = Field(None, alias="insuranceCostPerBatteryUSD")
    insurance_cost_per_station_usd: Optional[float] = Field(None, alias="insuranceCostPerStationUSD")

    # Replacement costs
    battery_replacement_cost_usd: Optional[float] = Field(None, alias="batteryReplacementCostUSD")

    # Waterfall configuration
    waterfall_split: WaterfallSplitConfig = Field(
        default_factory=WaterfallSplitConfig,
        alias="waterfallSplit",
    )

    # Local operator
    local_operator_name: str = Field("", alias="localOperatorName")

    # Financing structure
    months_to_payback: int = Field(36, alias="monthsToPayback")
    interest_rate_pct: float = Field(0.0, alias="interestRatePct")
    interest_coverage_ratio: float = Field(1.5, alias="interestCoverageRatio")

    # Investors
    investors: list[InvestorInfo] = Field(default_factory=list)

    # Dates
    inception_date: str = Field("", alias="inceptionDate")

    # Existing asset linking (backward compat)
    bike_ids: list[str] = Field(default_factory=list, alias="bikeIds")
    battery_ids: list[str] = Field(default_factory=list, alias="batteryIds")
    swap_box_ids: list[str] = Field(default_factory=list, alias="swapBoxIds")

    model_config = ConfigDict(populate_by_name=True)


class SpvVehicleResponse(BaseModel):
    id: str
    name: str
    city: str
    country: str = "KEN"
    status: str
    target_amount_usd: float = Field(alias="targetAmountUSD")
    raised_amount_usd: float = Field(alias="raisedAmountUSD")
    created_at: str = Field(alias="createdAt")

    # Asset type flags
    includes_bikes: bool = Field(False, alias="includesBikes")
    includes_batteries: bool = Field(False, alias="includesBatteries")
    includes_swap_stations: bool = Field(False, alias="includesSwapStations")

    # Unit economics
    bike_price_usd: Optional[float] = Field(None, alias="bikePriceUSD")
    battery_price_usd: Optional[float] = Field(None, alias="batteryPriceUSD")
    swap_station_price_usd: Optional[float] = Field(None, alias="swapStationPriceUSD")

    # Insurance
    insurance_cost_per_battery_usd: Optional[float] = Field(None, alias="insuranceCostPerBatteryUSD")
    insurance_cost_per_station_usd: Optional[float] = Field(None, alias="insuranceCostPerStationUSD")

    # Replacement
    battery_replacement_cost_usd: Optional[float] = Field(None, alias="batteryReplacementCostUSD")

    # Waterfall split
    waterfall_finance_pct: float = Field(70.0, alias="waterfallFinancePct")
    waterfall_operator_pct: float = Field(20.0, alias="waterfallOperatorPct")
    waterfall_mobilityx_pct: float = Field(10.0, alias="waterfallMobilityxPct")

    # Operator
    local_operator_name: str = Field("", alias="localOperatorName")

    # Financing
    months_to_payback: int = Field(36, alias="monthsToPayback")
    interest_rate_pct: float = Field(0.0, alias="interestRatePct")
    interest_coverage_ratio: float = Field(1.5, alias="interestCoverageRatio")

    # Dates
    inception_date: str = Field("", alias="inceptionDate")
    maturity_date: str = Field("", alias="maturityDate")

    # Deployment
    bikes_deployed: int = Field(0, alias="bikesDeployed")
    batteries_deployed: int = Field(0, alias="batteriesDeployed")
    stations_deployed: int = Field(0, alias="stationsDeployed")

    # Performance
    total_revenue_collected_usd: float = Field(0, alias="totalRevenueCollectedUSD")
    current_icr: Optional[float] = Field(None, alias="currentIcr")

    # Investors JSON
    investors_json: str = Field("[]", alias="investorsJson")

    # Linked asset IDs
    bike_ids: list[str] = Field(alias="bikeIds")
    battery_ids: list[str] = Field(alias="batteryIds")
    swap_box_ids: list[str] = Field(alias="swapBoxIds")
    allocators: list["AllocatorResponse"] = []

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


# ── Capital Allocator ────────────────────────────────────────

class AllocatorCreate(BaseModel):
    spv_id: str = Field(alias="spvId")
    name: str
    email: str = ""
    invested_amount_usd: float = Field(0, alias="investedAmountUSD")
    ownership_pct: float = Field(0, alias="ownershipPct")

    model_config = ConfigDict(populate_by_name=True)


class AllocatorResponse(BaseModel):
    id: str
    spv_id: str = Field(alias="spvId")
    name: str
    email: str
    invested_amount_usd: float = Field(alias="investedAmountUSD")
    ownership_pct: float = Field(alias="ownershipPct")
    total_returned_usd: float = Field(alias="totalReturnedUSD")
    created_at: str = Field(alias="createdAt")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


# Resolve forward reference
SpvVehicleResponse.model_rebuild()
