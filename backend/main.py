import os

import models
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import Base, engine
from routes.driver import router as driver_router
from routes.documents import router as documents_router

# =====================================
# CREATE DATABASE TABLES
# =====================================
Base.metadata.create_all(bind=engine)

# =====================================
# CREATE APP
# =====================================
app = FastAPI(
    title="Golden Transport API",
    version="1.0.0"
)

app.include_router(
    documents_router,
    prefix="/driver",
    tags=["Documents"],
)

# =====================================
# CREATE UPLOAD FOLDERS
# =====================================
folders = [
    "uploads",
    "uploads/proofs",
    "uploads/fuel_bills",

    "uploads/licenses",
    "uploads/aadhaar",
    "uploads/pan",

    "uploads/rc_book",
    "uploads/insurance",
    "uploads/puc",
]

for folder in folders:
    os.makedirs(folder, exist_ok=True)

# =====================================
# STATIC FILES
# =====================================
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

# =====================================
# CORS
# =====================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================
# ROUTES
# =====================================
app.include_router(
    driver_router,
    prefix="/driver",
    tags=["Driver"],
)

# =====================================
# HOME
# =====================================
@app.get("/")
def home():
    return {
        "status": "success",
        "message": "Golden Transport API Running"
    }

# =====================================
# TEST
# =====================================
@app.get("/test")
def test():
    return {
        "status": "OK"
    }

# =====================================
# HEALTH
# =====================================
@app.get("/health")
def health():
    return {
        "status": "OK",
        "database": "Connected"
    }

# =====================================
# POST TEST
# =====================================
@app.post("/ping")
def ping():
    return {
        "status": "success",
        "message": "POST is working"
    }

@app.get("/version")
def version():
    return {
        "version": "457cb06",
        "cloudinary": True
    }
# =====================================
# ENTRY POINT
# =====================================
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=False,
    )