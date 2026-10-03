from typing import Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api import deps
from app.models.credit_batch import CreditBatch, CreditStandard, CreditStatus
from app.schemas.credit_batch import CreditBatchResponse

router = APIRouter()


@router.get("", response_model=list[CreditBatchResponse])
def get_marketplace(
    db: Session = Depends(deps.get_db),
    min_vintage: str | None = None,
    standard: CreditStandard | None = None,
    co_benefits: str | None = Query(None, description="Comma-separated co-benefits"),
    scope_3_region: str | None = None,
) -> Any:
    query = db.query(CreditBatch).filter(CreditBatch.status == CreditStatus.listed)

    if min_vintage:
        query = query.filter(CreditBatch.vintage_year >= min_vintage)
    if standard:
        query = query.filter(CreditBatch.standard == standard)
    if co_benefits:
        benefits_list = [b.strip() for b in co_benefits.split(",")]
        # JSONB contains check using @>
        query = query.filter(CreditBatch.co_benefits.contains(benefits_list))
    if scope_3_region:
        query = query.filter(CreditBatch.scope_3_region.ilike(f"%{scope_3_region}%"))

    batches = query.all()
    return batches
