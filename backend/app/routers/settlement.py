from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func as sa_func
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.settlement import Transaction, SpvLedger
from app.schemas.settlement import (
    PaymentRequest,
    TransactionResponse,
    LedgerEntryResponse,
    WaterfallStatus,
)
from app.services.settlement_engine import (
    process_payment,
    get_transaction,
    get_spv_ledger,
    get_spv_balance,
    DuplicatePaymentError,
)

router = APIRouter()


@router.post("/process", response_model=TransactionResponse)
async def process(req: PaymentRequest, db: AsyncSession = Depends(get_db)):
    """Process a payment through the Grand Waterfall (70/25/5)."""
    try:
        tx = await process_payment(
            db,
            rider_id=req.rider_id,
            asset_id=req.asset_id,
            tx_type=req.tx_type,
            gross_amount=req.gross_amount,
            local_currency=req.local_currency,
            local_amount=req.local_amount,
            payment_gateway=req.payment_gateway,
            payment_reference=req.payment_reference,
            idempotency_key=req.idempotency_key,
            spv_id=req.spv_id,
        )
        return tx
    except DuplicatePaymentError as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.get("/transactions", response_model=list[TransactionResponse])
async def list_transactions(
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Transaction)
        .order_by(Transaction.timestamp.desc())
        .limit(limit)
        .offset(offset)
    )
    return list(result.scalars().all())


@router.get("/transactions/{tx_id}", response_model=TransactionResponse)
async def get_tx(tx_id: str, db: AsyncSession = Depends(get_db)):
    tx = await get_transaction(db, tx_id)
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return tx


@router.get("/ledger/{spv_id}", response_model=list[LedgerEntryResponse])
async def get_ledger(spv_id: str, db: AsyncSession = Depends(get_db)):
    return await get_spv_ledger(db, spv_id)


@router.get("/balance/{spv_id}")
async def get_balance(spv_id: str, db: AsyncSession = Depends(get_db)):
    balance = await get_spv_balance(db, spv_id)
    return {"spvId": spv_id, "balance": balance}


@router.get("/status", response_model=WaterfallStatus)
async def waterfall_status(db: AsyncSession = Depends(get_db)):
    """Get overall waterfall settlement status."""
    result = await db.execute(
        select(
            sa_func.coalesce(sa_func.sum(Transaction.gross_amount), 0),
            sa_func.coalesce(sa_func.sum(Transaction.split_spv), 0),
            sa_func.coalesce(sa_func.sum(Transaction.split_operator), 0),
            sa_func.coalesce(sa_func.sum(Transaction.split_mobilityx), 0),
            sa_func.count(Transaction.tx_id),
        ).where(Transaction.settlement_status == "settled")
    )
    row = result.one()
    return WaterfallStatus(
        spv_escrow_pct=settings.SPV_ESCROW_PCT,
        operator_pct=settings.OPERATOR_PCT,
        platform_pct=settings.PLATFORM_PCT,
        total_processed=row[0],
        total_spv=row[1],
        total_operator=row[2],
        total_platform=row[3],
        transaction_count=row[4],
    )
