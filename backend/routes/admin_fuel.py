from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import FuelBill, Driver

router = APIRouter(
    prefix="/admin",
    tags=["Admin Fuel Bills"]
)

@router.get("/fuel-bills")
def get_fuel_bills(db: Session = Depends(get_db)):

    bills = (
        db.query(FuelBill)
        .order_by(FuelBill.id.desc())
        .all()
    )

    result = []

    for bill in bills:

        driver = (
            db.query(Driver)
            .filter(Driver.id == bill.driver_id)
            .first()
        )

        result.append({

            "id": bill.id,

            "driver_id": bill.driver_id,

            "driver_name":
                driver.name if driver else "Unknown",

            "trip_id": bill.trip_id,

            "amount": bill.amount,

            "liters": bill.liters,

            "fuel_station": bill.fuel_station,

            "location": bill.location,

            "status": bill.status,

            "image_url": bill.image_path,

            "created_at": bill.created_at

        })

    return {
        "status": "success",
        "fuel_bills": result
    }