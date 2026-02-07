"""
Environment configuration loader for backend application.
Loads BETTER_AUTH_SECRET and DATABASE_URL from environment variables.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    # JWT secret for token signing/verification
    BETTER_AUTH_SECRET: str

    # Database connection string
    DATABASE_URL: str

    # API configuration
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Todo App Authentication API"

    # CORS configuration
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:8080"]


# Global settings instance
settings = Settings()
