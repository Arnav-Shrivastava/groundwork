from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User, UserRole
from app.models.farm import Farm
from app.models.credit_batch import CreditBatch, CreditStatus
from app.schemas.credit_batch import CreditBatchCreate, CreditBatchResponse

router = APIRouter()

@router.post("", response_model=CreditBatchResponse)
def create_credit_batch(
    batch_in: CreditBatchCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.require_role([UserRole.aggregator.value]))
) -> Any:
    # Verify farm ownership
    for farm_id in batch_in.farm_ids:
        farm = db.query(Farm).filter(Farm.id == farm_id, Farm.aggregator_id == current_user.id).first()
        if not farm:
            raise HTTPException(status_code=400, detail=f"Farm {farm_id} not found or not owned by you.")
            
    batch = CreditBatch(
        aggregator_id=current_user.id,
        farm_ids=batch_in.farm_ids,
        standard=batch_in.standard,
        vintage_year=batch_in.vintage_year,
        total_tco2e=batch_in.total_tco2e,
        available_tco2e=batch_in.total_tco2e, # Initially all available
        price_per_tonne=batch_in.price_per_tonne,
        status=CreditStatus.listed,
        co_benefits=batch_in.co_benefits,
        scope_3_region=batch_in.scope_3_region,
        registry_serial_id=batch_in.registry_serial_id
    )
    
    db.add(batch)
    db.commit()
    db.refresh(batch)
    return batch

@router.get("", response_model=List[CreditBatchResponse])
def get_credit_batches(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.require_role([UserRole.aggregator.value]))
) -> Any:
    batches = db.query(CreditBatch).filter(CreditBatch.aggregator_id == current_user.id).all()
    return batches
