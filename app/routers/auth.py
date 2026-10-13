from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.security.utils import get_password_hash, verify_password
from pydantic import BaseModel, EmailStr
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

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

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/login", response_model=UserResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
        )
    return user