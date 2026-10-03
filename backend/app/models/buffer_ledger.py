import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class BufferStatus(str, enum.Enum):
    pending = "pending"
    active = "active"
    retired = "retired"


class BufferLedger(Base):
    __tablename__ = "buffer_ledger"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    transaction_id = Column(
        UUID(as_uuid=True), ForeignKey("transactions.id"), nullable=False
    )
    tonnes = Column(Numeric(14, 3), nullable=False)
    status = Column(Enum(BufferStatus), default=BufferStatus.pending, nullable=False)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    transaction = relationship("Transaction", backref="buffer_entries")
