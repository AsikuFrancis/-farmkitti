from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.schemas.community import CommunityGroup, CommunityGroupCreate, Post, PostCreate, Comment, CommentCreate
from app.services import community_service
from app.dependencies import get_db
from app.models.user import User

async def get_current_user_mock() -> User:
    from uuid import uuid4
    return User(id=uuid4(), phone="1234567890", full_name="Mock User")

router = APIRouter()

@router.post("/groups", response_model=CommunityGroup)
async def create_group(
    group_in: CommunityGroupCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_mock)
) -> Any:
    return await community_service.create_group(db, group_in)

@router.get("/groups", response_model=List[CommunityGroup])
async def list_groups(db: AsyncSession = Depends(get_db)) -> Any:
    return await community_service.get_all_groups(db)

@router.post("/posts", response_model=Post)
async def create_post(
    post_in: PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_mock)
) -> Any:
    return await community_service.create_post(db, post_in, current_user.id)

@router.get("/posts", response_model=List[Post])
async def get_feed(
    group_id: UUID = None,
    db: AsyncSession = Depends(get_db)
) -> Any:
    if group_id:
        return await community_service.get_posts_by_group(db, group_id)
    return await community_service.get_global_feed(db)

@router.post("/comments", response_model=Comment)
async def create_comment(
    comment_in: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_mock)
) -> Any:
    return await community_service.create_comment(db, comment_in, current_user.id)
