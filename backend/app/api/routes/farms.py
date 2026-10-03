from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api import deps
from app.models.user import User, UserRole
from app.models.farm import Farm
from app.schemas.farm import FarmCreate, FarmResponse
from app.services.geo import geojson_to_wkt, wkb_to_geojson

router = APIRouter()

@router.post("", response_model=FarmResponse)
def create_farm(
    farm_in: FarmCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.require_role([UserRole.aggregator.value]))
) -> Any:
    try:
        wkt_polygon = geojson_to_wkt(farm_in.geojson)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    farm = Farm(
        aggregator_id=current_user.id,
        farmer_name=farm_in.farmer_name,
        polygon=func.ST_GeomFromText(wkt_polygon, 4326),
        total_hectares=farm_in.total_hectares,
        crop_type=farm_in.crop_type,
    )
    db.add(farm)
    db.commit()
    db.refresh(farm)
    
    # Reload from DB to get the WKB polygon
    db_farm = db.query(Farm).filter(Farm.id == farm.id).first()
    
    return FarmResponse(
        id=db_farm.id,
        aggregator_id=db_farm.aggregator_id,
        farmer_name=db_farm.farmer_name,
        total_hectares=db_farm.total_hectares,
        crop_type=db_farm.crop_type,
        created_at=db_farm.created_at,
        geojson=wkb_to_geojson(db_farm.polygon)
    )

@router.get("", response_model=List[FarmResponse])
def get_farms(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.require_role([UserRole.aggregator.value]))
) -> Any:
    farms = db.query(Farm).filter(Farm.aggregator_id == current_user.id).all()
    
    return [
        FarmResponse(
            id=f.id,
            aggregator_id=f.aggregator_id,
            farmer_name=f.farmer_name,
            total_hectares=f.total_hectares,
            crop_type=f.crop_type,
            created_at=f.created_at,
            geojson=wkb_to_geojson(f.polygon)
        )
        for f in farms
    ]
