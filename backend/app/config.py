from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Farmkiti API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    POSTGRES_USER: str = "farmkiti"
    POSTGRES_PASSWORD: str = "farmkiti_pass"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "farmkiti"
    
    @property
    def async_database_url(self) -> str:
        return "sqlite+aiosqlite:///./farmkitti.db"
    
    # Security
    SECRET_KEY: str = "SUPER_SECRET_KEY_CHANGE_ME_IN_PROD"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # SMS (Africa's Talking or mock)
    SMS_API_KEY: str = "mock_key"
    SMS_USERNAME: str = "sandbox"
    
    # Storage (MinIO)
    MINIO_URL: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "admin"
    MINIO_SECRET_KEY: str = "password"
    MINIO_BUCKET: str = "farmkiti-images"
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
