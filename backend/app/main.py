from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.routes import auth, credits, farms, marketplace, transactions
from app.core.config import settings
from app.core.limiter import limiter

tags_metadata = [
    {
        "name": "auth",
        "description": "Authentication and authorization for users (aggregators, buyers, and admins). Handles login, registration, and session management.",
    },
    {
        "name": "farms",
        "description": "Operations with farm geometries and agronomic data. Aggregators can register farms and manage their spatial boundaries.",
    },
    {
        "name": "credits",
        "description": "Manage carbon credit batches. Mint new credits, update statuses, and view available inventories for Scope 3 retirements.",
    },
    {
        "name": "marketplace",
        "description": "Public and private marketplace endpoints for exploring available carbon credit batches with filtering and search.",
    },
    {
        "name": "transactions",
        "description": "Checkout flow and milestone payments for purchasing carbon credits. Handles buffer pool allocation and smart escrows.",
    },
]

app = FastAPI(
    title="GroundWork OS API",
    description="Next-Gen B2B Agricultural Carbon Credit Marketplace & Aggregator OS. Powering verifiable Scope 3 interventions.",
    version="1.0.0",
    openapi_tags=tags_metadata,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],  # default vite ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(farms.router, prefix=f"{settings.API_V1_STR}/farms", tags=["farms"])
app.include_router(
    credits.router, prefix=f"{settings.API_V1_STR}/credits", tags=["credits"]
)
app.include_router(
    marketplace.router,
    prefix=f"{settings.API_V1_STR}/marketplace",
    tags=["marketplace"],
)
app.include_router(
    transactions.router,
    prefix=f"{settings.API_V1_STR}/transactions",
    tags=["transactions"],
)


@app.get(f"{settings.API_V1_STR}/health", tags=["health"])
def health_check():
    return {"status": "ok"}
