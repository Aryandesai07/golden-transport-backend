import os

# Use Railway BASE_URL if set, otherwise default to local
BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:8000")

UPLOAD_PROOFS = os.path.join("uploads", "proofs")
UPLOAD_FUEL = os.path.join("uploads", "fuel_bills")
