from __future__ import annotations

import uuid
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.operations import OpsBike, OpsBattery, OpsSwapStation, OpsRider
from app.schemas.operations import (
    BikeCreate, BikeResponse, BikeUpdate,
    BatteryCreate, BatteryResponse,
    SwapStationCreate, SwapStationResponse,
    RiderCreate, RiderResponse,
)

router = APIRouter()


# ── Bikes ────────────────────────────────────────────────────

@router.get("/bikes", response_model=list[BikeResponse])
async def list_bikes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(OpsBike))
    return list(result.scalars().all())


@router.get("/bikes/{bike_id}", response_model=BikeResponse)
async def get_bike(bike_id: str, db: AsyncSession = Depends(get_db)):
    bike = await db.get(OpsBike, bike_id)
    if not bike:
        raise HTTPException(status_code=404, detail="Bike not found")
    return bike


@router.post("/bikes", response_model=BikeResponse, status_code=201)
async def create_bike(req: BikeCreate, db: AsyncSession = Depends(get_db)):
    bike = OpsBike(
        id=f"BK-{uuid.uuid4().hex[:6].upper()}",
        registration_number=req.registration_number,
        model=req.model,
        current_rider_id=req.current_rider_id,
        current_battery_id=req.current_battery_id,
        total_km=req.total_km,
        last_service_date=date.today().isoformat(),
    )
    db.add(bike)
    await db.commit()
    await db.refresh(bike)
    return bike


@router.patch("/bikes/{bike_id}", response_model=BikeResponse)
async def update_bike(bike_id: str, req: BikeUpdate, db: AsyncSession = Depends(get_db)):
    bike = await db.get(OpsBike, bike_id)
    if not bike:
        raise HTTPException(status_code=404, detail="Bike not found")
    update_data = req.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(bike, key, value)
    await db.commit()
    await db.refresh(bike)
    return bike


@router.delete("/bikes/{bike_id}", status_code=204)
async def delete_bike(bike_id: str, db: AsyncSession = Depends(get_db)):
    bike = await db.get(OpsBike, bike_id)
    if not bike:
        raise HTTPException(status_code=404, detail="Bike not found")
    await db.delete(bike)
    await db.commit()


# ── Batteries ────────────────────────────────────────────────

@router.get("/batteries", response_model=list[BatteryResponse])
async def list_batteries(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(OpsBattery))
    return list(result.scalars().all())


@router.get("/batteries/{battery_id}", response_model=BatteryResponse)
async def get_battery(battery_id: str, db: AsyncSession = Depends(get_db)):
    battery = await db.get(OpsBattery, battery_id)
    if not battery:
        raise HTTPException(status_code=404, detail="Battery not found")
    return battery


@router.post("/batteries", response_model=BatteryResponse, status_code=201)
async def create_battery(req: BatteryCreate, db: AsyncSession = Depends(get_db)):
    battery = OpsBattery(
        id=f"BAT-{uuid.uuid4().hex[:6].upper()}",
        serial_number=req.serial_number,
        capacity_kwh=req.capacity_kwh,
        state_of_health=req.state_of_health,
        current_charge=req.current_charge,
        cycle_count=req.cycle_count,
        current_location=req.current_location,
    )
    db.add(battery)
    await db.commit()
    await db.refresh(battery)
    return battery


@router.delete("/batteries/{battery_id}", status_code=204)
async def delete_battery(battery_id: str, db: AsyncSession = Depends(get_db)):
    battery = await db.get(OpsBattery, battery_id)
    if not battery:
        raise HTTPException(status_code=404, detail="Battery not found")
    await db.delete(battery)
    await db.commit()


# ── Swap Stations ────────────────────────────────────────────

@router.get("/stations", response_model=list[SwapStationResponse])
async def list_stations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(OpsSwapStation))
    rows = list(result.scalars().all())
    return [_station_to_response(s) for s in rows]


@router.get("/stations/{station_id}", response_model=SwapStationResponse)
async def get_station(station_id: str, db: AsyncSession = Depends(get_db)):
    station = await db.get(OpsSwapStation, station_id)
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    return _station_to_response(station)


@router.post("/stations", response_model=SwapStationResponse, status_code=201)
async def create_station(req: SwapStationCreate, db: AsyncSession = Depends(get_db)):
    station = OpsSwapStation(
        id=f"SS-{uuid.uuid4().hex[:6].upper()}",
        name=req.name,
        address=req.address,
        lat=req.lat,
        lng=req.lng,
        total_slots=req.total_slots,
        available_batteries=0,
        charging_batteries=0,
        empty_slots=req.total_slots,
        operating_hours=req.operating_hours,
    )
    db.add(station)
    await db.commit()
    await db.refresh(station)
    return _station_to_response(station)


@router.delete("/stations/{station_id}", status_code=204)
async def delete_station(station_id: str, db: AsyncSession = Depends(get_db)):
    station = await db.get(OpsSwapStation, station_id)
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    await db.delete(station)
    await db.commit()


def _station_to_response(s: OpsSwapStation) -> SwapStationResponse:
    """Convert flat ORM row to nested SwapStationResponse with location object."""
    from app.schemas.operations import SwapStationLocation
    return SwapStationResponse(
        id=s.id,
        name=s.name,
        location=SwapStationLocation(address=s.address, lat=s.lat, lng=s.lng),
        total_slots=s.total_slots,
        available_batteries=s.available_batteries,
        charging_batteries=s.charging_batteries,
        empty_slots=s.empty_slots,
        status=s.status,
        operating_hours=s.operating_hours,
    )


# ── Riders ───────────────────────────────────────────────────

@router.get("/riders", response_model=list[RiderResponse])
async def list_riders(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(OpsRider))
    return list(result.scalars().all())


@router.get("/riders/{rider_id}", response_model=RiderResponse)
async def get_rider(rider_id: str, db: AsyncSession = Depends(get_db)):
    rider = await db.get(OpsRider, rider_id)
    if not rider:
        raise HTTPException(status_code=404, detail="Rider not found")
    return rider


@router.post("/riders", response_model=RiderResponse, status_code=201)
async def create_rider(req: RiderCreate, db: AsyncSession = Depends(get_db)):
    rider = OpsRider(
        id=f"RD-{uuid.uuid4().hex[:6].upper()}",
        name=req.name,
        phone=req.phone,
        email=req.email,
        assigned_bike_id=req.assigned_bike_id,
        joined_at=date.today().isoformat(),
    )
    db.add(rider)
    await db.commit()
    await db.refresh(rider)
    return rider


@router.delete("/riders/{rider_id}", status_code=204)
async def delete_rider(rider_id: str, db: AsyncSession = Depends(get_db)):
    rider = await db.get(OpsRider, rider_id)
    if not rider:
        raise HTTPException(status_code=404, detail="Rider not found")
    await db.delete(rider)
    await db.commit()
