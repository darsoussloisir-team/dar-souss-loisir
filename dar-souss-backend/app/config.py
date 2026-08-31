from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_ENV: str = "development"
    FRONTEND_ORIGIN: str = "http://localhost:5173"

    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 465
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = ""
    EMAIL_TO: str = ""

    # AI Agent — Groq (free tier)
    # Get your key at https://console.groq.com
    GROQ_API_KEY: str = ""

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./dar_souss.db"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    return Settings()