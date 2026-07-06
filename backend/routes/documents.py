import os
from unittest import result

import cloudinary.uploader
from cloudinary_config import *

from fastapi.responses import FileResponse
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
        .filter(
            DriverDocument.driver_id == driver_id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Documents not found",
        )

    field = f"{document_type}_url"

    if not hasattr(document, field):
        raise HTTPException(
            status_code=400,
            detail="Invalid document type",
        )

    filepath = getattr(document, field)

    if not filepath:
        raise HTTPException(
            status_code=404,
            detail="Document not uploaded",
        )

    if not os.path.exists(filepath):
        raise HTTPException(
            status_code=404,
            detail="File missing from server",
        )

    return FileResponse(
        path=filepath,
        filename=os.path.basename(filepath),
    )

@router.post("/documents/upload")
async def upload_document(
    driver_id: int = Form(...),
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    print("========== NEW CLOUDINARY CODE RUNNING ==========")

    # ==============================
    # Allowed document types
    # ==============================
    allowed = {
        "license": "uploads/licenses",
        "aadhaar": "uploads/aadhaar",
        "pan": "uploads/pan",
        "rc_book": "uploads/rc_book",
        "insurance": "uploads/insurance",
        "puc": "uploads/puc",
    }

    if document_type not in allowed:
        raise HTTPException(
            status_code=400,
            detail="Invalid document type",
        )

    try:
        # ==============================
        # Upload to Cloudinary
        # ==============================
        filename = f"{driver_id}_{document_type}"

        result = cloudinary.uploader.upload(
            file.file,
            resource_type="auto",      # Automatically detects PDF/JPG/PNG
            folder=f"driver_documents/{document_type}",
            public_id=filename,
            overwrite=True,
        )

        print("Cloudinary Upload Result:")
        print(result)

        file_url = result["secure_url"]

    except Exception as e:
        print("Cloudinary Upload Failed:")
        print(str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Cloudinary upload failed: {str(e)}",
        )

    # ==============================
    # Get or Create Database Record
    # ==============================
    document = (
        db.query(DriverDocument)
        .filter(
            DriverDocument.driver_id == driver_id
        )
        .first()
    )

    if document is None:
        document = DriverDocument(
            driver_id=driver_id
        )

        db.add(document)
        db.commit()
        db.refresh(document)

    # ==============================
    # Save Cloudinary URL
    # ==============================
    setattr(
        document,
        f"{document_type}_url",
        file_url,
    )

    setattr(
        document,
        f"{document_type}_status",
        "Pending Verification",
    )

    db.commit()
    db.refresh(document)

    # ==============================
    # Response
    # ==============================
    return {
        "status": "success",
        "message": "Document uploaded successfully.",
        "document_type": document_type,
        "file": {
            "url": file_url,
            "name": file.filename,
        },
    }
        
        