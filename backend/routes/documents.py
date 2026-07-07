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
        
        