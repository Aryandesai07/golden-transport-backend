from jose import jwt

from datetime import datetime, timedelta

import os

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "golden_transport_secret"
)

ALGORITHM = "HS256"

EXPIRE = 60 * 24


def create_admin_token(admin_id, role):

    expire = datetime.utcnow() + timedelta(
        minutes=EXPIRE
    )

    payload = {

        "admin_id": admin_id,

        "role": role,

        "exp": expire

    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )