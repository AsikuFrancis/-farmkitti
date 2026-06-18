from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.schemas.message import Message, MessageCreate
from app.services import messaging_service
from app.dependencies import get_db
from app.models.user import User

async def get_current_user_mock() -> User:
    from uuid import uuid4
    return User(id=uuid4(), phone="1234567890", full_name="Mock User")

router = APIRouter()

@router.post("/", response_model=Message)
async def send_message(
    message_in: MessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_mock)
) -> Any:
    return await messaging_service.send_message(db, message_in, current_user.id)

@router.get("/inbox", response_model=List[Message])
async def get_inbox(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_mock)
) -> Any:
    return await messaging_service.get_inbox(db, current_user.id)

@router.get("/conversation/{other_user_id}", response_model=List[Message])
async def get_conversation(
    other_user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_mock)
) -> Any:
    return await messaging_service.get_conversation(db, current_user.id, other_user_id)
