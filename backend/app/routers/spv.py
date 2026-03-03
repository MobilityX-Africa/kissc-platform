from __future__ import annotations

import json
import uuid
from datetime import datetime
from dateutil.relativedelta import relativedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.spv import (
    SpvBike, SpvBattery, SpvSwapBox, SpvVehicle, CapitalAllocator,
    SpvMonthlyPerformance,
    spv_vehicle_bikes, spv_vehicle_batteries, spv_vehicle_swap_boxes,
)
from app.schemas.spv import (
    SpvBikeCreate, SpvBikeResponse,
    SpvBatteryCreate, SpvBatteryResponse,
    SpvSwapBoxCreate, SpvSwapBoxResponse,
    SpvVehicleCreate, SpvVehicleResponse,
    AllocatorCreate, AllocatorResponse,
)

router = APIRouter()


# ── SPV Bikes ────────────────────────────────────────────────

@router.get("/bikes", response_model=list[SpvBikeResponse])
async def list_spv_bikes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SpvBike))
    return list(result.scalars().all())


@router.post("/bikes", response_model=SpvBikeResponse, status_code=201)
async def create_spv_bike(req: SpvBikeCreate, db: AsyncSession = Depends(get_db)):
    bike = SpvBike(
        id=f"SB-{uuid.uuid4().hex[:6].upper()}",
        asset_tag=req.asset_tag,
        model=req.model,
        frame_number=req.frame_number,
        motor_power_w=req.motor_power_w,
        battery_capacity_ah=req.battery_capacity_ah,
        max_range_km=req.max_range_km,
        assigned_rider=req.assigned_rider,
        purchase_cost_usd=req.purchase_cost_usd,
        monthly_lease_usd=req.monthly_lease_usd,
        payments_total=req.payments_total,
        outstanding_usd=req.purchase_cost_usd,
        created_at=datetime.utcnow().isoformat(),
    )
    db.add(bike)
    await db.commit()
    await db.refresh(bike)
    return bike


# ── SPV Batteries ────────────────────────────────────────────

@router.get("/batteries", response_model=list[SpvBatteryResponse])
async def list_spv_batteries(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SpvBattery))
    return list(result.scalars().all())


@router.post("/batteries", response_model=SpvBatteryResponse, status_code=201)
async def create_spv_battery(req: SpvBatteryCreate, db: AsyncSession = Depends(get_db)):
    battery = SpvBattery(
        id=f"SBAT-{uuid.uuid4().hex[:6].upper()}",
        serial_number=req.serial_number,
        model=req.model,
        capacity_kwh=req.capacity_kwh,
        nominal_voltage=req.nominal_voltage,
        chemistry=req.chemistry,
        max_cycles=req.max_cycles,
        purchase_cost_usd=req.purchase_cost_usd,
        revenue_per_swap_usd=req.revenue_per_swap_usd,
        break_even_swaps=req.break_even_swaps,
        created_at=datetime.utcnow().isoformat(),
    )
    db.add(battery)
    await db.commit()
    await db.refresh(battery)
    return battery


# ── SPV Swap Boxes ───────────────────────────────────────────

@router.get("/swap-boxes", response_model=list[SpvSwapBoxResponse])
async def list_spv_swap_boxes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SpvSwapBox))
    return list(result.scalars().all())


@router.post("/swap-boxes", response_model=SpvSwapBoxResponse, status_code=201)
async def create_spv_swap_box(req: SpvSwapBoxCreate, db: AsyncSession = Depends(get_db)):
    box = SpvSwapBox(
        id=f"SBX-{uuid.uuid4().hex[:6].upper()}",
        station_id=req.station_id,
        name=req.name,
        total_slots=req.total_slots,
        solar_capacity_w=req.solar_capacity_w,
        grid_connected=req.grid_connected,
        location=req.location,
        latitude=req.latitude,
        longitude=req.longitude,
        install_cost_usd=req.install_cost_usd,
        monthly_opex_usd=req.monthly_opex_usd,
        revenue_per_swap_usd=req.revenue_per_swap_usd,
        created_at=datetime.utcnow().isoformat(),
    )
    db.add(box)
    await db.commit()
    await db.refresh(box)
    return box


