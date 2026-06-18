from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class CommunityGroupBase(BaseModel):
    name: str
    description: str
    crop_focus: Optional[str] = None
    region: Optional[str] = None

class CommunityGroupCreate(CommunityGroupBase):
    pass

class CommunityGroup(CommunityGroupBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class PostBase(BaseModel):
    content: str
    image_url: Optional[str] = None

class PostCreate(PostBase):
    group_id: Optional[str] = None

class Post(PostBase):
    id: str
    author_id: Optional[str] = None
    user_id: Optional[str] = None
    group_id: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    post_id: str

class Comment(CommentBase):
    id: str
    post_id: str
    author_id: Optional[str] = None
    user_id: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
