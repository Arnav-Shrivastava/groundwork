import uuid
from datetime import datetime

from geoalchemy2 import Geometry
from sqlalchemy import Column, DateTime, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Farm(Base):
    __tablename__ = "farms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    aggregator_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    farmer_name = Column(String, nullable=False)
    polygon = Column(Geometry("MULTIPOLYGON", srid=4326), nullable=False)
    total_hectares = Column(Float, nullable=False)
    crop_type = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    aggregator = relationship("User", backref="farms")
