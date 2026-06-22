import uuid
from sqlalchemy import Column, String, Boolean, Float, DateTime, Enum, Text, func
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class UserRole(str, enum.Enum):
    farmer = "farmer"
    extension_officer = "extension_officer"
    ngo = "ngo"
    researcher = "researcher"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String(255), nullable=False)
    phone = Column(String(20), unique=True, nullable=False, index=True)
    email = Column(String(255), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.farmer, nullable=False)
    password_hash = Column(String(255), nullable=False)
    county = Column(String(100), nullable=True)
    payam = Column(String(100), nullable=True)
    boma = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    language_pref = Column(String(10), default='en')
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    farmer_profile = relationship("Farmer", back_populates="user", uselist=False)
