from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ChatMessageBase(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatMessageCreate(BaseModel):
    message: str
    language: Optional[str] = "en" # "en", "sw", "apd"

class ChatMessage(ChatMessageBase):
    timestamp: datetime
    
    class Config:
        from_attributes = True

class ChatHistory(BaseModel):
    messages: List[ChatMessage]
