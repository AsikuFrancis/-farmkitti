import uuid
from sqlalchemy import Column, String, ForeignKey, Float, DateTime, Enum, Text, func
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import enum

class SeverityLevel(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class DiseaseReport(Base):
    __tablename__ = "disease_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farmer_id = Column(UUID(as_uuid=True), ForeignKey("farmers.id"), nullable=False)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id"), nullable=True)
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