# ── SPV Vehicles ─────────────────────────────────────────────

@router.get("/vehicles", response_model=list[SpvVehicleResponse])
async def list_vehicles(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SpvVehicle))
    vehicles = list(result.scalars().all())
    return [_vehicle_to_response(v) for v in vehicles]


@router.get("/vehicles/{vehicle_id}", response_model=SpvVehicleResponse)
async def get_vehicle(vehicle_id: str, db: AsyncSession = Depends(get_db)):
    vehicle = await db.get(SpvVehicle, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="SPV Vehicle not found")
    return _vehicle_to_response(vehicle)


@router.post("/vehicles", response_model=SpvVehicleResponse, status_code=201)
async def create_vehicle(req: SpvVehicleCreate, db: AsyncSession = Depends(get_db)):
    # Generate SPV ID based on asset types and city
    spv_id = _generate_spv_id(req)

    # Calculate maturity date from inception + months_to_payback
    maturity_date = ""
    if req.inception_date:
        try:
            inception = datetime.fromisoformat(req.inception_date.replace("Z", "+00:00"))
            maturity = inception + relativedelta(months=req.months_to_payback)
            maturity_date = maturity.date().isoformat()
        except (ValueError, TypeError):
            maturity_date = ""

    # Serialize investors list to JSON string
    investors_json = json.dumps(
        [inv.model_dump(by_alias=True) for inv in req.investors]
    )

    vehicle = SpvVehicle(
        id=spv_id,
        name=req.name,
        city=req.city,
        country=req.country,
        target_amount_usd=req.target_amount_usd,
        raised_amount_usd=req.raised_amount_usd,
        created_at=datetime.utcnow().isoformat(),
        # Asset type flags
        includes_bikes=req.includes_bikes,
        includes_batteries=req.includes_batteries,
        includes_swap_stations=req.includes_swap_stations,
        # Unit economics
        bike_price_usd=req.bike_price_usd,
        battery_price_usd=req.battery_price_usd,
        swap_station_price_usd=req.swap_station_price_usd,
        # Insurance
        insurance_cost_per_battery_usd=req.insurance_cost_per_battery_usd,
        insurance_cost_per_station_usd=req.insurance_cost_per_station_usd,
        # Replacement
        battery_replacement_cost_usd=req.battery_replacement_cost_usd,
        # Waterfall
        waterfall_finance_pct=req.waterfall_split.finance_pct,
        waterfall_operator_pct=req.waterfall_split.operator_pct,
        waterfall_mobilityx_pct=req.waterfall_split.mobilityx_pct,
        # Operator
        local_operator_name=req.local_operator_name,
        # Financing
        months_to_payback=req.months_to_payback,
        interest_rate_pct=req.interest_rate_pct,
        interest_coverage_ratio=req.interest_coverage_ratio,
        # Dates
        inception_date=req.inception_date,
        maturity_date=maturity_date,
        # Investors
        investors_json=investors_json,
    )
    db.add(vehicle)
    await db.flush()

    # Link assets via M2M
    for bike_id in req.bike_ids:
        await db.execute(spv_vehicle_bikes.insert().values(vehicle_id=vehicle.id, bike_id=bike_id))
    for bat_id in req.battery_ids:
        await db.execute(spv_vehicle_batteries.insert().values(vehicle_id=vehicle.id, battery_id=bat_id))
    for box_id in req.swap_box_ids:
        await db.execute(spv_vehicle_swap_boxes.insert().values(vehicle_id=vehicle.id, swap_box_id=box_id))

    # Create initial monthly performance record
    if req.inception_date:
        try:
            inception = datetime.fromisoformat(req.inception_date.replace("Z", "+00:00"))
            first_month = inception.replace(day=1).date().isoformat()
            perf = SpvMonthlyPerformance(
                spv_id=vehicle.id,
                month_date=first_month,
                created_at=datetime.utcnow().isoformat(),
            )
            db.add(perf)
        except (ValueError, TypeError):
            pass

    await db.commit()
    await db.refresh(vehicle)
    return _vehicle_to_response(vehicle)


