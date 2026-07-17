from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from models import Driver, Trip, FuelBill, SOSAlert
from database import SessionLocal
from models import Driver, Trip
from schemas import TripCreate

router = APIRouter(
    prefix="/admin",
    tags=["Admin Trips"],
)


# ==============================
# DATABASE
# ==============================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==============================
# CREATE TRIP
# ==============================

@router.post("/create-trip")
def create_trip(
    trip: TripCreate,
    db: Session = Depends(get_db),
):

    # -----------------------------
    # Check Driver
    # -----------------------------

    driver = db.query(Driver).filter(
        Driver.id == trip.driver_id
    ).first()

    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not found",
        )

    # -----------------------------
    # Generate Trip Number
    # -----------------------------

    total_trips = db.query(Trip).count()

    trip_number = f"GT{1001 + total_trips}"

    # -----------------------------
    # Create Trip
    # -----------------------------

    new_trip = Trip(

        driver_id=trip.driver_id,

        trip_number=trip_number,

        customer_name=trip.customer_name,

        customer_mobile=trip.customer_mobile,

        pickup=trip.pickup,

        drop_location=trip.drop_location,

        material=trip.material,

        load_weight=trip.load_weight,

        amount=trip.amount,

        expected_delivery=trip.expected_delivery,

        remarks=trip.remarks,

        status="ASSIGNED",

    )

    # -----------------------------
    # Save
    # -----------------------------

    db.add(new_trip)

    db.commit()

    db.refresh(new_trip)

    # -----------------------------
    # Response
    # -----------------------------

    return {

        "status": "success",

        "message": "Trip Created Successfully",

        "trip": {

            "id": new_trip.id,

            "trip_number": new_trip.trip_number,

            "driver_id": new_trip.driver_id,

            "status": new_trip.status,

        },

    }
    
@router.get("/dashboard")
def admin_dashboard(db: Session = Depends(get_db)):

    recent_trips = (
        db.query(Trip)
        .order_by(Trip.id.desc())
        .limit(5)
        .all()
    )

    return {
        "status": "success",

        "stats": {
            "drivers": db.query(Driver).count(),

            "trips": db.query(Trip).count(),

            "active_trips": db.query(Trip).filter(
                Trip.status.in_(
                    [
                        "ASSIGNED",
                        "STARTED",
                        "REACHED_PICKUP",
                        "LOADED",
                        "IN_TRANSIT",
                    ]
                )
            ).count(),

            "fuel_bills": db.query(FuelBill).count(),

            "proofs": db.query(Trip).filter(
                Trip.proof_image.isnot(None)
            ).count(),

            "sos_alerts": db.query(SOSAlert).filter(
                SOSAlert.status == "ACTIVE"
            ).count(),
        },

        "recent_trips": [
            {
                "id": t.id,
                "trip_number": t.trip_number,
                "pickup": t.pickup,
                "drop": t.drop_location,
                "driver_id": t.driver_id,
                "status": t.status,
            }
            for t in recent_trips
        ],
    }
    
# =====================================
# GET ALL TRIPS
# =====================================

@router.get("/trips")
def get_all_trips(db: Session = Depends(get_db)):

    trips = db.query(Trip).order_by(Trip.id.desc()).all()

    return {
        "status": "success",
        "trips": [
            {
                "id": trip.id,
                "trip_number": trip.trip_number,
                "customer_name": trip.customer_name,
                "pickup": trip.pickup,
                "drop": trip.drop_location,
                "driver_id": trip.driver_id,
                "status": trip.status,
                "amount": trip.amount,
            }
            for trip in trips
        ],
    }