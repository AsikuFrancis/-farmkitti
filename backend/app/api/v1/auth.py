from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.auth import User, UserCreate, Token, LoginRequest
from app.services import auth_service
from app.utils import security
from app.dependencies import get_db

router = APIRouter()

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)) -> Any:
    """
    Register a new user.
    """
    user = await auth_service.get_user_by_phone(db, phone=user_in.phone)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this phone number already exists in the system.",
        )
    user = await auth_service.create_user(db, user_in=user_in)
    return user

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: AsyncSession = Depends(get_db)) -> Any:
    """
    Login with phone and password.
    """
    user = await auth_service.authenticate_user(
        db, phone=login_data.phone, password=login_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect phone number or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token = security.create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}
