import uuid
from sqlalchemy import Column, String, ForeignKey, Float, DateTime, Text, func
from app.database import Base
import enum

class SeverityLevel(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class DiseaseReport(Base):
    __tablename__ = "disease_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    farmer_id = Column(String(36), ForeignKey("farmers.id"), nullable=False)
    farm_id = Column(String(36), ForeignKey("farms.id"), nullable=True)
    crop_type = Column(String(100), nullable=False)
    image_url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500), nullable=True)
    prediction = Column(String(255), nullable=False)
    confidence = Column(Float, nullable=False)
    severity = Column(Enum(SeverityLevel), nullable=False)
    recommendation = Column(Text, nullable=True)
    preventive_measures = Column(Text, nullable=True)
    model_version = Column(String(50), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
