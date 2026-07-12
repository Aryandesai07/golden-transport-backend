from pydantic import BaseModel


class AdminLogin(BaseModel):

    username: str

    password: str


class AdminResponse(BaseModel):

    status: str

    message: str

    access_token: str | None = None

    role: str | None = None

    full_name: str | None = None