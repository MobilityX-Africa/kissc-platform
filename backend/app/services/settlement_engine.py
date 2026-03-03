"""
Grand Waterfall Algorithm — the core clearing house logic.

Every incoming payment is split in real-time:
  70% → SPV Escrow (debt amortization)
  25% → Local Operator (operating revenue)
   5% → MobilityX (platform fee)

Target: settlement in <500ms from payment confirmation.
"""
from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import select, func as sa_func
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.settlement import Transaction, SpvLedger


class SettlementError(Exception):
    pass


class DuplicatePaymentError(SettlementError):
    pass


async def process_payment(
    db: AsyncSession,
    *,
    rider_id: str | None,
    asset_id: str | None,
    tx_type: str,
    gross_amount: float,
    local_currency: str = "USD",
    local_amount: float | None = None,
    payment_gateway: str | None = None,
    payment_reference: str | None = None,
    idempotency_key: str,
    spv_id: str | None = None,
) -> Transaction:
    """
    Process a payment through the Grand Waterfall.

    1. Check idempotency — reject duplicates
    2. Calculate 70/25/5 split
    3. Create immutable Transaction record
    4. Create SPV ledger entry (if spv_id provided)
    5. Mark as settled
    """

    # 1. Idempotency check
    existing = await db.execute(
        select(Transaction).where(Transaction.idempotency_key == idempotency_key)
    )
    if existing.scalar_one_or_none() is not None:
        raise DuplicatePaymentError(f"Payment already processed: {idempotency_key}")

    # 2. Calculate waterfall split
    if local_amount is None:
        local_amount = gross_amount

    spv_amount = round(gross_amount * settings.SPV_ESCROW_PCT, 2)
    operator_amount = round(gross_amount * settings.OPERATOR_PCT, 2)
    platform_amount = round(gross_amount * settings.PLATFORM_PCT, 2)

    # Handle rounding — ensure splits sum exactly to gross
    rounding_diff = round(gross_amount - (spv_amount + operator_amount + platform_amount), 2)
    spv_amount = round(spv_amount + rounding_diff, 2)

    # 3. Create transaction record
    tx = Transaction(
        tx_id=str(uuid.uuid4()),
        rider_id=rider_id,
        asset_id=asset_id,
        tx_type=tx_type,
        gross_amount=gross_amount,
        local_currency=local_currency,
        local_amount=local_amount,
        split_spv=spv_amount,
        split_operator=operator_amount,
        split_mobilityx=platform_amount,
        payment_gateway=payment_gateway,
        payment_reference=payment_reference,
        settlement_status="settled",
        idempotency_key=idempotency_key,
        timestamp=datetime.utcnow(),
    )
    db.add(tx)

    # 4. Create SPV ledger entry (escrow credit)
    if spv_id:
        # Get current balance
        result = await db.execute(
            select(sa_func.coalesce(sa_func.sum(SpvLedger.amount), 0))
            .where(SpvLedger.spv_id == spv_id)
        )
        current_balance = result.scalar() or 0
        new_balance = round(current_balance + spv_amount, 2)

        ledger_entry = SpvLedger(
            spv_id=spv_id,
            asset_id=asset_id,
            tx_id=tx.tx_id,
            entry_type="amortization_credit",
            amount=spv_amount,
            balance_after=new_balance,
        )
        db.add(ledger_entry)

    await db.commit()
    await db.refresh(tx)
    return tx


async def get_transaction(db: AsyncSession, tx_id: str) -> Transaction | None:
    result = await db.execute(select(Transaction).where(Transaction.tx_id == tx_id))
    return result.scalar_one_or_none()


async def get_spv_ledger(db: AsyncSession, spv_id: str) -> list[SpvLedger]:
    result = await db.execute(
        select(SpvLedger)
        .where(SpvLedger.spv_id == spv_id)
        .order_by(SpvLedger.recorded_at.desc())
    )
    return list(result.scalars().all())


async def get_spv_balance(db: AsyncSession, spv_id: str) -> float:
    result = await db.execute(
        select(sa_func.coalesce(sa_func.sum(SpvLedger.amount), 0))
        .where(SpvLedger.spv_id == spv_id)
    )
    return result.scalar() or 0
