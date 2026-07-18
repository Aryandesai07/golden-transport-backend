from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Driver, DriverDocument

router = APIRouter(
    prefix="/admin",
    tags=["Admin Drivers"],
)

@router.get("/driver/{driver_id}")
def get_driver_details(
    driver_id: int,
    db: Session = Depends(get_db),
):

    driver = (
        db.query(Driver)
        .filter(Driver.id == driver_id)
        .first()
    )

    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not found",
        )

    documents = (
        db.query(DriverDocument)
        .filter(DriverDocument.driver_id == driver_id)
        .first()
    )

    return {
        "status": "success",

        "driver": {
            "id": driver.id,
            "name": driver.name,
            "mobile": driver.mobile,
            "vehicle_no": driver.vehicle_no,
            "vehicle_type": driver.vehicle_type,
            "license_number": driver.license_number,
            "earnings": driver.earnings,
            "photo": driver.photo,
        },

        "documents": {
            "license_url": documents.license_url if documents else None,
            "aadhaar_url": documents.aadhaar_url if documents else None,
            "pan_url": documents.pan_url if documents else None,
            "rc_book_url": documents.rc_book_url if documents else None,
            "insurance_url": documents.insurance_url if documents else None,
            "puc_url": documents.puc_url if documents else None,
        },
    }