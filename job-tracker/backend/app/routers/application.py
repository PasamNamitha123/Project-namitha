
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_user
from app.models.user import User

from fastapi import Query
from app.schemas.application import ApplicationPage


from app.schemas.application import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationOut,
    MoveIn
)

from app.services import application_service


router = APIRouter(
    prefix="/applications",
    tags=["applications"]
)


# 1. Create application
@router.post(
    "",
    response_model=ApplicationOut,
    status_code=status.HTTP_201_CREATED
)
def create_application(
    body: ApplicationCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return application_service.create(
        db,
        user.id,
        body.model_dump()
    )


# 2. Get all applications
@router.get("", response_model=ApplicationPage)
def get_applications(
    search: str | None = None,
    status: str | None = None,
    location: str | None = None,
    sort_by: str = "position",
    sort_order: str = "asc",
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return application_service.get_all(
        db=db,
        user_id=user.id,
        search=search,
        status=status,
        location=location,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        page_size=page_size
    )


# 3. Get application by ID
@router.get("/{app_id}", response_model=ApplicationOut)
def get_application(
    app_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return application_service.get_by_id(
        db, user.id, app_id
    )


# 4. Update application
@router.patch("/{app_id}", response_model=ApplicationOut)
def update_application(
    app_id: int,
    body: ApplicationUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return application_service.update(
        db,
        user.id,
        app_id,
        body.model_dump(exclude_unset=True)
    )


# 5. Delete application
@router.delete("/{app_id}")
def delete_application(
    app_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return application_service.delete(
        db, user.id, app_id
    )


# 6. Move application (Kanban)
@router.patch("/{app_id}/move", response_model=ApplicationOut)
def move_application(
    app_id: int,
    body: MoveIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return application_service.move(
        db,
        user.id,
        app_id,
        body.status,
        body.position
    )
