from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.security.utils import get_password_hash

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # Проверяем, нет ли пользователя с таким email
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким email уже существует",
        )

    # Хешируем пароль
    hashed_password = get_password_hash(user_data.password)

    # Создаём нового пользователя
    new_user = User(
        email=user_data.email,
        password=hashed_password,
        full_name=user_data.full_name,
        role_id=user_data.role_id,
        avatar_url=user_data.avatar_url,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user