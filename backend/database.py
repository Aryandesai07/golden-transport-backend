import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# =========================================
# DATABASE URL CONFIG
# =========================================
# Railway will inject DATABASE_URL via environment variables.
# Locally, it falls back to SQLite.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./transport.db")

# =========================================
# ENGINE
# =========================================
# For SQLite, we need connect_args. For PostgreSQL/MySQL, we don’t.
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

# =========================================
# SESSION
# =========================================
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# =========================================
# BASE CLASS
# =========================================
Base = declarative_base()
