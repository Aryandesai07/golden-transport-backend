from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db

from models import Admin

from admin_schema import (
    AdminLogin,
    AdminResponse,
)

from admin_auth import (
    create_admin_token,
)

from auth import verify_password

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)

@router.post(
    "/login",
    response_model=AdminResponse
)
def admin_login(
    data: AdminLogin,
    db: Session = Depends(get_db)
):

    admin = db.query(Admin).filter(

        Admin.username == data.username

    ).first()

    if not admin:

        return {

            "status": "error",

            "message": "Admin not found"

        }

    if not verify_password(

        data.password,

        admin.password

    ):

        return {

            "status": "error",

            "message": "Incorrect password"

        }

    token = create_admin_token(

        admin.id,

        admin.role

    )

    return {

        "status": "success",

        "message": "Login successful",

        "access_token": token,

        "role": admin.role,

        "full_name": admin.full_name

    }