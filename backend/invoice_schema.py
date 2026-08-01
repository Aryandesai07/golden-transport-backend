from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict
from datetime import datetime

class InvoiceCreate(BaseModel):
    gst_percent: float = 18
    remarks: Optional[str] = None


class InvoiceResponse(BaseModel):
    
    model_config = ConfigDict(from_attributes=True)
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
    
    paid_amount: float

    class Config:
        from_attributes = True
        
# ==========================================
# Invoice Payment
# ==========================================

class InvoicePaymentCreate(BaseModel):
    amount: float
    payment_mode: str
    transaction_no: Optional[str] = None
    remarks: Optional[str] = None


class InvoicePaymentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    invoice_id: int
    amount: float
    payment_mode: str
    transaction_no: Optional[str]
    paid_date: datetime
    remarks: Optional[str]

    class Config:
        from_attributes = True