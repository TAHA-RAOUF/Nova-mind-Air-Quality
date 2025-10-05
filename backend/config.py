"""
Configuration Settings
Loads environment variables and application settings
"""
import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # WAQI API Configuration
    WAQI_TOKEN: str = os.getenv("WAQI_TOKEN", "")
    
    # Redis Configuration
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Cache Configuration
    CACHE_TTL_HOURS: int = int(os.getenv("CACHE_TTL_HOURS", "48"))
    
    # Application Configuration
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Station Discovery Configuration
    USE_CUSTOM_CITIES: bool = os.getenv("USE_CUSTOM_CITIES", "false").lower() == "true"
    MAX_DISCOVERY_REQUESTS: int = int(os.getenv("MAX_DISCOVERY_REQUESTS", "200"))
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Global settings instance
settings = Settings()