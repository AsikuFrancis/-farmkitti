import uuid
from sqlalchemy import Column, String, Float, DateTime, Date, func
from app.database import Base

class WeatherData(Base):
    __tablename__ = "weather_data"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    county = Column(String(100), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    temperature_max = Column(Float, nullable=False)
    temperature_min = Column(Float, nullable=False)
    rainfall = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    forecast_date = Column(Date, nullable=False, index=True)
    fetched_at = Column(DateTime(timezone=True), server_default=func.now())
