from datetime import datetime
from typing import Optional

from sqlalchemy import String, Float, Integer, Boolean, DateTime, ForeignKey, Table, Column, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

# ── M2M association tables for SpvVehicle ↔ assets ────────────────

spv_vehicle_bikes = Table(
    "spv_vehicle_bikes", Base.metadata,
    Column("vehicle_id", String(20), ForeignKey("spv_vehicles.id"), primary_key=True),
    Column("bike_id", String(20), ForeignKey("spv_bikes.id"), primary_key=True),
)

spv_vehicle_batteries = Table(
    "spv_vehicle_batteries", Base.metadata,
    Column("vehicle_id", String(20), ForeignKey("spv_vehicles.id"), primary_key=True),
    Column("battery_id", String(20), ForeignKey("spv_batteries.id"), primary_key=True),
)

spv_vehicle_swap_boxes = Table(
    "spv_vehicle_swap_boxes", Base.metadata,
    Column("vehicle_id", String(20), ForeignKey("spv_vehicles.id"), primary_key=True),
    Column("swap_box_id", String(20), ForeignKey("spv_swap_boxes.id"), primary_key=True),
)


# ── SPV Electric Bikes (Green / MFI-financed) ────────────────────

class SpvBike(Base):
    __tablename__ = "spv_bikes"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    asset_tag: Mapped[str] = mapped_column(String(30))
    model: Mapped[str] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(20), default="active")
    # Technical
    frame_number: Mapped[str] = mapped_column(String(30), default="")
    motor_power_w: Mapped[int] = mapped_column(Integer, default=2000)
    battery_capacity_ah: Mapped[int] = mapped_column(Integer, default=60)
    max_range_km: Mapped[int] = mapped_column(Integer, default=80)
    # Utilization
    assigned_rider: Mapped[str] = mapped_column(String(100), default="Unassigned")
    km_per_day: Mapped[float] = mapped_column(Float, default=0)
    km_per_week: Mapped[float] = mapped_column(Float, default=0)
    km_per_month: Mapped[float] = mapped_column(Float, default=0)
    km_total: Mapped[float] = mapped_column(Float, default=0)
    trips_per_day: Mapped[float] = mapped_column(Float, default=0)
    trips_per_week: Mapped[float] = mapped_column(Float, default=0)
    trips_per_month: Mapped[float] = mapped_column(Float, default=0)
    trips_total: Mapped[float] = mapped_column(Float, default=0)
    # Financial
    purchase_cost_usd: Mapped[float] = mapped_column(Float, default=0)
    monthly_lease_usd: Mapped[float] = mapped_column(Float, default=0)
    total_paid_usd: Mapped[float] = mapped_column(Float, default=0)
    outstanding_usd: Mapped[float] = mapped_column(Float, default=0)
    payments_made: Mapped[int] = mapped_column(Integer, default=0)
    payments_total: Mapped[int] = mapped_column(Integer, default=18)
    revenue_to_date_usd: Mapped[float] = mapped_column(Float, default=0)
    created_at: Mapped[str] = mapped_column(String(30))


# ── SPV Batteries (Blue / Energy infrastructure) ─────────────────

class SpvBattery(Base):
    __tablename__ = "spv_batteries"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    serial_number: Mapped[str] = mapped_column(String(50))
    model: Mapped[str] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(20), default="active")
    # Technical
    capacity_kwh: Mapped[float] = mapped_column(Float)
    nominal_voltage: Mapped[float] = mapped_column(Float, default=48)
    chemistry: Mapped[str] = mapped_column(String(20), default="LFP")
    max_cycles: Mapped[int] = mapped_column(Integer, default=2000)
    current_soh: Mapped[float] = mapped_column(Float, default=100)
    # Utilization
    cycles_used: Mapped[int] = mapped_column(Integer, default=0)
    swaps_per_day: Mapped[float] = mapped_column(Float, default=0)
    swaps_per_week: Mapped[float] = mapped_column(Float, default=0)
    swaps_per_month: Mapped[float] = mapped_column(Float, default=0)
    swaps_total: Mapped[int] = mapped_column(Integer, default=0)
    last_swap_date: Mapped[str] = mapped_column(String(30), default="")
    current_location: Mapped[str] = mapped_column(String(100), default="")
    # Financial
    purchase_cost_usd: Mapped[float] = mapped_column(Float, default=0)
    revenue_per_swap_usd: Mapped[float] = mapped_column(Float, default=0)
    total_revenue_usd: Mapped[float] = mapped_column(Float, default=0)
    maintenance_cost_usd: Mapped[float] = mapped_column(Float, default=0)
    break_even_swaps: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[str] = mapped_column(String(30))


