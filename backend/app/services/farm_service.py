from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from uuid import UUID

from app.models.farm import Farm, Crop
from app.schemas.farm import FarmCreate, FarmUpdate, CropCreate, CropUpdate

async def get_farm(db: AsyncSession, farm_id: UUID) -> Optional[Farm]:
    stmt = select(Farm).options(selectinload(Farm.crops)).where(Farm.id == farm_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

async def get_farms_by_farmer(db: AsyncSession, farmer_id: UUID) -> List[Farm]:
    stmt = select(Farm).options(selectinload(Farm.crops)).where(Farm.farmer_id == farmer_id)
    result = await db.execute(stmt)
    return result.scalars().all()

async def create_farm(db: AsyncSession, farm_in: FarmCreate, farmer_id: UUID) -> Farm:
    db_obj = Farm(
        farmer_id=farmer_id,
        farm_name=farm_in.farm_name,
        size=farm_in.size,
        latitude=farm_in.latitude,
        longitude=farm_in.longitude,
        boundary_geojson=farm_in.boundary_geojson
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def update_farm(db: AsyncSession, db_obj: Farm, farm_in: FarmUpdate) -> Farm:
    update_data = farm_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def delete_farm(db: AsyncSession, db_obj: Farm) -> Farm:
    # Soft delete
    db_obj.is_active = False
    db.add(db_obj)
    await db.commit()
    return db_obj

async def create_crop(db: AsyncSession, crop_in: CropCreate, farm_id: UUID) -> Crop:
    db_obj = Crop(
        farm_id=farm_id,
        crop_type=crop_in.crop_type,
        planting_date=crop_in.planting_date,
        expected_harvest_date=crop_in.expected_harvest_date,
        actual_harvest_date=crop_in.actual_harvest_date,
        irrigation_type=crop_in.irrigation_type,
        soil_type=crop_in.soil_type,
        status=crop_in.status
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def update_crop(db: AsyncSession, db_obj: Crop, crop_in: CropUpdate) -> Crop:
    update_data = crop_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def get_crop(db: AsyncSession, crop_id: UUID) -> Optional[Crop]:
    stmt = select(Crop).where(Crop.id == crop_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()
