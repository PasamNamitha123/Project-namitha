
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.models.status_history import StatusHistory
from app.repositories import application_repo


def create(db: Session, user_id: int, data: dict):
    application = application_repo.create(db, user_id, data)

    db.commit()
    db.refresh(application)

    return application


def get_by_id(db: Session, user_id: int, app_id: int):
    application = application_repo.get_for_user(
        db, app_id, user_id
    )

    if not application:
        raise NotFoundError()

    return application


def update(db: Session, user_id: int, app_id: int, data: dict):
    application = application_repo.get_for_user(
        db, app_id, user_id
    )

    if not application:
        raise NotFoundError()

    if "status" in data and application.status != data["status"]:
        db.add(
            StatusHistory(
                application_id=application.id,
                from_status=application.status,
                to_status=data["status"]
            )
        )

    application_repo.update(db, application, data)

    db.commit()
    db.refresh(application)

    return application


def delete(db: Session, user_id: int, app_id: int):
    application = application_repo.get_for_user(
        db, app_id, user_id
    )

    if not application:
        raise NotFoundError()

    application_repo.delete(db, application)

    db.commit()

    return {"message": "Application deleted successfully"}


def move(db: Session, user_id: int, app_id: int, new_status: str, position: float):
    application = application_repo.get_for_user(
        db, app_id, user_id
    )

    if not application:
        raise NotFoundError()

    if application.status != new_status:
        db.add(
            StatusHistory(
                application_id=application.id,
                from_status=application.status,
                to_status=new_status
            )
        )

        application.status = new_status

    application.position = position

    db.commit()
    db.refresh(application)

    return application


import math

def get_all(
    db: Session,
    user_id: int,
    search: str | None = None,
    status: str | None = None,
    location: str | None = None,
    sort_by: str = "position",
    sort_order: str = "asc",
    page: int = 1,
    page_size: int = 10
):
    applications, total = application_repo.get_all_for_user(
        db=db,
        user_id=user_id,
        search=search,
        status=status,
        location=location,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        page_size=page_size
    )

    return {
        "items": applications,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": math.ceil(total / page_size) if total else 0
    }
