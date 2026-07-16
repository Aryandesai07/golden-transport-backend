import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# =========================================
# DATABASE URL
# =========================================

DATABASE_URL = os.getenv("DATABASE_URL")

# =========================================
# LOCAL DEVELOPMENT (SQLite)
# =========================================

if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./transport.db"

# =========================================
# Fix Render / Railway Postgres URL
# =========================================

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgres://",
        "postgresql://",
        1,
    )

# =========================================
# SQLITE / POSTGRES ENGINE
# =========================================

if DATABASE_URL.startswith("sqlite"):

    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False,
    )

else:

    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        echo=False,
    )

# =========================================
# SESSION
# =========================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# =========================================
# BASE
# =========================================

Base = declarative_base()

# =========================================
# DATABASE DEPENDENCY
# =========================================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()