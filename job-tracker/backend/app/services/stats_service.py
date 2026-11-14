from sqlalchemy.orm import Session
from app.repositories import stats_repo

STATUSES = ["wishlist", "applied", "interview", "offer", "rejected"]


def funnel(db: Session, user_id: int) -> dict:
    counts = stats_repo.count_by_status(db, user_id)
    stages = [{"status": s, "count": counts.get(s, 0)} for s in STATUSES]
    return {"stages": stages, "total": sum(item["count"] for item in stages)}