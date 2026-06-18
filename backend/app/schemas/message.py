from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID

class MessageBase(BaseModel):
    content: str
    image_url: Optional[str] = None

class MessageCreate(MessageBase):
    receiver_id: UUID

class Message(MessageBase):
    id: UUID
    sender_id: UUID
    receiver_id: UUID
    is_read: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
