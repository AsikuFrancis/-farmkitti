from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, and_
from uuid import UUID
from typing import List

from app.models.message import Message
from app.schemas.message import MessageCreate

async def send_message(db: AsyncSession, message_in: MessageCreate, sender_id: UUID) -> Message:
    db_obj = Message(**message_in.model_dump(), sender_id=sender_id)
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def get_conversation(db: AsyncSession, user1_id: UUID, user2_id: UUID) -> List[Message]:
    stmt = select(Message).where(
        or_(
            and_(Message.sender_id == user1_id, Message.receiver_id == user2_id),
            and_(Message.sender_id == user2_id, Message.receiver_id == user1_id)
        )
    ).order_by(Message.created_at.asc())
    
    result = await db.execute(stmt)
    return result.scalars().all()

async def get_inbox(db: AsyncSession, user_id: UUID) -> List[Message]:
    # Very basic inbox fetch (latest messages received or sent)
    # In a real app, this would be a complex query to get unique conversations
    stmt = select(Message).where(
        or_(Message.sender_id == user_id, Message.receiver_id == user_id)
    ).order_by(Message.created_at.desc())
    
    result = await db.execute(stmt)
    return result.scalars().all()
