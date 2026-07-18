from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import DriverDocument

router = APIRouter(
    prefix="/admin/documents",
    tags=["Admin Documents"],
)

@router.post("/approve")
def approve_document(
    driver_id: int,
    document_type: str,
    db: Session = Depends(get_db),
):
    document = (
        db.query(DriverDocument)
        .filter(DriverDocument.driver_id == driver_id)
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Documents not found",
        )

    status_field = f"{document_type}_status"

    if not hasattr(document, status_field):
        raise HTTPException(
            status_code=400,
            detail="Invalid document type",
        )

    setattr(document, status_field, "Approved")

    db.commit()

    return {
        "status": "success",
        "message": f"{document_type} approved successfully"
    }