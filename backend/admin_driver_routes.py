from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Driver, DriverDocument
from models import AdminNotification

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
            "license_url": documents.license_url,
            "license_status": documents.license_status,
            "license_rejection_reason": documents.license_rejection_reason,

            "aadhaar_url": documents.aadhaar_url,
            "aadhaar_status": documents.aadhaar_status,
            "aadhaar_rejection_reason": documents.aadhaar_rejection_reason,

            "pan_url": documents.pan_url,
            "pan_status": documents.pan_status,
            "pan_rejection_reason": documents.pan_rejection_reason,

            "rc_book_url": documents.rc_book_url,
            "rc_book_status": documents.rc_book_status,
            "rc_book_rejection_reason": documents.rc_book_rejection_reason,

            "insurance_url": documents.insurance_url,
            "insurance_status": documents.insurance_status,
            "insurance_rejection_reason": documents.insurance_rejection_reason,

            "puc_url": documents.puc_url,
            "puc_status": documents.puc_status,
            "puc_rejection_reason": documents.puc_rejection_reason,
        }
    }
# =====================================
# ADMIN NOTIFICATIONS
# =====================================

@router.get("/notifications")
def get_admin_notifications(
    db: Session = Depends(get_db),
):

    notifications = (
        db.query(AdminNotification)
        .order_by(AdminNotification.id.desc())
        .all()
    )

    return {
        "status": "success",
        "notifications": [
            {
                "id": n.id,
                "driver_id": n.driver_id,
                "title": n.title,
                "message": n.message,
                "type": n.type,
                "status": n.status,
                "created_at": n.created_at,
            }
            for n in notifications
        ],
    }