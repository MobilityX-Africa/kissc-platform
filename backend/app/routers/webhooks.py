"""Payment gateway webhook stubs — Hubtel (Ghana) & Selcom (Tanzania)."""
from __future__ import annotations

from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db

router = APIRouter()


@router.post("/hubtel")
async def hubtel_callback(request: Request, db: AsyncSession = Depends(get_db)):
    """Hubtel payment notification stub.

    In production this would:
    1. Verify HMAC signature
    2. Parse payment notification
    3. Call process_payment() with idempotency_key from Hubtel reference
    """
    body = await request.json()
    return {
        "status": "received",
        "gateway": "hubtel",
        "note": "Webhook stub — not yet connected to settlement engine",
        "received": body,
    }


@router.post("/selcom")
async def selcom_callback(request: Request, db: AsyncSession = Depends(get_db)):
    """Selcom payment notification stub.

    In production this would:
    1. Verify callback signature
    2. Parse mobile money notification
    3. Call process_payment() with idempotency_key from Selcom reference
    """
    body = await request.json()
    return {
        "status": "received",
        "gateway": "selcom",
        "note": "Webhook stub — not yet connected to settlement engine",
        "received": body,
    }
