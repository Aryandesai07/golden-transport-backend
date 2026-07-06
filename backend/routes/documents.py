import os
from unittest import result

import cloudinary.uploader
from cloudinary_config import *

from fastapi.responses import FileResponse, RedirectResponse
from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from database import get_db
from models import DriverDocument
router = APIRouter()

@router.get("/documents/download/{driver_id}/{document_type}")
def download_document(
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
        raise HTTPException(404, "Documents not found")

    field = f"{document_type}_url"

    if not hasattr(document, field):
        raise HTTPException(400, "Invalid document type")

    url = getattr(document, field)

    if not url:
        raise HTTPException(404, "Document not uploaded")

    return RedirectResponse(url)

@router.post("/documents/upload")
async def upload_document(
    driver_id: int = Form(...),
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    print("========== CLOUDINARY VERSION ==========")
    print("Driver:", driver_id)
    print("Document:", document_type)

    allowed = [
        "license",
        "aadhaar",
        "pan",
        "rc_book",
        "insurance",
        "puc",
    ]

    if document_type not in allowed:
        raise HTTPException(
            status_code=400,
            detail="Invalid document type",
        )

    try:
        result = cloudinary.uploader.upload(
            file.file,
            resource_type="auto",
            folder=f"driver_documents/{document_type}",
            public_id=f"{driver_id}_{document_type}",
            overwrite=True,
        )

        print("UPLOAD SUCCESS")
        print(result)

        file_url = result["secure_url"]

    except Exception as e:
        print("UPLOAD FAILED")
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )

    document = (
        db.query(DriverDocument)
        .filter(DriverDocument.driver_id == driver_id)
        .first()
    )

    if document is None:
        document = DriverDocument(driver_id=driver_id)
        db.add(document)

    setattr(document, f"{document_type}_url", file_url)
    setattr(document, f"{document_type}_status", "Pending Verification")

    db.commit()
    db.refresh(document)

    return {
        "status": "success",
        "cloudinary": True,
        "url": file_url,
    }
        
        