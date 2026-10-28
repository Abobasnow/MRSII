from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.assignment import Assignment
from app.schemas.assignment import AssignmentCreate, AssignmentResponse, AssignmentStatusUpdate

router = APIRouter(prefix="/api/assignments", tags=["Assignments"])

# Заглушка для репетитора (пока нет авторизации по ТЗ)
TUTOR_ID_STUB = 1


@router.post("", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
def create_assignment(data: AssignmentCreate, db: Session = Depends(get_db)):
    new_assignment = Assignment(
        title=data.title,
        description=data.description,
        deadline=data.deadline,
        tutor_id=TUTOR_ID_STUB,
        student_id=data.student_id,
        status="ISSUED"
    )
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)
    return new_assignment


@router.get("/tutor/{tutor_id}", response_model=List[AssignmentResponse])
def get_assignments_by_tutor(tutor_id: int, db: Session = Depends(get_db)):
    return db.query(Assignment).filter(Assignment.tutor_id == tutor_id).all()


@router.get("/student/{student_id}", response_model=List[AssignmentResponse])
def get_assignments_by_student(student_id: int, db: Session = Depends(get_db)):
    return db.query(Assignment).filter(Assignment.student_id == student_id).all()


@router.put("/{assignment_id}/status", response_model=AssignmentResponse)
def update_assignment_status(
        assignment_id: int,
        data: AssignmentStatusUpdate,
        db: Session = Depends(get_db)
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Задание не найдено")

    valid_statuses = ["ISSUED", "COMPLETED", "ACCEPTED", "NEEDS_REVISION"]
    if data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Недопустимый статус")

    assignment.status = data.status
    db.commit()
    db.refresh(assignment)
    return assignment