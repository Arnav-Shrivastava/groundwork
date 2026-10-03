from pydantic import BaseModel, condecimal
from typing import List, Dict, Any, Optional
from uuid import UUID
from datetime import datetime
from app.models.credit_batch import CreditStandard, CreditStatus, DeliveryType

class CreditBatchCreate(BaseModel):
    farm_ids: List[UUID]
    standard: CreditStandard
    delivery_type: DeliveryType = DeliveryType.issued
    vintage_year: str
    total_tco2e: float
    price_per_tonne: float
    co_benefits: List[str]
    scope_3_region: Optional[str] = None
    registry_serial_id: Optional[str] = None

class CreditBatchResponse(BaseModel):
    id: UUID
    aggregator_id: UUID
    farm_ids: List[UUID]
    standard: CreditStandard
    delivery_type: DeliveryType
    vintage_year: str
    total_tco2e: float
    available_tco2e: float
    price_per_tonne: float
    status: CreditStatus
    co_benefits: List[Any]
    scope_3_region: Optional[str]
    registry_serial_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
