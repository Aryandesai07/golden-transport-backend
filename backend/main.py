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
    allow_origins=["*"],  # 🔒 Replace with frontend domain in production
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
        "message": "🚚 Golden Transport API Working",
        "database": DATABASE_URL
    }
@app.get("/test")
def test():
    return {"status": "OK"}
# =====================================
# RAILWAY ENTRY POINT
# =====================================
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
