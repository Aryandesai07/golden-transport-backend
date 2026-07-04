import os
from jose import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext

# =========================================
# CONFIG
# =========================================
SECRET_KEY = os.getenv("SECRET_KEY", "golden_transport_secret")  # Load from env in Railway
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))  # default 1 day

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# =========================================
# TOKEN FUNCTIONS
# =========================================
def create_access_token(data: dict):
    """Create JWT access token with expiry"""
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload.update({"exp": expire})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_access_token(token: str):
    """Decode and verify JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

# =========================================
# PASSWORD FUNCTIONS
# =========================================
def create_password_hash(password: str) -> str:
    """Hash plain password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against hashed password"""
    return pwd_context.verify(plain_password, hashed_password)
