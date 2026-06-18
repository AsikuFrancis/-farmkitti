from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.schemas.farm import Farm, FarmCreate, FarmUpdate, Crop, CropCreate, CropUpdate
from app.services import farm_service, farmer_service
from app.dependencies import get_db
from app.models.user import User

# Mock dependency for getting current user for now
async def get_current_user_mock() -> User:
    # In a real implementation, this would validate JWT and return the user from DB
    from uuid import uuid4
    return User(id=uuid4(), phone="1234567890", full_name="Mock User")

router = APIRouter()

@router.post("/", response_model=Farm, status_code=status.HTTP_201_CREATED)
async def create_farm(
    farm_in: FarmCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_mock)
) -> Any:
    """
    Create a new farm for the current user.
    """
    farmer = await farmer_service.get_farmer_by_user_id(db, user_id=current_user.id)
    if not farmer:
        raise HTTPException(
            status_code=400,
            detail="Farmer profile not found. Please create a farmer profile first.",
        )
    farm = await farm_service.create_farm(db, farm_in=farm_in, farmer_id=farmer.id)
    return farm

@router.get("/", response_model=List[Farm])
async def get_farms(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_mock)
) -> Any:
    """
    Retrieve all farms for the current user.
    """
    farmer = await farmer_service.get_farmer_by_user_id(db, user_id=current_user.id)
    if not farmer:
        return []
    farms = await farm_service.get_farms_by_farmer(db, farmer_id=farmer.id)
    return farms

@router.get("/{farm_id}", response_model=Farm)
async def get_farm(
    farm_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_mock)
) -> Any:
    """
    Get a specific farm by ID.
    """
    farm = await farm_service.get_farm(db, farm_id=farm_id)
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
        
    farmer = await farmer_service.get_farmer_by_user_id(db, user_id=current_user.id)
    if not farmer or farm.farmer_id != farmer.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    return farm

@router.post("/{farm_id}/crops", response_model=Crop, status_code=status.HTTP_201_CREATED)
async def add_crop_to_farm(
    farm_id: UUID,
    crop_in: CropCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_mock)
) -> Any:
    """
    Add a crop to a specific farm.
    """
    farm = await farm_service.get_farm(db, farm_id=farm_id)
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
        
    farmer = await farmer_service.get_farmer_by_user_id(db, user_id=current_user.id)
    if not farmer or farm.farmer_id != farmer.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    crop = await farm_service.create_crop(db, crop_in=crop_in, farm_id=farm_id)
    return crop
