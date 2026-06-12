from pydantic import BaseModel
from typing import Optional

# =========================
# DRIVER LOGIN
# =========================
class DriverLogin(BaseModel):
    mobile: str
    password: str

    class Config:
        orm_mode = True


# =========================
# TRIP STATUS UPDATE
# =========================
class TripStatusUpdate(BaseModel):
    trip_id: int
    status: str

    class Config:
        orm_mode = True


# =========================
# SOS REQUEST
# =========================
class SOSRequest(BaseModel):
    driver_id: int
    latitude: float
    longitude: float

    class Config:
        orm_mode = True


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
        orm_mode = True


# =========================
# DRIVER LOCATION UPDATE
# =========================
class LocationData(BaseModel):
    driver_id: int
    latitude: float
    longitude: float

    class Config:
        orm_mode = True
