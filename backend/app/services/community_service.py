from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from uuid import UUID
from typing import List

from app.models.community import CommunityGroup, GroupMember, Post, Comment
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

async def create_post(db: AsyncSession, post_in: PostCreate, author_id: UUID) -> Post:
    db_obj = Post(**post_in.model_dump(), author_id=author_id)
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def get_posts_by_group(db: AsyncSession, group_id: UUID) -> List[Post]:
    stmt = select(Post).where(Post.group_id == group_id).order_by(Post.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

async def get_global_feed(db: AsyncSession) -> List[Post]:
    stmt = select(Post).where(Post.group_id == None).order_by(Post.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

async def create_comment(db: AsyncSession, comment_in: CommentCreate, author_id: UUID) -> Comment:
    db_obj = Comment(**comment_in.model_dump(), author_id=author_id)
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def get_comments_for_post(db: AsyncSession, post_id: UUID) -> List[Comment]:
    stmt = select(Comment).where(Comment.post_id == post_id).order_by(Comment.created_at.asc())
    result = await db.execute(stmt)
    return result.scalars().all()
