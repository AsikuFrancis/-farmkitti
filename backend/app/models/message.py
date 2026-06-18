import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean, func
from app.database import Base

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    # Storing participant IDs as a comma-separated string for simplicity in MVP
    participant_ids = Column(String(500), nullable=False) 
    last_message_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Message(Base):
    __tablename__ = "messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String(36), ForeignKey("conversations.id"), nullable=False)
    sender_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    receiver_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    content = Column(String(2000), nullable=True)
    media_url = Column(String(500), nullable=True)
    message_type = Column(String(50), default="text") # text, image, voice
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
