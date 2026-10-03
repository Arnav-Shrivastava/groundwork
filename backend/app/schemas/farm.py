from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from uuid import UUID
from datetime import datetime

class FarmCreate(BaseModel):
    farmer_name: str
    total_hectares: float
    crop_type: str
    geojson: Dict[str, Any] = Field(..., description="GeoJSON Feature or FeatureCollection representing the farm boundary")

class FarmResponse(BaseModel):
    id: UUID
    aggregator_id: UUID
    farmer_name: str
    total_hectares: float
    crop_type: str
    created_at: datetime
    geojson: Dict[str, Any] = Field(..., description="GeoJSON representation of the farm polygon")

    class Config:
        from_attributes = True
