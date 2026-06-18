from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.schemas.disease import DiseaseReport, DiseaseReportCreate
from app.services import disease_service, farmer_service
from app.dependencies import get_db
from app.models.user import User

# Mock dependency for getting current user for now
async def get_current_user_mock() -> User:
    from uuid import uuid4
    return User(id=uuid4(), phone="1234567890", full_name="Mock User")

router = APIRouter()

@router.post("/detect", response_model=DiseaseReport, status_code=status.HTTP_201_CREATED)
async def detect_disease(
    file: UploadFile = File(...),
    crop_type: str = Form(...),
    farm_id: Optional[UUID] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_mock)
) -> Any:
    """
    Upload an image of a crop to detect diseases using AI.
    """
    farmer = await farmer_service.get_farmer_by_user_id(db, user_id=current_user.id)
    if not farmer:
        raise HTTPException(
            status_code=400,
            detail="Farmer profile not found. Please create a farmer profile first.",
        )
    
    # Read file content
    image_bytes = await file.read()
    
    report_in = DiseaseReportCreate(
        farm_id=farm_id,
        crop_type=crop_type,
        latitude=latitude,
        longitude=longitude
    )
    
    report = await disease_service.process_disease_detection(
        db=db,
        farmer_id=farmer.id,
        report_in=report_in,
        image_bytes=image_bytes,
        filename=file.filename or "upload.jpg"
    )
    
    return report

@router.get("/reports", response_model=List[DiseaseReport])
async def get_disease_reports(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_mock)
) -> Any:
    """
    Retrieve all disease reports for the current user.
    """
    farmer = await farmer_service.get_farmer_by_user_id(db, user_id=current_user.id)
    if not farmer:
        return []
        
    reports = await disease_service.get_disease_reports_by_farmer(db, farmer_id=farmer.id)
    return reports
