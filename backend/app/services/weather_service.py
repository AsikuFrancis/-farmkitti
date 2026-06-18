import httpx
from typing import Optional, List, Dict, Any
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.schemas.weather import WeatherForecastResponse, WeatherForecastDaily
from app.models.weather import WeatherData

# Example Open-Meteo API endpoint
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

async def fetch_weather_from_api(lat: float, lon: float) -> Dict[str, Any]:
    """
    Fetches 7-day forecast from Open-Meteo.
    """
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m,wind_speed_10m",
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
        "timezone": "Africa/Juba"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(OPEN_METEO_URL, params=params)
        response.raise_for_status()
        return response.json()

async def get_weather_forecast(
    db: AsyncSession, 
    latitude: float, 
    longitude: float, 
    county: str = "Unknown"
) -> WeatherForecastResponse:
    """
    Get weather forecast for a location. 
    In production, we would check DB cache first. 
    For MVP, we fetch directly from API to ensure it works.
    """
    try:
        data = await fetch_weather_from_api(latitude, longitude)
        
        current = data.get("current", {})
        daily = data.get("daily", {})
        
        forecasts = []
        if daily and "time" in daily:
            for i in range(len(daily["time"])):
                forecasts.append(
                    WeatherForecastDaily(
                        date=date.fromisoformat(daily["time"][i]),
                        temperature_max=daily["temperature_2m_max"][i],
                        temperature_min=daily["temperature_2m_min"][i],
                        precipitation_sum=daily["precipitation_sum"][i],
                        wind_speed_max=daily["wind_speed_10m_max"][i]
                    )
                )
                
        return WeatherForecastResponse(
            latitude=latitude,
            longitude=longitude,
            county=county,
            current_temperature=current.get("temperature_2m"),
            current_humidity=current.get("relative_humidity_2m"),
            current_wind_speed=current.get("wind_speed_10m"),
            daily_forecasts=forecasts
        )
    except Exception as e:
        # Fallback to mock data if API fails or offline
        return get_mock_weather_forecast(latitude, longitude, county)

def get_mock_weather_forecast(latitude: float, longitude: float, county: str) -> WeatherForecastResponse:
    from datetime import timedelta
    today = date.today()
    return WeatherForecastResponse(
        latitude=latitude,
        longitude=longitude,
        county=county,
        current_temperature=28.5,
        current_humidity=65.0,
        current_wind_speed=12.5,
        daily_forecasts=[
            WeatherForecastDaily(
                date=today + timedelta(days=i),
                temperature_max=32.0 + (i % 3),
                temperature_min=22.0 + (i % 2),
                precipitation_sum=5.0 if i % 2 == 0 else 0.0,
                wind_speed_max=15.0
            ) for i in range(7)
        ]
    )
