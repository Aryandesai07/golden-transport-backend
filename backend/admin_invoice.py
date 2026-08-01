from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from models import Order, Invoice

from invoice_schema import InvoiceCreate
from invoice_pdf import generate_invoice_pdf

from fastapi.responses import FileResponse
import os

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

    db.flush()

    pdf = generate_invoice_pdf(
        invoice,
        order,
    )

    invoice.pdf_path = pdf

    db.commit()

    db.refresh(invoice)

    return {
    "status": "success",
    "invoice": {
        "id": invoice.id,
        "invoice_number": invoice.invoice_number,
        "invoice_date": invoice.invoice_date,
        "total_amount": invoice.total_amount,
        "pdf_path": invoice.pdf_path,
    }
}
    
@router.get("/orders/{order_id}/invoice")
def get_invoice(
    order_id: int,
    db: Session = Depends(get_db),
):

    invoice = db.query(Invoice).filter(
        Invoice.order_id == order_id
    ).first()

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found",
        )

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    return {
        "status": "success",
        "invoice": {

            "id": invoice.id,

            "invoice_number": invoice.invoice_number,

            "invoice_date": invoice.invoice_date,

            "customer_name": order.customer_name,

            "customer_phone": order.customer_phone,

            "pickup": order.pickup,

            "drop": order.drop,

            "material": order.material,

            "weight": order.weight,

            "vehicle_type": order.vehicle_type,

            "subtotal": invoice.subtotal,

            "gst_percent": invoice.gst_percent,

            "gst_amount": invoice.gst_amount,

            "total_amount": invoice.total_amount,

            "advance": invoice.advance,

            "balance": invoice.balance,

            "payment_status": invoice.payment_status,

            "remarks": invoice.remarks,
            
            "pdf_path": invoice.pdf_path,
        }
    }
    
@router.get("/orders/{order_id}/invoice/pdf")
def download_invoice_pdf(
    order_id: int,
    db: Session = Depends(get_db),
):

    invoice = db.query(Invoice).filter(
        Invoice.order_id == order_id
    ).first()

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found",
        )

    if not invoice.pdf_path:
        raise HTTPException(
            status_code=404,
            detail="PDF path not found",
        )

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    pdf_file = os.path.join(BASE_DIR, invoice.pdf_path)

    print(pdf_file)

    if not os.path.exists(pdf_file):
        raise HTTPException(
            status_code=404,
            detail=f"PDF file missing: {pdf_file}",
        )

    return FileResponse(
        pdf_file,
        media_type="application/pdf",
        filename=os.path.basename(pdf_file),
    )