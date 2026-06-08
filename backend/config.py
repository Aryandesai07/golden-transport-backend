import os

BASE_URL = os.getenv(
    "BASE_URL",
    "https://golden-transport-backend-production.up.railway.app"
)

UPLOAD_PROOFS = "uploads/proofs"
UPLOAD_FUEL = "uploads/fuel_bills"