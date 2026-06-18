from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Dict, Any

from app.models.farmer import Farmer
from app.models.farm import Farm
from app.services.erpnext_client import erp_client

async def sync_new_farmers_to_erp(db: AsyncSession) -> Dict[str, Any]:
    """
    Finds farmers that haven't been synced to ERPNext and syncs them.
    For the MVP, we just fetch all farmers and mock the sync.
    """
    # In a real app, add a `synced_to_erp` boolean to the Farmer model.
    stmt = select(Farmer)
    result = await db.execute(stmt)
    farmers = result.scalars().all()
    
    synced_count = 0
    for farmer in farmers:
        farmer_data = {
            "id": farmer.id,
            "full_name": farmer.full_name,
            "phone_number": farmer.user.phone if farmer.user else None,
            "location": farmer.location
        }
        await erp_client.create_farmer(farmer_data)
        synced_count += 1
        
    return {"status": "success", "farmers_synced": synced_count}

async def sync_new_farms_to_erp(db: AsyncSession) -> Dict[str, Any]:
    stmt = select(Farm)
    result = await db.execute(stmt)
    farms = result.scalars().all()
    
    synced_count = 0
    for farm in farms:
        farm_data = {
            "id": farm.id,
            "farm_name": farm.farm_name,
            "size": farm.size,
            "latitude": farm.latitude,
            "longitude": farm.longitude
        }
        await erp_client.create_farm(farm_data)
        synced_count += 1
        
    return {"status": "success", "farms_synced": synced_count}

async def run_full_sync(db: AsyncSession) -> Dict[str, Any]:
    """
    Runs a full sync of all entities to ERPNext.
    """
    farmers_res = await sync_new_farmers_to_erp(db)
    farms_res = await sync_new_farms_to_erp(db)
    
    return {
        "status": "success",
        "details": {
            "farmers": farmers_res,
            "farms": farms_res
        }
    }
