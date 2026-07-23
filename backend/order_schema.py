from datetime import date
from typing import Optional

from pydantic import BaseModel


class OrderUpdate(BaseModel):
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None

    pickup: Optional[str] = None
    drop: Optional[str] = None

    material: Optional[str] = None
    weight: Optional[float] = None

    vehicle_type: Optional[str] = None

    expected_delivery: Optional[date] = None

    status: Optional[str] = None

    assigned_driver: Optional[int] = None
    assigned_trip: Optional[int] = None
    
class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str

    pickup: str
    drop: str

    material: str
    weight: float

    vehicle_type: str

    expected_delivery: date

    freight: float
    advance: float
    notes: str


class OrderAssign(BaseModel):
    driver_id: int


class OrderStatus(BaseModel):
    status: str