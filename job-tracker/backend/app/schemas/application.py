from typing import Literal
from datetime import date
from pydantic import BaseModel, ConfigDict

Status = Literal["wishlist", "applied", "interview", "offer", "rejected"]

class ApplicationCreate(BaseModel):
    company: str
    role: str
    status: Status = "wishlist"
    job_url: str | None = None
    location: str | None = None
    applied_on: date | None = None
    notes: str | None = None

class ApplicationOut(ApplicationCreate):
    id: int
    position: float
    model_config = ConfigDict(from_attributes=True)

class MoveIn(BaseModel):
    status: Status
    position: float


class ApplicationUpdate(BaseModel):
    company: str | None = None
    role: str | None = None
    status: Status | None = None
    job_url: str | None = None
    location: str | None = None
    applied_on: date | None = None
    notes: str | None = None


class ApplicationPage(BaseModel):
    items: list[ApplicationOut]
    total: int
    page: int
    page_size: int
    total_pages: int
