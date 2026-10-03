import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    partially_paid = "partially_paid"
    completed = "completed"


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    batch_id = Column(
        UUID(as_uuid=True), ForeignKey("credit_batches.id"), nullable=False
    )

    tonnes_purchased = Column(Numeric(14, 3), nullable=False)
    buffer_tonnes = Column(Numeric(14, 3), nullable=False)
    net_tonnes = Column(Numeric(14, 3), nullable=False)
    total_price = Column(Numeric(14, 2), nullable=False)

    payment_status = Column(
        Enum(PaymentStatus), default=PaymentStatus.pending, nullable=False
    )
    milestones = Column(JSONB, nullable=False)  # Array of milestone objects
    buffer_pool_allocation = Column(
        Numeric(14, 3), nullable=False
    )  # Redundant with buffer_tonnes for clarity, per spec

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    buyer = relationship("User", backref="transactions")
    batch = relationship("CreditBatch", backref="transactions")
