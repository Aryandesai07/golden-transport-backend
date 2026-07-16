from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# ==========================================
# DRIVER LOGIN
# ==========================================

class DriverLogin(BaseModel):
    mobile: str
    password: str

    class Config:
        from_attributes = True


# ==========================================
# DRIVER CREATE
# ==========================================

class DriverCreate(BaseModel):
    name: str
    mobile: str
    password: str
    vehicle_no: str
    vehicle_type: Optional[str] = None

    class Config:
        from_attributes = True


# ==========================================
# DRIVER UPDATE
# ==========================================

class DriverUpdate(BaseModel):
    driver_id: int
    name: str
    mobile: str
    vehicle_no: str

    class Config:
        from_attributes = True


# ==========================================
# DRIVER LOCATION
# ==========================================

class LocationData(BaseModel):
    driver_id: int
    latitude: float
    longitude: float

    class Config:
        from_attributes = True


# ==========================================
# SOS REQUEST
# ==========================================

class SOSRequest(BaseModel):
    driver_id: int
    latitude: float
    longitude: float

    class Config:
        from_attributes = True


# ==========================================
# TRIP STATUS UPDATE
# ==========================================

class TripStatusUpdate(BaseModel):
    trip_id: int
    status: str

    class Config:
        from_attributes = True


# ==========================================
# ADMIN CREATE TRIP
# ==========================================

class TripCreate(BaseModel):
    driver_id: int

    customer_name: str
    customer_mobile: str

    pickup: str
    drop_location: str

    material: str
    load_weight: str

    amount: float

    expected_delivery: datetime

    remarks: Optional[str] = None

    class Config:
        from_attributes = True