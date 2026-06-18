from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class MessageBase(BaseModel):
    content: str
    image_url: Optional[str] = None

class MessageCreate(MessageBase):
    receiver_id: str

class Message(MessageBase):
    id: str
    sender_id: str
    receiver_id: str
    is_read: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
