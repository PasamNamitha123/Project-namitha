
from sqlalchemy.orm import Session
from app.models.application import Application


def create(db: Session, user_id: int, data: dict):
    application = Application(
        user_id=user_id,
        **data
    )

    db.add(application)
    db.flush()

    return application



from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.application import Application


def get_all_for_user(
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
    query = db.query(Application).filter(
        Application.user_id == user_id
    )

    # Search by company or role
    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Application.company.ilike(search_term),
                Application.role.ilike(search_term)
            )
        )

    # Filter by application status
    if status:
        query = query.filter(Application.status == status)

    # Filter by location
    if location:
        query = query.filter(
            Application.location.ilike(f"%{location.strip()}%")
        )

    # Get total count before pagination
    total = query.count()

    # Allow only supported sorting fields
    sort_columns = {
        "company": Application.company,
        "role": Application.role,
        "status": Application.status,
        "applied_on": Application.applied_on,
        "position": Application.position
    }

    sort_column = sort_columns.get(sort_by, Application.position)

    if sort_order.lower() == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    # Apply pagination
    offset = (page - 1) * page_size

    applications = (
        query
        .offset(offset)
        .limit(page_size)
        .all()
    )

    return applications, total



def get_for_user(db: Session, app_id: int, user_id: int):
    return (
        db.query(Application)
        .filter(
            Application.id == app_id,
            Application.user_id == user_id
        )
        .first()
    )


def update(db: Session, application: Application, data: dict):
    for key, value in data.items():
        setattr(application, key, value)

    db.flush()
    return application


def delete(db: Session, application: Application):
    db.delete(application)
    db.flush()
