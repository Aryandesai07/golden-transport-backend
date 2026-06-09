from pydantic import BaseModel

class DriverLogin(BaseModel):
    mobile: str
    password: str


class TripStatusUpdate(BaseModel):
    trip_id: int
    status: str

class SOSRequest(BaseModel):
    driver_id: int
    latitude: float
    longitude: float
    
class DriverCreate(BaseModel):
    name: str
    mobile: str
    password: str
    vehicle_no: str
    vehicle_type: str