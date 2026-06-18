from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import Dict, Any

from app.models.user import User
from app.models.farmer import Farmer
from app.models.farm import Farm
from app.models.disease import DiseaseReport
from app.schemas.analytics import AnalyticsDashboardResponse, RegionStats, CropStats, DiseaseStats

async def generate_dashboard_metrics(db: AsyncSession) -> AnalyticsDashboardResponse:
    """
    Generate agricultural analytics for NGOs and Government bodies.
    For the MVP, this returns mock data structured properly, but the 
    queries are mapped out for future implementation.
    """
    
    # In a fully populated DB, we would do:
    # farmers_count = await db.scalar(select(func.count(Farmer.id)))
    # farms_count = await db.scalar(select(func.count(Farm.id)))
    
    # Returning mock data representing South Sudan regions for MVP dashboard
    return AnalyticsDashboardResponse(
        total_farmers_onboarded=12450,
        total_farms_registered=15200,
        total_land_area_hectares=45600.5,
        active_regions=10,
        regional_breakdown=[
            RegionStats(region="Central Equatoria", total_farmers=4500, total_farms=5100, total_area_hectares=15300),
            RegionStats(region="Eastern Equatoria", total_farmers=3200, total_farms=3900, total_area_hectares=11700),
            RegionStats(region="Western Bahr el Ghazal", total_farmers=2800, total_farms=3500, total_area_hectares=10500),
            RegionStats(region="Other", total_farmers=1950, total_farms=2700, total_area_hectares=8100.5)
        ],
        crop_distribution=[
            CropStats(crop_type="Maize", total_area_hectares=22800, percentage=50.0),
            CropStats(crop_type="Sorghum", total_area_hectares=13680, percentage=30.0),
            CropStats(crop_type="Cassava", total_area_hectares=6840, percentage=15.0),
            CropStats(crop_type="Beans", total_area_hectares=2280.5, percentage=5.0)
        ],
        recent_disease_outbreaks=[
            DiseaseStats(
                disease_name="Fall Armyworm", 
                reported_cases=342, 
                severity_distribution={"low": 42, "medium": 150, "high": 100, "critical": 50}
            ),
            DiseaseStats(
                disease_name="Cassava Mosaic Disease", 
                reported_cases=128, 
                severity_distribution={"low": 10, "medium": 48, "high": 70, "critical": 0}
            )
        ]
    )
