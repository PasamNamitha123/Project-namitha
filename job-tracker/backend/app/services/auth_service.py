 
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.repositories import user_repo
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)


def register(db: Session, email: str, password: str):
    # Check whether the email is already registered
    existing_user = user_repo.get_by_email(db, email)

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )

    # Hash the password before saving it
    password_hash = hash_password(password)

    # Create the user
    user = user_repo.create(db, email, password_hash)

    # Commit the transaction
    db.commit()
    db.refresh(user)

    return user


def login(db: Session, email: str, password: str):
    # Find the user by email
    user = user_repo.get_by_email(db, email)

    # Check whether the user exists and password is correct
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Generate JWT access token
    access_token = create_access_token(user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
