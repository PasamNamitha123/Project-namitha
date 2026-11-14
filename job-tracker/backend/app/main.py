from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.exceptions import NotFoundError
from app.routers import stats as stats_router
from app.routers import auth as auth_router
from app.routers import application as application_router


app = FastAPI(title="Job Tracker API")
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins,
                   allow_methods=["*"], allow_headers=["*"])


@app.exception_handler(NotFoundError)
async def not_found(_: Request, __: NotFoundError):
    return JSONResponse(status_code=404, content={"detail": "Not found"})


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(stats_router.router)
app.include_router(auth_router.router)
app.include_router(application_router.router)