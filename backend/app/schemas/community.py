from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class CommunityGroupBase(BaseModel):
    name: str
    description: str
    crop_focus: Optional[str] = None
    region: Optional[str] = None

class CommunityGroupCreate(CommunityGroupBase):
    pass

class CommunityGroup(CommunityGroupBase):
    id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class PostBase(BaseModel):
    content: str
    image_url: Optional[str] = None

class PostCreate(PostBase):
    group_id: Optional[UUID] = None

class Post(PostBase):
    id: UUID
    author_id: UUID
    group_id: Optional[UUID] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    post_id: UUID

class Comment(CommentBase):
    id: UUID
    post_id: UUID
    author_id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
