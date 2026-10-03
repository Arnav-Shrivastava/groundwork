from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel

from app.models.credit_batch import CreditStandard, CreditStatus, DeliveryType


class CreditBatchCreate(BaseModel):
    farm_ids: list[UUID]
    standard: CreditStandard
    delivery_type: DeliveryType = DeliveryType.issued
    vintage_year: str
    total_tco2e: float
    price_per_tonne: float
    co_benefits: list[str]
    scope_3_region: str | None = None
    registry_serial_id: str | None = None


class CreditBatchResponse(BaseModel):
    id: UUID
    aggregator_id: UUID
    farm_ids: list[UUID]
    standard: CreditStandard
    delivery_type: DeliveryType
    vintage_year: str
    total_tco2e: float
    available_tco2e: float
    price_per_tonne: float
    status: CreditStatus
    co_benefits: list[Any]
    scope_3_region: str | None
    registry_serial_id: str | None
    created_at: datetime

    class Config:
        from_attributes = True
