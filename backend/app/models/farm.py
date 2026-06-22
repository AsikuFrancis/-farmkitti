import uuid
from sqlalchemy import Column, String, ForeignKey, Float, DateTime, Boolean, Date, JSON, func
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class CropStatus(str, enum.Enum):
    planned = "planned"
    planted = "planted"
    growing = "growing"
    harvested = "harvested"

class Farm(Base):
    __tablename__ = "farms"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    farmer_id = Column(String(36), ForeignKey("farmers.id"), nullable=False)
    farm_name = Column(String(255), nullable=False)
    size = Column(Float, nullable=False)  # in hectares
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    boundary_geojson = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    farmer = relationship("Farmer", back_populates="farms")
    crops = relationship("Crop", back_populates="farm")


class Crop(Base):
    __tablename__ = "crops"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    farm_id = Column(String(36), ForeignKey("farms.id"), nullable=False)
    crop_type = Column(String(100), nullable=False)
    planting_date = Column(Date, nullable=False)
    expected_harvest_date = Column(Date, nullable=True)
    actual_harvest_date = Column(Date, nullable=True)
    irrigation_type = Column(String(50), nullable=True)
    soil_type = Column(String(50), nullable=True)
    status = Column(Enum(CropStatus), default=CropStatus.planted)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    farm = relationship("Farm", back_populates="crops")
