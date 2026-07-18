from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

security = HTTPBearer()

SECRET_KEY = "YOUR_SECRET_KEY"   # use the same key from admin_auth.py
ALGORITHM = "HS256"


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        admin_id = payload.get("id")
        role = payload.get("role")

        if admin_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid Token",
            )

        return payload

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token",
        )