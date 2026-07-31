from fastapi import APIRouter, Depends, HTTPException
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
    
@router.get("/admin/load-requests")
def get_load_requests(db: Session = Depends(get_db)):

    requests = (
        db.query(CustomerLoadRequest)
        .order_by(CustomerLoadRequest.id.desc())
        .all()
    )

    return {
        "status": "success",
        "requests": [
            {
                "id": r.id,
                "customer_name": r.customer_name,
                "mobile": r.mobile,
                "from_location": r.from_location,
                "to_location": r.to_location,
                "material": r.material,
                "truck_type": r.truck_type,
                "load_weight": r.load_weight,
                "remarks": r.remarks,
                "status": r.status,
                "created_at": r.created_at,
            }
            for r in requests
        ]
    }
    
@router.put("/admin/load-request/{request_id}")
def update_request_status(
    request_id: int,
    status: str,
    db: Session = Depends(get_db),
):

    request = (
        db.query(CustomerLoadRequest)
        .filter(CustomerLoadRequest.id == request_id)
        .first()
    )

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Request not found"
        )

    request.status = status

    db.commit()
    db.refresh(request)

    return {
        "status": "success",
        "message": "Updated successfully"
    }
    
@router.delete("/admin/load-request/{request_id}")
def delete_load_request(
    request_id: int,
    db: Session = Depends(get_db),
):

    request = (
        db.query(CustomerLoadRequest)
        .filter(CustomerLoadRequest.id == request_id)
        .first()
    )

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Request not found",
        )

    db.delete(request)
    db.commit()

    return {
        "status": "success",
        "message": "Customer request deleted successfully",
    }