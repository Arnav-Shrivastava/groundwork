from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from decimal import Decimal

from app.api import deps
from app.models.user import User, UserRole
from app.models.credit_batch import CreditBatch, CreditStatus
from app.models.transaction import Transaction, PaymentStatus
from app.schemas.transaction import CheckoutRequest, TransactionResponse
from app.services.escrow import calculate_milestones

router = APIRouter()

@router.post("/checkout", response_model=TransactionResponse)
def checkout(
    checkout_in: CheckoutRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.require_role([UserRole.buyer.value]))
) -> Any:
    batch = db.query(CreditBatch).with_for_update().filter(CreditBatch.id == checkout_in.batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Credit batch not found")
        
    if batch.status != CreditStatus.listed:
        raise HTTPException(status_code=400, detail="Credit batch is not listed for sale")
        
    requested_dec = Decimal(str(checkout_in.tonnes_requested))
    if requested_dec <= 0:
        raise HTTPException(status_code=400, detail="Must request more than 0 tonnes")
        
    if requested_dec > batch.available_tco2e:
        raise HTTPException(status_code=400, detail="Not enough tonnes available in this batch")
        
    # Calculate semantics: buyer pays for T, receives 0.85T, 0.15T to buffer
    buffer_amount = round(requested_dec * Decimal("0.15"), 3)
    net_delivered = requested_dec - buffer_amount
    total_price = round(requested_dec * batch.price_per_tonne, 2)
    
    # Decrement inventory
    batch.available_tco2e -= requested_dec
    if batch.available_tco2e <= 0:
        batch.status = CreditStatus.sold_out
        
    if batch.delivery_type.value == "issued":
        payment_status = PaymentStatus.completed
    else:
        payment_status = PaymentStatus.partially_paid # 30% upfront
        
    transaction = Transaction(
        buyer_id=current_user.id,
        batch_id=batch.id,
        tonnes_purchased=requested_dec,
        buffer_tonnes=buffer_amount,
        net_tonnes=net_delivered,
        total_price=total_price,
        payment_status=payment_status,
        milestones=calculate_milestones(batch.delivery_type.value),
        buffer_pool_allocation=buffer_amount
    )
    
    db.add(transaction)
    db.flush() # get transaction id
    
    from app.models.buffer_ledger import BufferLedger, BufferStatus
    buffer_entry = BufferLedger(
        transaction_id=transaction.id,
        tonnes=buffer_amount,
        status=BufferStatus.pending,
        notes="From checkout"
    )
    db.add(buffer_entry)
    
    db.commit()
    db.refresh(transaction)
    
    return transaction

@router.get("", response_model=List[TransactionResponse])
def get_transactions(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.require_role([UserRole.buyer.value, UserRole.admin.value]))
) -> Any:
    if current_user.role == UserRole.admin:
        transactions = db.query(Transaction).all()
    else:
        transactions = db.query(Transaction).filter(Transaction.buyer_id == current_user.id).all()
    return transactions
