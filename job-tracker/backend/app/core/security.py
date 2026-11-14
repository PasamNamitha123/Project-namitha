import bcrypt
from datetime import datetime, timedelta, timezone
from jose import jwt
from app.core.config import settings

def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()

def verify_password(p: str, hashed: str) -> bool:
    return bcrypt.checkpw(p.encode(), hashed.encode())

def create_access_token(user_id: int) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_minutes)
    return jwt.encode({"sub": str(user_id), "exp": exp},
                      settings.secret_key, algorithm=settings.algorithm)