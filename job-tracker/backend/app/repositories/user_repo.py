
from sqlalchemy.orm import Session
from app.models.user import User


def get_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create(db: Session, email: str, password_hash: str):
    user = User(
        email=email,
        password_hash=password_hash
    )

    db.add(user)
    db.flush()

    return user
