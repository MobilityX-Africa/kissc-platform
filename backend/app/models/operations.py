from datetime import datetime
from typing import Optional

from sqlalchemy import String, Float, Integer, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class OpsBike(Base):
    __tablename__ = "ops_bikes"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    registration_number: Mapped[str] = mapped_column(String(20))
    model: Mapped[str] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(20), default="available")  # available|in-use|maintenance|retired
    current_rider_id: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    current_battery_id: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    total_km: Mapped[float] = mapped_column(Float, default=0)
    last_service_date: Mapped[str] = mapped_column(String(20))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())


class OpsBattery(Base):
    __tablename__ = "ops_batteries"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    serial_number: Mapped[str] = mapped_column(String(50))
    capacity_kwh: Mapped[float] = mapped_column(Float)
    state_of_health: Mapped[float] = mapped_column(Float, default=100)
    current_charge: Mapped[float] = mapped_column(Float, default=100)
    status: Mapped[str] = mapped_column(String(20), default="available")  # in-use|charging|available|retired
    cycle_count: Mapped[int] = mapped_column(Integer, default=0)
    current_location: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())


class OpsSwapStation(Base):
    __tablename__ = "ops_swap_stations"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    address: Mapped[str] = mapped_column(String(200))
    lat: Mapped[float] = mapped_column(Float)
    lng: Mapped[float] = mapped_column(Float)
    total_slots: Mapped[int] = mapped_column(Integer)
    available_batteries: Mapped[int] = mapped_column(Integer, default=0)
    charging_batteries: Mapped[int] = mapped_column(Integer, default=0)
    empty_slots: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(20), default="online")  # online|offline|maintenance
    operating_hours: Mapped[str] = mapped_column(String(30), default="06:00 - 22:00")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())


class OpsRider(Base):
    __tablename__ = "ops_riders"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    phone: Mapped[str] = mapped_column(String(20))
    email: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(20), default="active")  # active|inactive|suspended
    assigned_bike_id: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    total_trips: Mapped[int] = mapped_column(Integer, default=0)
    joined_at: Mapped[str] = mapped_column(String(20))
    credit_score: Mapped[int] = mapped_column(Integer, default=500)
    days_overdue: Mapped[int] = mapped_column(Integer, default=0)
    payment_status: Mapped[str] = mapped_column(String(20), default="current")  # current|late|suspended
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
