import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Float, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Transaction(Base):
    """Immutable payment ledger — every incoming payment is recorded here."""
    __tablename__ = "transactions"

    tx_id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    rider_id: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    asset_id: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    tx_type: Mapped[str] = mapped_column(String(30))  # lease_payment|swap_fee|deposit|penalty
    gross_amount: Mapped[float] = mapped_column(Float)
    local_currency: Mapped[str] = mapped_column(String(3), default="USD")
    local_amount: Mapped[float] = mapped_column(Float)
    # Grand Waterfall splits
    split_spv: Mapped[float] = mapped_column(Float)         # 70%
    split_operator: Mapped[float] = mapped_column(Float)     # 25%
    split_mobilityx: Mapped[float] = mapped_column(Float)    # 5%
    # Payment metadata
    payment_gateway: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)  # hubtel|selcom|manual
    payment_reference: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    settlement_status: Mapped[str] = mapped_column(String(20), default="pending")  # pending|settled|failed
    idempotency_key: Mapped[str] = mapped_column(String(100), unique=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class SpvLedger(Base):
    """Escrow tracking — one entry per SPV credit/debit."""
    __tablename__ = "spv_ledger"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    spv_id: Mapped[str] = mapped_column(String(20))
    asset_id: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    tx_id: Mapped[str] = mapped_column(String(36), ForeignKey("transactions.tx_id"))
    entry_type: Mapped[str] = mapped_column(String(30))  # amortization_credit|operator_payout|platform_fee
    amount: Mapped[float] = mapped_column(Float)
    balance_after: Mapped[float] = mapped_column(Float, default=0)
    recorded_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
