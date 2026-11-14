from sqlalchemy import String, Float, Date, ForeignKey, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Application(Base):
    __tablename__ = "applications"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    company: Mapped[str] = mapped_column(String(120))
    role: Mapped[str] = mapped_column(String(120))
    status: Mapped[str] = mapped_column(String(20), default="wishlist", index=True)
    position: Mapped[float] = mapped_column(Float, default=1000)
    job_url: Mapped[str | None] = mapped_column(String(500))
    location: Mapped[str | None] = mapped_column(String(120))
    applied_on: Mapped[Date | None] = mapped_column(Date)
    notes: Mapped[str | None] = mapped_column(Text)