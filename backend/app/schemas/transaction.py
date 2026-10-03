from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel

from app.models.transaction import PaymentStatus


class CheckoutRequest(BaseModel):
    batch_id: UUID
    tonnes_requested: float


class Milestone(BaseModel):
    key: str
    pct: float
    status: str


class TransactionResponse(BaseModel):
    id: UUID
    buyer_id: UUID
    batch_id: UUID
    tonnes_purchased: float
    buffer_tonnes: float
    net_tonnes: float
    total_price: float
    payment_status: PaymentStatus
    milestones: list[Any]
    buffer_pool_allocation: float
    created_at: datetime

    class Config:
        from_attributes = True
