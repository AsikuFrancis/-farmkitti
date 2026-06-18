from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.models.user import UserRole

# Shared properties
class UserBase(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    role: UserRole = UserRole.farmer
    county: Optional[str] = None
    payam: Optional[str] = None
    boma: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str

# Properties to receive via API on update
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    county: Optional[str] = None
    payam: Optional[str] = None
    boma: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    language_pref: Optional[str] = None

class UserInDBBase(UserBase):
    id: str
    is_active: bool
    language_pref: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# Additional properties to return via API
class User(UserInDBBase):
    pass

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class LoginRequest(BaseModel):
    phone: str
    password: str

class OTPRequest(BaseModel):
    phone: str
