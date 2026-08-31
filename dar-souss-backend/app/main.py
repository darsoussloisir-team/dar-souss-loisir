from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.db.database import init_db
from app.routers import contact, booking, health, agent


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize SQLite DB tables on startup."""
    await init_db()
    yield


app = FastAPI(
    title="Dar Souss Loisir API",
    description="Backend for Dar Souss Loisir camel ride tourism website.",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# In production replace ["*"] with your exact frontend domain:
#   allow_origins=["https://darsoussloisir.com", "https://www.darsoussloisir.com"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(health.router, tags=["Health"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])
app.include_router(booking.router, prefix="/api/booking", tags=["Booking"])
app.include_router(agent.router,   prefix="/api/agent",   tags=["Agent"])