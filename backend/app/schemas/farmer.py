from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.models.farmer import Gender

class FarmerBase(BaseModel):
    gender: Optional[Gender] = None
    age: Optional[int] = None
    household_size: Optional[int] = None
    farm_size_total: Optional[float] = None
    primary_crops: Optional[str] = None  # JSON string
    profile_image_url: Optional[str] = None

class FarmerCreate(FarmerBase):
    pass

class FarmerUpdate(FarmerBase):
    pass

class FarmerInDBBase(FarmerBase):
    id: str
    user_id: str
    
    model_config = ConfigDict(from_attributes=True)

class Farmer(FarmerInDBBase):
    pass
