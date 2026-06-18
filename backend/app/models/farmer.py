import uuid
from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Float, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class Gender(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    gender = Column(Enum(Gender), nullable=True)
    age = Column(Integer, nullable=True)
    household_size = Column(Integer, nullable=True)
    farm_size_total = Column(Float, nullable=True)
    primary_crops = Column(ARRAY(String), nullable=True)
    profile_image_url = Column(String, nullable=True)

    # Relationships
    user = relationship("User", back_populates="farmer_profile")
    farms = relationship("Farm", back_populates="farmer")
