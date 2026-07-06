import os
import shutil
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
        raise HTTPException(status_code=400, detail="Invalid document type")

    # ==============================
    # SAVE FILE
    # ==============================
    folder = allowed[document_type]
    os.makedirs(folder, exist_ok=True)

    filename = f"{driver_id}_{document_type}_{file.filename}"
    filepath = os.path.join(folder, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ==============================
    # CREATE OR GET DB RECORD
    # ==============================
    document = (
        db.query(DriverDocument)
        .filter(DriverDocument.driver_id == driver_id)
        .first()
    )

    if document is None:
        document = DriverDocument(driver_id=driver_id)
        db.add(document)
        db.commit()
        db.refresh(document)

    # ==============================
    # BUILD PUBLIC URL (IMPORTANT FIX)
    # ==============================
    base_url = "https://golden-transport-backend-production.up.railway.app"

    public_url = f"{base_url}/uploads/{document_type}/{filename}"

    # ==============================
    # SAVE TO DATABASE (STORE URL NOT FILEPATH)
    # ==============================
    setattr(
        document,
        f"{document_type}_url",
        public_url,
    )

    setattr(
        document,
        f"{document_type}_status",
        "Pending Verification",
    )

    db.commit()

    # ==============================
    # RESPONSE (FRONTEND SAFE)
    # ==============================
    return {
        "status": "success",
        "message": "Document uploaded successfully",
        "file": {
            "url": public_url,
            "name": filename
        },
        "document_type": document_type
    }
        
        