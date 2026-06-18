from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from uuid import UUID
from typing import List

from app.models.community import CommunityGroup, GroupMember, CommunityPost, PostComment
from app.schemas.community import CommunityGroupCreate, PostCreate, CommentCreate

async def create_group(db: AsyncSession, group_in: CommunityGroupCreate) -> CommunityGroup:
    db_obj = CommunityGroup(**group_in.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def get_all_groups(db: AsyncSession) -> List[CommunityGroup]:
    stmt = select(CommunityGroup)
    result = await db.execute(stmt)
    return result.scalars().all()

async def join_group(db: AsyncSession, group_id: UUID, user_id: UUID) -> GroupMember:
    db_obj = GroupMember(group_id=group_id, user_id=user_id)
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def create_post(db: AsyncSession, post_in: PostCreate, author_id: UUID) -> CommunityPost:
    db_obj = CommunityPost(**post_in.model_dump(), user_id=author_id)
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def get_posts_by_group(db: AsyncSession, group_id: UUID) -> List[CommunityPost]:
    stmt = select(CommunityPost).where(CommunityPost.group_id == group_id).order_by(CommunityPost.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

async def get_global_feed(db: AsyncSession) -> List[CommunityPost]:
    stmt = select(CommunityPost).where(CommunityPost.group_id == None).order_by(CommunityPost.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

async def create_comment(db: AsyncSession, comment_in: CommentCreate, author_id: UUID) -> PostComment:
    db_obj = PostComment(**comment_in.model_dump(), user_id=author_id)
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def get_comments_for_post(db: AsyncSession, post_id: UUID) -> List[PostComment]:
    stmt = select(PostComment).where(PostComment.post_id == post_id).order_by(PostComment.created_at.asc())
    result = await db.execute(stmt)
    return result.scalars().all()
