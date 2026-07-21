from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import FuelBill, Driver

router = APIRouter(
    prefix="/admin",
    tags=["Admin Fuel Bills"]
)

@router.get("/fuel-bills")
def get_all_fuel_bills(db: Session = Depends(get_db)):

    bills = (
        db.query(FuelBill)
        .join(Driver)
        .order_by(FuelBill.created_at.desc())
        .all()
    )

    result = []

    for bill in bills:

        result.append({
            "id": bill.id,

            "driver_id": bill.driver_id,
            "driver_name": bill.driver.name,

            "trip_id": bill.trip_id,

            "amount": bill.amount,
            "liters": bill.liters,

            "fuel_station": bill.fuel_station,
            "location": bill.location,

            "odometer": bill.odometer,

            "status": bill.status,

            "image": bill.image_path,

            "created_at": bill.created_at,
        })

    return {
        "status": "success",
        "fuel_bills": result
    }