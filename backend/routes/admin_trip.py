from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

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