from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID

from app.models.farmer import Farmer
from app.schemas.farmer import FarmerCreate, FarmerUpdate

async def get_farmer_by_user_id(db: AsyncSession, user_id: UUID) -> Optional[Farmer]:
    stmt = select(Farmer).where(Farmer.user_id == user_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

async def create_farmer(db: AsyncSession, farmer_in: FarmerCreate, user_id: UUID) -> Farmer:
    db_obj = Farmer(
        user_id=user_id,
        gender=farmer_in.gender.value if hasattr(farmer_in.gender, 'value') else farmer_in.gender,
        age=farmer_in.age,
        household_size=farmer_in.household_size,
        farm_size_total=farmer_in.farm_size_total,
        primary_crops=farmer_in.primary_crops,
        profile_image_url=farmer_in.profile_image_url
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def update_farmer(db: AsyncSession, db_obj: Farmer, farmer_in: FarmerUpdate) -> Farmer:
    update_data = farmer_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def get_farmers(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Farmer]:
    stmt = select(Farmer).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()
