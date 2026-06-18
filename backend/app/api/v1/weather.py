from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.weather import WeatherForecastResponse
from app.services import weather_service, farmer_service
from app.dependencies import get_db
from app.models.user import User

async def get_current_user_mock() -> User:
    from uuid import uuid4
    return User(id=uuid4(), phone="1234567890", full_name="Mock User")

router = APIRouter()

@router.get("/forecast", response_model=WeatherForecastResponse)
async def get_forecast(
    latitude: float,
    longitude: float,
    county: str = "Unknown",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_mock)
) -> Any:
    """
    Get a 7-day weather forecast for a specific location.
    """
    forecast = await weather_service.get_weather_forecast(
        db=db,
        latitude=latitude,
        longitude=longitude,
        county=county
    )
    return forecast
