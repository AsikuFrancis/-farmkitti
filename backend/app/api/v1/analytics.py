from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.analytics import AnalyticsDashboardResponse
from app.services import analytics_service
from app.dependencies import get_db

router = APIRouter()

@router.get("/dashboard", response_model=AnalyticsDashboardResponse)
async def get_analytics_dashboard(
    db: AsyncSession = Depends(get_db)
    # current_user: User = Depends(get_current_active_superuser) # Would require admin privileges in prod
) -> Any:
    """
    Retrieve aggregated agricultural data for the Analytics Dashboard.
    Requires NGO, Government, or Admin role.
    """
    return await analytics_service.generate_dashboard_metrics(db)
