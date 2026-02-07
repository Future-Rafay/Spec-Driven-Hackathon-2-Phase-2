"""
FastAPI application instance with CORS configuration.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.auth import router as auth_router
from .api.protected import router as protected_router
from .api.tasks import router as tasks_router

# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Authentication API for Todo Application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(protected_router)
app.include_router(tasks_router)


@app.get("/")
async def root():
    """Root endpoint for health check."""
    return {"message": "Todo App Authentication API", "status": "running"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
