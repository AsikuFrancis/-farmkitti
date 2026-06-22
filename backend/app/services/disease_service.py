from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
import uuid

from app.models.disease import DiseaseReport
from app.schemas.disease import DiseaseReportCreate
from app.ai.disease_model import disease_model
from app.ai.recommendation_engine import get_recommendation

async def save_image_to_storage(image_bytes: bytes, filename: str) -> str:
    """
    Mock saving image to MinIO/S3.
    Returns a mock URL.
    """
    # In production, use boto3 to upload to MinIO and return the public/presigned URL.
    return f"https://mock-storage.farmkiti.com/images/{filename}"

async def process_disease_detection(
    db: AsyncSession, 
    farmer_id: UUID, 
    report_in: DiseaseReportCreate, 
    image_bytes: bytes,
    filename: str
) -> DiseaseReport:
    # 1. Run AI Inference
    prediction, confidence = disease_model.predict(image_bytes)
    
    # 2. Get Recommendations
    rec_data = get_recommendation(prediction)
    
    # 3. Save Image
    image_url = await save_image_to_storage(image_bytes, filename)
    
    # 4. Save to Database
    db_obj = DiseaseReport(
        farmer_id=farmer_id,
        farm_id=report_in.farm_id,
        crop_type=report_in.crop_type,
        latitude=report_in.latitude,
        longitude=report_in.longitude,
        image_url=image_url,
        prediction=prediction,
        confidence=confidence,
        severity=rec_data["severity"].value if hasattr(rec_data["severity"], 'value') else rec_data["severity"],
        recommendation=rec_data["recommendation"],
        preventive_measures=rec_data["preventive_measures"],
        model_version=disease_model.version
    )
    
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    
    return db_obj

async def get_disease_reports_by_farmer(db: AsyncSession, farmer_id: UUID) -> List[DiseaseReport]:
    stmt = select(DiseaseReport).where(DiseaseReport.farmer_id == farmer_id).order_by(DiseaseReport.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()
