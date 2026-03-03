from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.routers import operations, spv, settlement, dashboard, webhooks, assets


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables + seed
    await init_db()
    try:
        from app.seed import seed_all
        await seed_all()
    except Exception as e:
        print(f"Seed skipped: {e}")
    yield


app = FastAPI(
    title="MobilityX Clearing House",
    description="Grand Waterfall settlement engine + operations API",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(settlement.router, prefix="/api/settlement", tags=["Settlement"])
app.include_router(operations.router, prefix="/api/ops", tags=["Operations"])
app.include_router(spv.router, prefix="/api/spv", tags=["SPV"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["Webhooks"])
app.include_router(assets.router, prefix="/api/assets", tags=["Assets"])


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "mobilityx-clearing-house"}
