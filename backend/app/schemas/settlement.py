from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PaymentRequest(BaseModel):
    rider_id: str | None = Field(None, alias="riderId")
    asset_id: str | None = Field(None, alias="assetId")
    tx_type: str = Field(alias="txType")  # lease_payment|swap_fee|deposit|penalty
    gross_amount: float = Field(alias="grossAmount")
    local_currency: str = Field("USD", alias="localCurrency")
    local_amount: float | None = Field(None, alias="localAmount")
    payment_gateway: str | None = Field(None, alias="paymentGateway")
    payment_reference: str | None = Field(None, alias="paymentReference")
    idempotency_key: str = Field(alias="idempotencyKey")
    spv_id: str | None = Field(None, alias="spvId")

    model_config = ConfigDict(populate_by_name=True)


class TransactionResponse(BaseModel):
    tx_id: str = Field(alias="txId")
    rider_id: str | None = Field(alias="riderId")
    asset_id: str | None = Field(alias="assetId")
    tx_type: str = Field(alias="txType")
    gross_amount: float = Field(alias="grossAmount")
    local_currency: str = Field(alias="localCurrency")
    local_amount: float = Field(alias="localAmount")
    split_spv: float = Field(alias="splitSpv")
    split_operator: float = Field(alias="splitOperator")
    split_mobilityx: float = Field(alias="splitMobilityx")
    payment_gateway: str | None = Field(alias="paymentGateway")
    payment_reference: str | None = Field(alias="paymentReference")
    settlement_status: str = Field(alias="settlementStatus")
    idempotency_key: str = Field(alias="idempotencyKey")
    timestamp: datetime
    created_at: datetime = Field(alias="createdAt")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class LedgerEntryResponse(BaseModel):
    id: int
    spv_id: str = Field(alias="spvId")
    asset_id: str | None = Field(alias="assetId")
    tx_id: str = Field(alias="txId")
    entry_type: str = Field(alias="entryType")
    amount: float
    balance_after: float = Field(alias="balanceAfter")
    recorded_at: datetime = Field(alias="recordedAt")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class WaterfallStatus(BaseModel):
    spv_escrow_pct: float = Field(alias="spvEscrowPct")
    operator_pct: float = Field(alias="operatorPct")
    platform_pct: float = Field(alias="platformPct")
    total_processed: float = Field(alias="totalProcessed")
    total_spv: float = Field(alias="totalSpv")
    total_operator: float = Field(alias="totalOperator")
    total_platform: float = Field(alias="totalPlatform")
    transaction_count: int = Field(alias="transactionCount")

    model_config = ConfigDict(populate_by_name=True)