# ── SPV Swap Boxes (Orange / Infrastructure) ─────────────────────

class SpvSwapBox(Base):
    __tablename__ = "spv_swap_boxes"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    station_id: Mapped[str] = mapped_column(String(20))
    name: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(20), default="active")
    # Technical
    total_slots: Mapped[int] = mapped_column(Integer)
    solar_capacity_w: Mapped[int] = mapped_column(Integer, default=0)
    grid_connected: Mapped[bool] = mapped_column(Boolean, default=False)
    location: Mapped[str] = mapped_column(String(200), default="")
    latitude: Mapped[float] = mapped_column(Float, default=0)
    longitude: Mapped[float] = mapped_column(Float, default=0)
    # Utilization
    swaps_per_day: Mapped[float] = mapped_column(Float, default=0)
    swaps_per_week: Mapped[float] = mapped_column(Float, default=0)
    swaps_per_month: Mapped[float] = mapped_column(Float, default=0)
    swaps_total: Mapped[int] = mapped_column(Integer, default=0)
    avg_slot_utilization: Mapped[float] = mapped_column(Float, default=0)
    operational_days: Mapped[int] = mapped_column(Integer, default=0)
    # Financial
    install_cost_usd: Mapped[float] = mapped_column(Float, default=0)
    monthly_opex_usd: Mapped[float] = mapped_column(Float, default=0)
    revenue_per_swap_usd: Mapped[float] = mapped_column(Float, default=0)
    total_revenue_usd: Mapped[float] = mapped_column(Float, default=0)
    total_cost_usd: Mapped[float] = mapped_column(Float, default=0)
    payback_progress_pct: Mapped[float] = mapped_column(Float, default=0)
    created_at: Mapped[str] = mapped_column(String(30))


# ── SPV Vehicle (aggregation entity) ─────────────────────────────

