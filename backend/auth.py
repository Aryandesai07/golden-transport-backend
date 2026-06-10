from jose import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext

SECRET_KEY = "golden_transport_secret"

ALGORITHM = "HS256"

def create_access_token(data: dict):

    payload = data.copy()

    expire = datetime.utcnow() + timedelta(days=1)

    payload.update({"exp": expire})

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def create_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(
    plain_password: str,
    hashed_password: str
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )