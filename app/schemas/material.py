from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MaterialCreate(BaseModel):
    title: str
    type: str = "TEXT"  # TEXT | LINK
    content: str
    student_id: Optional[int] = None
    # teacher_id пока подставляем вручную (временно)


class MaterialResponse(BaseModel):
    id: int
    title: str
    type: str
    content: str
    teacher_id: int
    student_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True