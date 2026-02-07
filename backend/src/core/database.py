"""
Database connection setup with SQLModel engine and session management.
"""
from sqlmodel import create_engine, Session, SQLModel
from ..core.config import settings

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=True,  # Log SQL queries (disable in production)
    pool_pre_ping=True,  # Verify connections before using
)


def create_db_and_tables():
    """Create all database tables defined in SQLModel models."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """
    Dependency function to get database session.

    Yields:
        Database session for use in FastAPI endpoints
    """
    with Session(engine) as session:
        yield session
