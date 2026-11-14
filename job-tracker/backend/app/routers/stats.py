from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.services import stats_service

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/funnel")
def get_funnel(db: Session = Depends(get_db),
               user: User = Depends(get_current_user)):
    return stats_service.funnel(db, user.id)