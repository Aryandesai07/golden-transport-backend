from datetime import date
from typing import Optional

from pydantic import BaseModel


class InvoiceCreate(BaseModel):
    gst_percent: float = 18
    remarks: Optional[str] = None


class InvoiceResponse(BaseModel):
    id: int
    invoice_number: str

    order_id: int

    invoice_date: date

    subtotal: float
    gst_percent: float
    gst_amount: float

    total_amount: float

    advance: float
    balance: float

    payment_status: str

    remarks: Optional[str]

    class Config:
        orm_mode = True