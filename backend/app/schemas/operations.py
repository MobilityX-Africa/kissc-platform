from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field


class BikeCreate(BaseModel):
    registration_number: str = Field(alias="registrationNumber")
    model: str
    current_rider_id: str | None = Field(None, alias="currentRiderId")
    current_battery_id: str | None = Field(None, alias="currentBatteryId")
    total_km: float = Field(0, alias="totalKm")

    model_config = ConfigDict(populate_by_name=True)


class BikeResponse(BaseModel):
    id: str
    registration_number: str = Field(alias="registrationNumber")
    model: str
    status: str
    current_rider_id: str | None = Field(alias="currentRiderId")
    current_battery_id: str | None = Field(alias="currentBatteryId")
    total_km: float = Field(alias="totalKm")
    last_service_date: str = Field(alias="lastServiceDate")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class BikeUpdate(BaseModel):
    status: str | None = None
    current_rider_id: str | None = Field(None, alias="currentRiderId")
    current_battery_id: str | None = Field(None, alias="currentBatteryId")
    total_km: float | None = Field(None, alias="totalKm")

    model_config = ConfigDict(populate_by_name=True)


class BatteryCreate(BaseModel):
    serial_number: str = Field(alias="serialNumber")
    capacity_kwh: float = Field(alias="capacityKwh")
    state_of_health: float = Field(100, alias="stateOfHealth")
    current_charge: float = Field(100, alias="currentCharge")
    cycle_count: int = Field(0, alias="cycleCount")
    current_location: str = Field("", alias="currentLocation")

    model_config = ConfigDict(populate_by_name=True)


class BatteryResponse(BaseModel):
    id: str
    serial_number: str = Field(alias="serialNumber")
    capacity_kwh: float = Field(alias="capacityKwh")
    state_of_health: float = Field(alias="stateOfHealth")
    current_charge: float = Field(alias="currentCharge")
    status: str
    cycle_count: int = Field(alias="cycleCount")
    current_location: str = Field(alias="currentLocation")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class SwapStationCreate(BaseModel):
    name: str
    address: str
    lat: float = -1.2864
    lng: float = 36.8172
    total_slots: int = Field(alias="totalSlots")
    operating_hours: str = Field("06:00 - 22:00", alias="operatingHours")

    model_config = ConfigDict(populate_by_name=True)


class SwapStationLocation(BaseModel):
    address: str
    lat: float
    lng: float


class SwapStationResponse(BaseModel):
    id: str
    name: str
    location: SwapStationLocation
    total_slots: int = Field(alias="totalSlots")
    available_batteries: int = Field(alias="availableBatteries")
    charging_batteries: int = Field(alias="chargingBatteries")
    empty_slots: int = Field(alias="emptySlots")
    status: str
    operating_hours: str = Field(alias="operatingHours")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class RiderCreate(BaseModel):
    name: str
    phone: str
    email: str = ""
    assigned_bike_id: str | None = Field(None, alias="assignedBikeId")

    model_config = ConfigDict(populate_by_name=True)


class RiderResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: str
    status: str
    assigned_bike_id: str | None = Field(alias="assignedBikeId")
    total_trips: int = Field(alias="totalTrips")
    joined_at: str = Field(alias="joinedAt")
    credit_score: int = Field(alias="creditScore")
    days_overdue: int = Field(alias="daysOverdue")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