class SpvVehicle(Base):
    __tablename__ = "spv_vehicles"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    city: Mapped[str] = mapped_column(String(100))
    country: Mapped[str] = mapped_column(String(3), default="KEN")
    status: Mapped[str] = mapped_column(String(20), default="raising")
    target_amount_usd: Mapped[float] = mapped_column(Float, default=0)
    raised_amount_usd: Mapped[float] = mapped_column(Float, default=0)
    created_at: Mapped[str] = mapped_column(String(30))

    # Asset type flags
    includes_bikes: Mapped[bool] = mapped_column(Boolean, default=False)
    includes_batteries: Mapped[bool] = mapped_column(Boolean, default=False)
    includes_swap_stations: Mapped[bool] = mapped_column(Boolean, default=False)

    # Unit economics (USD per unit)
    bike_price_usd: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    battery_price_usd: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    swap_station_price_usd: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    # Insurance costs (monthly per unit)
    insurance_cost_per_battery_usd: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    insurance_cost_per_station_usd: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    # Replacement costs
    battery_replacement_cost_usd: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    # Waterfall split (must sum to 100)
    waterfall_finance_pct: Mapped[float] = mapped_column(Float, default=70.0)
    waterfall_operator_pct: Mapped[float] = mapped_column(Float, default=20.0)
    waterfall_mobilityx_pct: Mapped[float] = mapped_column(Float, default=10.0)

    # Local operator
    local_operator_name: Mapped[str] = mapped_column(String(200), default="")

    # Financing structure
    months_to_payback: Mapped[int] = mapped_column(Integer, default=36)
    interest_rate_pct: Mapped[float] = mapped_column(Float, default=0.0)
    interest_coverage_ratio: Mapped[float] = mapped_column(Float, default=1.5)

    # Dates
    inception_date: Mapped[str] = mapped_column(String(30), default="")
    maturity_date: Mapped[str] = mapped_column(String(30), default="")

    # Deployment tracking
    deployed_capital_usd: Mapped[float] = mapped_column(Float, default=0)
    bikes_deployed: Mapped[int] = mapped_column(Integer, default=0)
    batteries_deployed: Mapped[int] = mapped_column(Integer, default=0)
    stations_deployed: Mapped[int] = mapped_column(Integer, default=0)

    # Financial performance
    total_revenue_collected_usd: Mapped[float] = mapped_column(Float, default=0)
    total_amortized_usd: Mapped[float] = mapped_column(Float, default=0)
    current_icr: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    # Investors stored as JSON string (SQLite doesn't support JSONB)
    investors_json: Mapped[str] = mapped_column(Text, default="[]")

    # Relationships
    bikes: Mapped[list[SpvBike]] = relationship(secondary=spv_vehicle_bikes, lazy="selectin")
    batteries: Mapped[list[SpvBattery]] = relationship(secondary=spv_vehicle_batteries, lazy="selectin")
    swap_boxes: Mapped[list[SpvSwapBox]] = relationship(secondary=spv_vehicle_swap_boxes, lazy="selectin")
    allocators: Mapped[list["CapitalAllocator"]] = relationship(back_populates="vehicle", lazy="selectin")


# ── SPV Monthly Performance ──────────────────────────────────────

class SpvMonthlyPerformance(Base):
    __tablename__ = "spv_monthly_performance"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    spv_id: Mapped[str] = mapped_column(String(20), ForeignKey("spv_vehicles.id"))
    month_date: Mapped[str] = mapped_column(String(10))  # YYYY-MM-DD first of month

    # Revenue metrics
    monthly_revenue_usd: Mapped[float] = mapped_column(Float, default=0)
    monthly_operating_expenses_usd: Mapped[float] = mapped_column(Float, default=0)
    monthly_insurance_costs_usd: Mapped[float] = mapped_column(Float, default=0)

    # Debt service
    monthly_interest_payment_usd: Mapped[float] = mapped_column(Float, default=0)
    monthly_principal_payment_usd: Mapped[float] = mapped_column(Float, default=0)
    total_debt_service_usd: Mapped[float] = mapped_column(Float, default=0)

    # ICR calculation
    ebitda_usd: Mapped[float] = mapped_column(Float, default=0)
    interest_coverage_ratio: Mapped[float] = mapped_column(Float, default=0)
    debt_service_coverage_ratio: Mapped[float] = mapped_column(Float, default=0)

    # Asset performance
    avg_bike_utilization_pct: Mapped[float] = mapped_column(Float, default=0)
    avg_battery_swaps_per_day: Mapped[float] = mapped_column(Float, default=0)
    active_bikes: Mapped[int] = mapped_column(Integer, default=0)
    active_batteries: Mapped[int] = mapped_column(Integer, default=0)
    active_stations: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[str] = mapped_column(String(30), default="")


# ── Capital Allocator (Investor) ─────────────────────────────────

class CapitalAllocator(Base):
    __tablename__ = "capital_allocators"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    spv_id: Mapped[str] = mapped_column(String(20), ForeignKey("spv_vehicles.id"))
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(100))
    invested_amount_usd: Mapped[float] = mapped_column(Float, default=0)
    ownership_pct: Mapped[float] = mapped_column(Float, default=0)
    total_returned_usd: Mapped[float] = mapped_column(Float, default=0)
    created_at: Mapped[str] = mapped_column(String(30))

    vehicle: Mapped[SpvVehicle] = relationship(back_populates="allocators")
