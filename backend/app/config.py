from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./mobilityx.db"
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: str = "http://localhost:3000"

    # Grand Waterfall Algorithm — payment split percentages
    SPV_ESCROW_PCT: float = 0.70   # 70% → SPV Escrow (debt amortization)
    OPERATOR_PCT: float = 0.25     # 25% → Local Operator (operating revenue)
    PLATFORM_PCT: float = 0.05     # 5%  → MobilityX (platform fee)

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
