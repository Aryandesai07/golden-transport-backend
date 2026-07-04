import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# =========================================
# DATABASE URL
# =========================================
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("❌ DATABASE_URL environment variable not found!")

# Fix for Railway / Heroku old postgres format
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# =========================================
# ENGINE (Production Safe)
# =========================================
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # checks dead connections
    pool_recycle=300,     # avoids stale connections
    echo=False            # set True only for debugging
)

# =========================================
# SESSION LOCAL
# =========================================
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# =========================================
# BASE MODEL
# =========================================
Base = declarative_base()

# =========================================
# OPTIONAL: DB DEPENDENCY (recommended)
# =========================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()