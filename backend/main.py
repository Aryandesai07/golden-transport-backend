from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routes.driver import router as driver_router
import os

# =====================================
# APP INIT
# =====================================
app = FastAPI(title="Golden Transport API")

# =====================================
# FOLDERS
# =====================================
os.makedirs("uploads/proofs", exist_ok=True)
os.makedirs("uploads/fuel_bills", exist_ok=True)

# =====================================
# STATIC FILES
# =====================================
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# =====================================
# CORS
# =====================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================
# DATABASE
# =====================================
Base.metadata.create_all(bind=engine)

# =====================================
# ROUTES
# =====================================
app.include_router(driver_router, prefix="/driver")

# =====================================
# HOME
# =====================================
@app.get("/")
def home():
    return {
        "message": "🚚 Golden Transport API Working"
    }

@app.get("/test")
def test():
    return {
        "status": "OK"
    }