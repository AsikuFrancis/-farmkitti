import uuid
from sqlalchemy import Column, Integer, String, ForeignKey, Float, Text, Uuid
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class Gender(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    gender = Column(String(50), nullable=True)
    age = Column(Integer, nullable=True)
    household_size = Column(Integer, nullable=True)
    farm_size_total = Column(Float, nullable=True)
    primary_crops = Column(Text, nullable=True)  # Store as JSON string
    profile_image_url = Column(String(500), nullable=True)

    # Relationships
    user = relationship("User", back_populates="farmer_profile")
    farms = relationship("Farm", back_populates="farmer")
