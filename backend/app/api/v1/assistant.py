from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any
from datetime import datetime

from app.schemas.assistant import ChatMessageCreate, ChatMessage
from app.services import assistant_service
from app.models.user import User

# Mock dependency for getting current user for now
async def get_current_user_mock() -> User:
    from uuid import uuid4
    return User(id=uuid4(), phone="1234567890", full_name="Mock User")

router = APIRouter()

@router.post("/chat", response_model=ChatMessage)
async def chat_with_assistant(
    chat_in: ChatMessageCreate,
    current_user: User = Depends(get_current_user_mock)
) -> Any:
    """
    Send a message to the AI Farming Assistant and get a response.
    """
    # 1. Generate response
    response_text = await assistant_service.generate_assistant_response(
        message=chat_in.message,
        language=chat_in.language
    )
    
    # 2. In a real app, we would save the chat history to the database here
    # For MVP, we just return the response
    
    return ChatMessage(
        role="assistant",
        content=response_text,
        timestamp=datetime.utcnow()
    )