def _generate_spv_id(req: SpvVehicleCreate) -> str:
    """Generate SPV ID: SPV-{TYPE}-{CITY}-{RANDOM}"""
    asset_types = []
    if req.includes_bikes:
        asset_types.append("bikes")
    if req.includes_batteries:
        asset_types.append("batteries")
    if req.includes_swap_stations:
        asset_types.append("swap_stations")

    if len(asset_types) > 1:
        type_prefix = "MULTI"
    elif "bikes" in asset_types:
        type_prefix = "E2W"
    elif "batteries" in asset_types:
        type_prefix = "BAT"
    elif "swap_stations" in asset_types:
        type_prefix = "SWP"
    else:
        type_prefix = "GEN"

    city_code = req.city[:3].upper() if req.city else "GEN"
    rand_suffix = uuid.uuid4().hex[:4].upper()
    return f"SPV-{type_prefix}-{city_code}-{rand_suffix}"


def _vehicle_to_response(v: SpvVehicle) -> SpvVehicleResponse:
    return SpvVehicleResponse(
        id=v.id,
        name=v.name,
        city=v.city,
        country=v.country,
        status=v.status,
        target_amount_usd=v.target_amount_usd,
        raised_amount_usd=v.raised_amount_usd,
        created_at=v.created_at,
        # Asset type flags
        includes_bikes=v.includes_bikes,
        includes_batteries=v.includes_batteries,
        includes_swap_stations=v.includes_swap_stations,
        # Unit economics
        bike_price_usd=v.bike_price_usd,
        battery_price_usd=v.battery_price_usd,
        swap_station_price_usd=v.swap_station_price_usd,
        # Insurance
        insurance_cost_per_battery_usd=v.insurance_cost_per_battery_usd,
        insurance_cost_per_station_usd=v.insurance_cost_per_station_usd,
        # Replacement
        battery_replacement_cost_usd=v.battery_replacement_cost_usd,
        # Waterfall
        waterfall_finance_pct=v.waterfall_finance_pct,
        waterfall_operator_pct=v.waterfall_operator_pct,
        waterfall_mobilityx_pct=v.waterfall_mobilityx_pct,
        # Operator
        local_operator_name=v.local_operator_name,
        # Financing
        months_to_payback=v.months_to_payback,
        interest_rate_pct=v.interest_rate_pct,
        interest_coverage_ratio=v.interest_coverage_ratio,
        # Dates
        inception_date=v.inception_date,
        maturity_date=v.maturity_date,
        # Deployment
        bikes_deployed=v.bikes_deployed,
        batteries_deployed=v.batteries_deployed,
        stations_deployed=v.stations_deployed,
        # Performance
        total_revenue_collected_usd=v.total_revenue_collected_usd,
        current_icr=v.current_icr,
        # Investors
        investors_json=v.investors_json,
        # Asset IDs
        bike_ids=[b.id for b in v.bikes],
        battery_ids=[b.id for b in v.batteries],
        swap_box_ids=[b.id for b in v.swap_boxes],
        allocators=[AllocatorResponse.model_validate(a) for a in v.allocators],
    )


# ── Capital Allocators ───────────────────────────────────────

@router.get("/allocators", response_model=list[AllocatorResponse])
async def list_allocators(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CapitalAllocator))
    return list(result.scalars().all())


@router.get("/allocators/{allocator_id}", response_model=AllocatorResponse)
async def get_allocator(allocator_id: str, db: AsyncSession = Depends(get_db)):
    allocator = await db.get(CapitalAllocator, allocator_id)
    if not allocator:
        raise HTTPException(status_code=404, detail="Allocator not found")
    return allocator


@router.post("/allocators", response_model=AllocatorResponse, status_code=201)
async def create_allocator(req: AllocatorCreate, db: AsyncSession = Depends(get_db)):
    allocator = CapitalAllocator(
        id=f"INV-{uuid.uuid4().hex[:6].upper()}",
        spv_id=req.spv_id,
        name=req.name,
        email=req.email,
        invested_amount_usd=req.invested_amount_usd,
        ownership_pct=req.ownership_pct,
        created_at=datetime.utcnow().isoformat(),
    )
    db.add(allocator)
    await db.commit()
    await db.refresh(allocator)
    return allocator
