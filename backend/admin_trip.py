from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Trip

router = APIRouter(
    prefix="/admin",
    tags=["Admin Trips"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/driver/{driver_id}/trips")
def driver_trip_history(
    driver_id: int,
    db: Session = Depends(get_db),
):
    trips = (
        db.query(Trip)
        .filter(Trip.driver_id == driver_id)
        .order_by(Trip.id.desc())
        .all()
    )

    return {
        "status": "success",
        "count": len(trips),
        "trips": [
            {
                "trip_id": t.id,
                "trip_number": t.trip_number,
                "pickup": t.pickup,
                "drop": t.drop_location,
                "material": t.material,
                "amount": t.amount,
                "status": t.status,
                "proof_image": t.proof_image,
                "expected_delivery": t.expected_delivery,
                "created_at": t.created_at,
            }
            for t in trips
        ],
    }