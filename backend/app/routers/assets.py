"""Asset control stubs — lock/unlock bikes for overdue riders."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.operations import OpsBike

router = APIRouter()


@router.post("/lock/{bike_id}")
async def lock_bike(bike_id: str, db: AsyncSession = Depends(get_db)):
    """Lock a bike (IoT kill switch stub).

    In production this would send an MQTT/HTTP command to the bike's
    IoT module to disable the motor controller.
    """
    bike = await db.get(OpsBike, bike_id)
    if not bike:
        raise HTTPException(status_code=404, detail="Bike not found")
    bike.status = "maintenance"
    await db.commit()
    return {"bikeId": bike_id, "action": "locked", "status": bike.status}


@router.post("/unlock/{bike_id}")
async def unlock_bike(bike_id: str, db: AsyncSession = Depends(get_db)):
    """Unlock a bike (IoT kill switch stub)."""
    bike = await db.get(OpsBike, bike_id)
    if not bike:
        raise HTTPException(status_code=404, detail="Bike not found")
    bike.status = "available"
    await db.commit()
    return {"bikeId": bike_id, "action": "unlocked", "status": bike.status}
