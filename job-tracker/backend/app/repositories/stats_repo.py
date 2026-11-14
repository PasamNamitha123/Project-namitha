from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.models.application import Application


def count_by_status(db: Session, user_id: int) -> dict[str, int]:
    rows = db.execute(
        select(Application.status, func.count())
        .where(Application.user_id == user_id)
        .group_by(Application.status)
    ).all()
    return {status: count for status, count in rows}