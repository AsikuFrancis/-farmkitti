from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import date, datetime
from uuid import UUID

class WeatherForecastDaily(BaseModel):
    date: date
    temperature_max: float
    temperature_min: float
    precipitation_sum: float
    wind_speed_max: float

class WeatherForecastResponse(BaseModel):
    latitude: float
    longitude: float
    county: str
    current_temperature: Optional[float] = None
    current_humidity: Optional[float] = None
    current_wind_speed: Optional[float] = None
    daily_forecasts: List[WeatherForecastDaily]

class WeatherDataInDB(BaseModel):
    id: UUID
    county: str
    latitude: float
    longitude: float
    temperature_max: float
    temperature_min: float
    rainfall: Optional[float] = None
    humidity: Optional[float] = None
    wind_speed: Optional[float] = None
    forecast_date: date
    fetched_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
