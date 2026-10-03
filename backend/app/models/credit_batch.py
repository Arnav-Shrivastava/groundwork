import enum
import uuid
from datetime import datetime

from geoalchemy2 import Geometry
from sqlalchemy import Column, DateTime, Enum, ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class CreditStandard(str, enum.Enum):
    verra = "verra"
    gold_standard = "gold_standard"


class CreditStatus(str, enum.Enum):
    draft = "draft"
    listed = "listed"
    sold_out = "sold_out"
    retired = "retired"


class DeliveryType(str, enum.Enum):
    issued = "issued"
    forward = "forward"


class CreditBatch(Base):
    __tablename__ = "credit_batches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    aggregator_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    farm_ids = Column(ARRAY(UUID(as_uuid=True)), nullable=False)
    standard = Column(Enum(CreditStandard), nullable=False)
    delivery_type = Column(
        Enum(DeliveryType), default=DeliveryType.issued, nullable=False
    )
    vintage_year = Column(String, nullable=False)

    total_tco2e = Column(Numeric(14, 3), nullable=False)
    available_tco2e = Column(Numeric(14, 3), nullable=False)
    price_per_tonne = Column(Numeric(14, 2), nullable=False)

    status = Column(Enum(CreditStatus), default=CreditStatus.draft, nullable=False)
    co_benefits = Column(JSONB, default=list, nullable=False)

    scope_3_region = Column(String, nullable=True)
    scope_3_geom = Column(Geometry("MULTIPOLYGON", srid=4326), nullable=True)
    registry_serial_id = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    aggregator = relationship("User", backref="credit_batches")
