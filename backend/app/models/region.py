import uuid
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geometry

from app.db.base_class import Base

class Region(Base):
    __tablename__ = "regions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    geometry = Column(Geometry('MULTIPOLYGON', srid=4326), nullable=False)
