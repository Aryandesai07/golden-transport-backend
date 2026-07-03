import os
import models
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from database import DATABASE_URL, Base, engine
from routes.driver import router as driver_router

# =====================================
# APP INIT
# =====================================
app = FastAPI(title="Golden Transport API")

# =====================================
# FOLDERS
# =====================================
os.makedirs("uploads", exist_ok=True)
os.makedirs("uploads/proofs", exist_ok=True)
os.makedirs("uploads/fuel_bills", exist_ok=True)

os.makedirs("uploads/licenses", exist_ok=True)
os.makedirs("uploads/aadhaar", exist_ok=True)
os.makedirs("uploads/pan", exist_ok=True)
# =====================================
# STATIC FILES
# =====================================
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
# =====================================
# CORS
# =====================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "exp://192.168.31.182:8081",
        "http://localhost:8081",
        "http://localhost:19006",
    ],
    allow_credentials=False,
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
        "message": "🚚 Golden Transport API Working",
        "status": "Running"
    }
@app.get("/test")
def test():
    return {"status": "OK"}

@app.get("/health")
def health():
    return {
        "status": "OK",
        "database": "Connected"
    }
    
@app.post("/ping")
def ping():
    return {
        "status": "success",
        "message": "POST is working"
    }
# =====================================
# RAILWAY ENTRY POINT
# =====================================
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
