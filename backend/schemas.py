from pydantic import BaseModel, Field
from typing import Optional


# =========================
# DRIVER LOGIN
# =========================
class DriverLogin(BaseModel):
    mobile: str
    password: str

    class Config:
        from_attributes = True


# =========================
# TRIP STATUS UPDATE
# =========================
class TripStatusUpdate(BaseModel):
    trip_id: int
    status: str

    class Config:
        from_attributes = True


# =========================
# SOS REQUEST
# =========================
class SOSRequest(BaseModel):
    driver_id: int
    latitude: float
    longitude: float

    class Config:
        from_attributes = True


# =========================
# DRIVER CREATE
# =========================
class DriverCreate(BaseModel):
    name: str
    mobile: str
    password: str
    vehicle_no: str
    vehicle_type: Optional[str] = None

    class Config:
        from_attributes = True


# =========================
# DRIVER LOCATION UPDATE
# =========================
class LocationData(BaseModel):
    driver_id: int
    latitude: float
    longitude: float

    class Config:
        from_attributes = True


# =========================
# DRIVER PROFILE UPDATE (MISSING BEFORE)
# =========================
class DriverUpdate(BaseModel):
    driver_id: int
    name: str
    mobile: str
    vehicle_no: str

    class Config:
        from_attributes = True