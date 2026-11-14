
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse
)
from app.services import auth_service


router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=UserResponse, status_code=201)
def register_user(
    body: UserRegister,
    db: Session = Depends(get_db)
):
    return auth_service.register(
        db,
        body.email,
        body.password
    )


@router.post("/login", response_model=TokenResponse)
def login_user(
    body: UserLogin,
    db: Session = Depends(get_db)
):
    return auth_service.login(
        db,
        body.email,
        body.password
    )
