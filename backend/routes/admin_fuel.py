from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from fastapi import Body
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

@router.put("/fuel-bills/{bill_id}/approve")
def approve_fuel_bill(
    bill_id: int,
    db: Session = Depends(get_db),
):
    bill = db.query(FuelBill).filter(
        FuelBill.id == bill_id
    ).first()

    if not bill:
        raise HTTPException(
            status_code=404,
            detail="Fuel bill not found",
        )

    bill.status = "APPROVED"

    db.commit()

    return {
        "status": "success",
        "message": "Fuel bill approved",
    }

@router.put("/fuel-bills/{bill_id}/reject")
def reject_fuel_bill(
    bill_id: int,
    reason: str = Body(..., embed=True),
    db: Session = Depends(get_db),
):
    bill = db.query(FuelBill).filter(
        FuelBill.id == bill_id
    ).first()

    if not bill:
        raise HTTPException(
            status_code=404,
            detail="Fuel bill not found",
        )

    bill.status = "REJECTED"
    bill.rejection_reason = reason

    db.commit()

    return {
        "status": "success",
        "message": "Fuel bill rejected",
    }
    
@router.get("/fuel-summary")
def fuel_summary(db: Session = Depends(get_db)):

    drivers = db.query(Driver).all()

    result = []

    for driver in drivers:

        pending = db.query(func.count(FuelBill.id)).filter(
            FuelBill.driver_id == driver.id,
            FuelBill.status == "PENDING",
        ).scalar()

        approved = db.query(func.count(FuelBill.id)).filter(
            FuelBill.driver_id == driver.id,
            FuelBill.status == "APPROVED",
        ).scalar()

        rejected = db.query(func.count(FuelBill.id)).filter(
            FuelBill.driver_id == driver.id,
            FuelBill.status == "REJECTED",
        ).scalar()

        total_amount = (
            db.query(
                func.coalesce(func.sum(FuelBill.amount), 0)
            )
            .filter(
                FuelBill.driver_id == driver.id,
                FuelBill.status == "APPROVED"
            )
            .scalar()
        )

        result.append({
            "driver_id": driver.id,
            "driver_name": driver.name,
            "vehicle_no": driver.vehicle_no,
            "pending": pending,
            "approved": approved,
            "rejected": rejected,
            "total_amount": total_amount,
        })

    return {
        "status": "success",
        "drivers": result,
    }
    
@router.get("/fuel-bills/{driver_id}")
def get_driver_fuel_bills(
    driver_id: int,
    db: Session = Depends(get_db),
):

    bills = (
        db.query(FuelBill)
        .filter(FuelBill.driver_id == driver_id)
        .order_by(FuelBill.created_at.desc())
        .all()
    )

    data = []

    for bill in bills:

        data.append({
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
        "fuel_bills": data,
    }
    
@router.get("/fuel-analytics")
def fuel_analytics(db: Session = Depends(get_db)):

    total_cost = (
        db.query(
            func.coalesce(func.sum(FuelBill.amount), 0)
        )
        .filter(FuelBill.status == "APPROVED")
        .scalar()
    )

    total_liters = (
        db.query(
            func.coalesce(func.sum(FuelBill.liters), 0)
        )
        .filter(FuelBill.status == "APPROVED")
        .scalar()
    )

    monthly = (
        db.query(
            func.extract("month", FuelBill.created_at).label("month_no"),
            func.sum(FuelBill.amount).label("amount"),
        )
        .filter(FuelBill.status == "APPROVED")
        .group_by(func.extract("month", FuelBill.created_at))
        .order_by(func.extract("month", FuelBill.created_at))
        .all()
    )

    months = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ]

    return {
        "status": "success",
        "fuel_cost": float(total_cost),
        "fuel_used": float(total_liters),
        "average_mileage": 0,
        "monthly": [
            {
                "month": months[int(row.month_no)],
                "value": float(row.amount)
            }
            for row in monthly
        ]
    }
    
@router.get("/fuel-dashboard")
def fuel_dashboard(db: Session = Depends(get_db)):

    total_bills = db.query(FuelBill).count()

    approved = db.query(FuelBill).filter(
        FuelBill.status == "APPROVED"
    ).count()

    pending = db.query(FuelBill).filter(
        FuelBill.status == "PENDING"
    ).count()

    rejected = db.query(FuelBill).filter(
        FuelBill.status == "REJECTED"
    ).count()

    total_amount = (
    db.query(
        func.coalesce(func.sum(FuelBill.amount), 0)
    )
    .filter(FuelBill.status == "APPROVED")
    .scalar()
)

    return {
        "status": "success",
        "dashboard": {
            "total_bills": total_bills,
            "approved": approved,
            "pending": pending,
            "rejected": rejected,
            "total_amount": total_amount
        }
    }