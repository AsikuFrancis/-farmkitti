from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.farmer import Farmer, FarmerCreate, FarmerUpdate
from app.services import farmer_service
from app.dependencies import get_db
from app.models.user import User

# Mock dependency for getting current user for now
async def get_current_user_mock() -> User:
    # In a real implementation, this would validate JWT and return the user from DB
    from uuid import uuid4
    return User(id=uuid4(), phone="1234567890", full_name="Mock User")

router = APIRouter()

@router.post("/", response_model=Farmer, status_code=status.HTTP_201_CREATED)
async def create_farmer_profile(
    farmer_in: FarmerCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_mock)
) -> Any:
    """
    Create a farmer profile for the current user.
    """
    farmer = await farmer_service.get_farmer_by_user_id(db, user_id=current_user.id)
    if farmer:
        raise HTTPException(
            status_code=400,
            detail="Farmer profile already exists for this user.",
        )
    farmer = await farmer_service.create_farmer(db, farmer_in=farmer_in, user_id=current_user.id)
    return farmer

@router.get("/me", response_model=Farmer)
async def get_my_farmer_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_mock)
) -> Any:
    """
    Get current user's farmer profile.
    """
    farmer = await farmer_service.get_farmer_by_user_id(db, user_id=current_user.id)
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer profile not found")
    return farmer

@router.put("/me", response_model=Farmer)
async def update_my_farmer_profile(
    farmer_in: FarmerUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_mock)
) -> Any:
    """
    Update current user's farmer profile.
    """
    farmer = await farmer_service.get_farmer_by_user_id(db, user_id=current_user.id)
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer profile not found")
    
    farmer = await farmer_service.update_farmer(db, db_obj=farmer, farmer_in=farmer_in)
    return farmer
