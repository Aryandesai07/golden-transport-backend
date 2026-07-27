from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Driver, DriverDocument, DriverTruck
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
    db.refresh(documents)
    
    print("License:", documents.license_rejection_reason)
    print("Aadhaar:", documents.aadhaar_rejection_reason)
    print("PAN:", documents.pan_rejection_reason)
    
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
    
@router.get("/fleet-overview")
def fleet_overview(db: Session = Depends(get_db)):

    total = db.query(DriverTruck).count()

    available = (
        db.query(DriverTruck)
        .filter(
            DriverTruck.status == "APPROVED",
            DriverTruck.availability == "AVAILABLE",
        )
        .count()
    )

    on_trip = (
        db.query(DriverTruck)
        .filter(
            DriverTruck.availability == "ON_TRIP",
        )
        .count()
    )

    maintenance = (
        db.query(DriverTruck)
        .filter(
            DriverTruck.availability == "MAINTENANCE",
        )
        .count()
    )

    pending = (
        db.query(DriverTruck)
        .filter(
            DriverTruck.status == "PENDING",
        )
        .count()
    )

    rejected = (
        db.query(DriverTruck)
        .filter(
            DriverTruck.status == "REJECTED",
        )
        .count()
    )

    return {
        "status": "success",

        "summary": {
            "total": total,
            "available": available,
            "on_trip": on_trip,
            "maintenance": maintenance,
            "pending": pending,
            "rejected": rejected,
        }
    }
    
@router.get("/trucks")
def get_all_trucks(
    db: Session = Depends(get_db),
):

    trucks = (
    db.query(DriverTruck)
    .filter(
        DriverTruck.status == "APPROVED",
        DriverTruck.availability == "AVAILABLE",
    )
    .all()
)

    return {
        "status": "success",
        "count": len(trucks),
        "trucks": [
            {
                "id": truck.id,
                "driver_id": truck.driver_id,
                "driver_name": truck.driver.name,
                "vehicle_no": truck.vehicle_no,
                "vehicle_type": truck.vehicle_type,
                "vehicle_model": truck.vehicle_model,
                "manufacturer": truck.manufacturer,
                "fuel_type": truck.fuel_type,
                "registration_year": truck.registration_year,
                "load_capacity": truck.load_capacity,
                "status": truck.status,
                "availability": truck.availability,
            }
            for truck in trucks
        ],
    }
    
@router.get("/drivers/{driver_id}/trucks")
def get_driver_trucks(
    driver_id: int,
    db: Session = Depends(get_db),
):
    trucks = (
        db.query(DriverTruck)
        .filter(
            DriverTruck.driver_id == driver_id,
            DriverTruck.status == "APPROVED",
            DriverTruck.availability == "AVAILABLE",
        )
        .all()
    )

    return {
        "status": "success",
        "trucks": [
            {
                "id": truck.id,
                "vehicle_no": truck.vehicle_no,
                "vehicle_type": truck.vehicle_type,
                "availability": truck.availability,
            }
            for truck in trucks
        ],
    }
    
@router.put("/admin/truck/approve/{truck_id}")
def approve_truck(
    truck_id: int,
    db: Session = Depends(get_db),
):

    truck = (
        db.query(DriverTruck)
        .filter(DriverTruck.id == truck_id)
        .first()
    )

    if not truck:
        raise HTTPException(
            status_code=404,
            detail="Truck not found",
        )

    truck.status = "APPROVED"
    truck.availability = "AVAILABLE"

    db.commit()
    db.refresh(truck)

    return {
        "status": "success",
        "message": "Truck Approved",
        "truck": {
            "id": truck.id,
            "vehicle_no": truck.vehicle_no,
            "status": truck.status,
            "availability": truck.availability,
        },
    }
    
@router.put("/admin/truck/reject/{truck_id}")
def reject_truck(
    truck_id: int,
    db: Session = Depends(get_db),
):

    truck = (
        db.query(DriverTruck)
        .filter(DriverTruck.id == truck_id)
        .first()
    )

    if not truck:
        raise HTTPException(
            status_code=404,
            detail="Truck not found",
        )

    truck.status = "REJECTED"

    db.commit()
    db.refresh(truck)

    return {
        "status": "success",
        "message": "Truck Rejected",
        "truck": {
            "id": truck.id,
            "vehicle_no": truck.vehicle_no,
            "status": truck.status,
        },
    }