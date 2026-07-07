import os
import time
from time import time
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

@router.get("/documents/{driver_id}")
def get_documents(
    driver_id: int,
    db: Session = Depends(get_db),
):

    document = (
        db.query(DriverDocument)
        .filter(DriverDocument.driver_id == driver_id)
        .first()
    )

    if document is None:
        return {
            "status": "success",
            "documents": {}
        }

    return {
    "status": "success",
    "documents": {
        "license": {
            "url": document.license_url,
            "status": document.license_status,
        },
        "aadhaar": {
            "url": document.aadhaar_url,
            "status": document.aadhaar_status,
        },
        "pan": {
            "url": document.pan_url,
            "status": document.pan_status,
        },
        "rc_book": {
            "url": document.rc_book_url,
            "status": document.rc_book_status,
        },
        "insurance": {
            "url": document.insurance_url,
            "status": document.insurance_status,
        },
        "puc": {
            "url": document.puc_url,
            "status": document.puc_status,
        },
    },
}
        
@router.post("/documents/upload")
async def upload_document(
    driver_id: int = Form(...),
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Validate document type
    valid_document_types = [
        "license",
        "aadhaar",
        "pan",
        "rc_book",
        "insurance",
        "puc",
    ]
    if document_type not in valid_document_types:
        raise HTTPException(400, "Invalid document type")

    # Upload file to Cloudinary
    try:
        result = cloudinary.uploader.upload(
            file.file,
            folder=f"driver_documents/{driver_id}/{document_type}",
            public_id=f"{driver_id}_{document_type}",
            overwrite=True,
            invalidate=True,
            resource_type="auto",
        )
        print(result)
    except Exception as e:
        raise HTTPException(500, f"Failed to upload document: {str(e)}")

    # Get the uploaded file URL
    file_url = result.get("secure_url")
    if not file_url:
        raise HTTPException(500, "Failed to retrieve uploaded file URL")

    # Update or create DriverDocument record
    document = (
        db.query(DriverDocument)
        .filter(DriverDocument.driver_id == driver_id)
        .first()
    )

    if not document:
        document = DriverDocument(driver_id=driver_id)
        db.add(document)

    setattr(document, f"{document_type}_url", file_url)
    setattr(document, f"{document_type}_status", "Pending Verification")

    db.commit()
    db.refresh(document)

    return {
        "status": "success",
        "message": f"{document_type.capitalize()} uploaded successfully",
        "url": file_url,
    }    