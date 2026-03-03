from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select, func as sa_func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.operations import OpsBike, OpsBattery, OpsSwapStation, OpsRider
from app.models.settlement import Transaction

router = APIRouter()


@router.get("/metrics")
async def get_metrics(db: AsyncSession = Depends(get_db)):
    """Dashboard overview metrics."""
    bikes = await db.execute(select(sa_func.count(OpsBike.id)))
    batteries = await db.execute(select(sa_func.count(OpsBattery.id)))
    stations = await db.execute(select(sa_func.count(OpsSwapStation.id)))
    riders = await db.execute(select(sa_func.count(OpsRider.id)))
    active_riders = await db.execute(
        select(sa_func.count(OpsRider.id)).where(OpsRider.status == "active")
    )

    # Revenue totals
    revenue = await db.execute(
        select(
            sa_func.coalesce(sa_func.sum(Transaction.gross_amount), 0),
            sa_func.coalesce(sa_func.sum(Transaction.split_spv), 0),
            sa_func.coalesce(sa_func.sum(Transaction.split_operator), 0),
            sa_func.coalesce(sa_func.sum(Transaction.split_mobilityx), 0),
            sa_func.count(Transaction.tx_id),
        ).where(Transaction.settlement_status == "settled")
    )
    rev_row = revenue.one()

    return {
        "fleet": {
            "totalBikes": bikes.scalar() or 0,
            "totalBatteries": batteries.scalar() or 0,
            "totalStations": stations.scalar() or 0,
            "totalRiders": riders.scalar() or 0,
            "activeRiders": active_riders.scalar() or 0,
        },
        "revenue": {
            "totalProcessed": rev_row[0],
            "totalSpvEscrow": rev_row[1],
            "totalOperator": rev_row[2],
            "totalPlatform": rev_row[3],
            "transactionCount": rev_row[4],
        },
    }
