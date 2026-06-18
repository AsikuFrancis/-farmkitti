from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.models.farmer import Gender

class FarmerBase(BaseModel):
    gender: Optional[Gender] = None
    age: Optional[int] = None
    household_size: Optional[int] = None
    farm_size_total: Optional[float] = None
    primary_crops: Optional[List[str]] = None
    profile_image_url: Optional[str] = None

class FarmerCreate(FarmerBase):
    pass

class FarmerUpdate(FarmerBase):
    pass

class FarmerInDBBase(FarmerBase):
    id: UUID
    user_id: UUID
    
    model_config = ConfigDict(from_attributes=True)

class Farmer(FarmerInDBBase):
    pass
