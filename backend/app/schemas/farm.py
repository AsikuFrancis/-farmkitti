from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from app.models.farm import CropStatus

class CropBase(BaseModel):
    crop_type: str
    planting_date: date
    expected_harvest_date: Optional[date] = None
    actual_harvest_date: Optional[date] = None
    irrigation_type: Optional[str] = None
    soil_type: Optional[str] = None
    status: CropStatus = CropStatus.planned

class CropCreate(CropBase):
    pass

class CropUpdate(CropBase):
    crop_type: Optional[str] = None
    planting_date: Optional[date] = None
    status: Optional[str] = None

class CropInDBBase(CropBase):
    id: str
    farm_id: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class Crop(CropInDBBase):
    pass

class FarmBase(BaseModel):
    farm_name: str
    size: float
    latitude: float
    longitude: float
    boundary_geojson: Optional[Dict[str, Any]] = None

class FarmCreate(FarmBase):
    pass

class FarmUpdate(FarmBase):
    farm_name: Optional[str] = None
    size: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_active: Optional[bool] = None

class FarmInDBBase(FarmBase):
    id: str
    farmer_id: str
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class Farm(FarmInDBBase):
    crops: List[Crop] = []
