from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.material import Material
from app.schemas.material import MaterialCreate, MaterialResponse

router = APIRouter(prefix="/api/materials", tags=["Materials"])

@router.post("", response_model=MaterialResponse, status_code=status.HTTP_201_CREATED)
def create_material(
    data: MaterialCreate,
    teacher_id: int = Query(..., description="ID репетитора (пока вручную)"),
    db: Session = Depends(get_db),
):
    # Проверим, что репетитор существует
    from app.models.user import User
    teacher = db.query(User).filter(User.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Репетитор не найден")

    new_material = Material(
        title=data.title,
        type=data.type,
        content=data.content,
        teacher_id=teacher_id,
        student_id=data.student_id,
    )

    db.add(new_material)
    db.commit()
    db.refresh(new_material)
    return new_material


@router.get("", response_model=List[MaterialResponse])
def get_materials(
    teacher_id: int = Query(..., description="ID репетитора"),
    db: Session = Depends(get_db),
):
    materials = (
        db.query(Material)
        .filter(Material.teacher_id == teacher_id)
        .order_by(Material.created_at.desc())
        .all()
    )
    return materials
@router.get("/student/{student_id}", response_model=List[MaterialResponse])

def get_materials_for_student(
    student_id: int,
    db: Session = Depends(get_db),
):
    """
    Возвращает материалы для конкретного ученика:
    - общие (student_id IS NULL)
    - привязанные лично к нему (student_id = X)
    """
    materials = (
        db.query(Material)
        .filter(
            (Material.student_id == student_id) | (Material.student_id.is_(None))
        )
        .order_by(Material.created_at.desc())
        .all()
    )
    return materials