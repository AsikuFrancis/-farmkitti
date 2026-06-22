from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.disease import SeverityLevel

class DiseaseReportBase(BaseModel):
    farm_id: Optional[str] = None
    crop_type: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class DiseaseReportCreate(DiseaseReportBase):
    pass

class DiseaseReportInDBBase(DiseaseReportBase):
    id: str
    farmer_id: str
    image_url: str
    thumbnail_url: Optional[str] = None
    prediction: str
    confidence: float
    severity: SeverityLevel
    recommendation: Optional[str] = None
    preventive_measures: Optional[str] = None
    model_version: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class DiseaseReport(DiseaseReportInDBBase):
    pass
