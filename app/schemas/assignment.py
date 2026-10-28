from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AssignmentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    student_id: int

class AssignmentStatusUpdate(BaseModel):
    status: str

class AssignmentResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    deadline: Optional[datetime]
    tutor_id: int
    student_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True