from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role_id: int  # 1 - ADMIN, 2 - TEACHER, 3 - STUDENT
    avatar_url: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    avatar_url: Optional[str]
    role_id: int
    created_at: datetime

    class Config:
        from_attributes = True