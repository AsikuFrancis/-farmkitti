from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.services import erp_sync_service
from app.dependencies import get_db

router = APIRouter()

@router.post("/trigger")
async def trigger_erp_sync(
    db: AsyncSession = Depends(get_db)
    # current_user: User = Depends(get_current_active_superuser) # Protect this in production
) -> Any:
    """
    Manually triggers a full synchronization of Farmkitti data to the ERPNext backend.
    """
    result = await erp_sync_service.run_full_sync(db)
    return result
