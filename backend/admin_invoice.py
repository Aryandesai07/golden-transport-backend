from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from models import Order, Invoice

from invoice_schema import InvoiceCreate

router = APIRouter(
    prefix="/admin",
    tags=["Admin Invoice"],
)

@router.post("/orders/{order_id}/invoice")
def generate_invoice(
    order_id: int,
    data: InvoiceCreate,
    db: Session = Depends(get_db),
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    already = db.query(Invoice).filter(
        Invoice.order_id == order.id
    ).first()

    if already:
        raise HTTPException(
            status_code=400,
            detail="Invoice already generated",
        )

    last = db.query(Invoice).order_by(
        Invoice.id.desc()
    ).first()

    next_no = last.id + 1 if last else 1

    subtotal = order.freight

    gst_amount = subtotal * data.gst_percent / 100

    total = subtotal + gst_amount

    balance = total - order.advance

    invoice = Invoice(

        invoice_number=f"INV{1000 + next_no}",

        order_id=order.id,

        invoice_date=datetime.today().date(),

        subtotal=subtotal,

        gst_percent=data.gst_percent,

        gst_amount=gst_amount,

        total_amount=total,

        advance=order.advance,

        balance=balance,

        payment_status="UNPAID",

        remarks=data.remarks,
    )

    db.add(invoice)

    db.commit()

    db.refresh(invoice)

    return {
        "status": "success",
        "invoice": {
            "id": invoice.id,
            "invoice_number": invoice.invoice_number,
            "total_amount": invoice.total_amount,
        }
    }