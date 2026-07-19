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
    url_field = f"{document_type}_url"

    if not hasattr(document, status_field):
        raise HTTPException(
            status_code=400,
            detail="Invalid document type",
        )

    # Don't allow approval if no document is uploaded
    if not getattr(document, url_field):
        raise HTTPException(
            status_code=400,
            detail="Document not uploaded",
        )

    reason_field = f"{document_type}_rejection_reason"

    setattr(document, reason_field, None)

    db.commit()

    return {
        "status": "success",
        "message": f"{document_type} approved successfully",
    }


@router.post("/reject")
def reject_document(
    driver_id: int,
    document_type: str,
    reason: str,
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
    url_field = f"{document_type}_url"
    reason_field = f"{document_type}_rejection_reason"

    if not hasattr(document, status_field):
        raise HTTPException(
            status_code=400,
            detail="Invalid document type",
        )

    if not getattr(document, url_field):
        raise HTTPException(
            status_code=400,
            detail="Document not uploaded",
        )

    setattr(document, status_field, "Rejected")
    setattr(document, reason_field, reason)

    print("Reason Field:", reason_field)
    print("Reason:", reason)
    print("Value:", getattr(document, reason_field))
    
    db.commit()
    db.refresh(document)

    return {
        "status": "success",
        "message": f"{document_type} rejected successfully",
    }