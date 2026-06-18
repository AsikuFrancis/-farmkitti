from pydantic import BaseModel
from typing import List, Dict, Any

class RegionStats(BaseModel):
    region: str
    total_farmers: int
    total_farms: int
    total_area_hectares: float

class CropStats(BaseModel):
    crop_type: str
    total_area_hectares: float
    percentage: float

class DiseaseStats(BaseModel):
    disease_name: str
    reported_cases: int
    severity_distribution: Dict[str, int]

class AnalyticsDashboardResponse(BaseModel):
    total_farmers_onboarded: int
    total_farms_registered: int
    total_land_area_hectares: float
    active_regions: int
    regional_breakdown: List[RegionStats]
    crop_distribution: List[CropStats]
    recent_disease_outbreaks: List[DiseaseStats]
