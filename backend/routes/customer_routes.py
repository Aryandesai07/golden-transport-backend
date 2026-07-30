from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import CustomerLoadRequest
from schemas import CustomerLoadRequestCreate

router = APIRouter(
    prefix="/customer",
    tags=["Customer"],
)


@router.post("/load-request")
def create_load_request(
    request: CustomerLoadRequestCreate,
    db: Session = Depends(get_db),
):

    load = CustomerLoadRequest(
        customer_name=request.customer_name,
        mobile=request.mobile,
        from_location=request.from_location,
        to_location=request.to_location,
        material=request.material,
        truck_type=request.truck_type,
        load_weight=request.load_weight,
        remarks=request.remarks,
        status="NEW",
    )

    db.add(load)
    db.commit()
    db.refresh(load)

    return {
        "status": "success",
        "message": "Load Request Submitted",
        "data": {
            "id": load.id,
            "customer_name": load.customer_name,
            "status": load.status,
        }
    }