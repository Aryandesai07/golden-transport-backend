from datetime import datetime
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from models import Order, Invoice

from invoice_schema import InvoiceCreate, InvoicePaymentCreate, InvoicePaymentResponse
from invoice_pdf import generate_invoice_pdf

from fastapi.responses import FileResponse
import os
from models import InvoicePayment
from payment_receipt_pdf import generate_payment_receipt

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
            
            "cancelled": invoice.cancelled,
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
        
    if invoice.cancelled:
        raise HTTPException(
            status_code=400,
            detail="This invoice has been cancelled."
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
 # ==========================================================
# ADD PAYMENT
# ==========================================================

@router.post(
    "/invoices/{invoice_id}/payment",
    response_model=InvoicePaymentResponse,
)
def add_invoice_payment(
    invoice_id: int,
    payment: InvoicePaymentCreate,
    db: Session = Depends(get_db),
):
    invoice = (
        db.query(Invoice)
        .filter(Invoice.id == invoice_id)
        .first()
    )

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found",
        )

    # Prevent payment on cancelled invoice
    if invoice.cancelled:
        raise HTTPException(
            status_code=400,
            detail="Invoice is cancelled."
        )

    payment_row = InvoicePayment(
        invoice_id=invoice.id,
        amount=payment.amount,
        payment_mode=payment.payment_mode,
        transaction_no=payment.transaction_no,
        remarks=payment.remarks,
        paid_date=datetime.now(timezone.utc),
    )

    db.add(payment_row)

    # Get payment ID before commit
    db.flush()

    order = (
        db.query(Order)
        .filter(Order.id == invoice.order_id)
        .first()
    )

    receipt_pdf = generate_payment_receipt(
        payment_row,
        invoice,
        order,
    )

    payment_row.receipt_pdf = receipt_pdf

    # Update invoice totals
    invoice.paid_amount += payment.amount

    invoice.balance = invoice.total_amount - invoice.paid_amount

    if invoice.paid_amount <= 0:
        invoice.payment_status = "UNPAID"

    elif invoice.paid_amount < invoice.total_amount:
        invoice.payment_status = "PARTIAL"

    else:
        invoice.payment_status = "PAID"
        invoice.balance = 0

    db.commit()
    db.refresh(payment_row)

    return payment_row


# ==========================================================
# PAYMENT HISTORY
# ==========================================================

@router.get("/invoices/{invoice_id}/payments")
def get_invoice_payments(
    invoice_id: int,
    db: Session = Depends(get_db),
):
    invoice = (
        db.query(Invoice)
        .filter(Invoice.id == invoice_id)
        .first()
    )

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found",
        )

    payments = (
        db.query(InvoicePayment)
        .filter(InvoicePayment.invoice_id == invoice_id)
        .order_by(InvoicePayment.paid_date.desc())
        .all()
    )

    result = []

    for p in payments:
        result.append({
            "id": p.id,
            "invoice_id": p.invoice_id,
            "amount": p.amount,
            "payment_mode": p.payment_mode,
            "transaction_no": p.transaction_no,
            "paid_date": p.paid_date,
            "remarks": p.remarks,
            "receipt_pdf": p.receipt_pdf,
            "receipt_url": f"/admin/payments/{p.id}/receipt",
        })

    return result


# ==========================================================
# DOWNLOAD PAYMENT RECEIPT PDF
# ==========================================================

@router.get("/payments/{payment_id}/receipt")
def download_payment_receipt(
    payment_id: int,
    db: Session = Depends(get_db),
):
    payment = (
        db.query(InvoicePayment)
        .filter(InvoicePayment.id == payment_id)
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    if not payment.receipt_pdf:
        raise HTTPException(
            status_code=404,
            detail="Receipt not generated",
        )

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    pdf_file = os.path.join(
        BASE_DIR,
        payment.receipt_pdf,
    )

    if not os.path.exists(pdf_file):
        raise HTTPException(
            status_code=404,
            detail="Receipt PDF not found",
        )

    return FileResponse(
        pdf_file,
        media_type="application/pdf",
        filename=os.path.basename(pdf_file),
    )
    
@router.get("/invoices/{invoice_id}/summary")
def invoice_summary(
    invoice_id: int,
    db: Session = Depends(get_db),
):
    invoice = (
        db.query(Invoice)
        .filter(Invoice.id == invoice_id)
        .first()
    )

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found",
        )

    order = (
        db.query(Order)
        .filter(Order.id == invoice.order_id)
        .first()
    )

    payments = (
        db.query(InvoicePayment)
        .filter(InvoicePayment.invoice_id == invoice.id)
        .order_by(InvoicePayment.paid_date.asc())
        .all()
    )

    payment_list = []

    total_paid = 0

    for p in payments:
        total_paid += p.amount

        payment_list.append({
            "payment_id": p.id,
            "date": p.paid_date,
            "amount": p.amount,
            "mode": p.payment_mode,
            "transaction_no": p.transaction_no,
            "receipt_url": f"/admin/payments/{p.id}/receipt",
        })

    return {
        "invoice": {
            "id": invoice.id,
            "invoice_number": invoice.invoice_number,
            "customer": order.customer_name,
            "invoice_date": invoice.invoice_date,
            "invoice_total": invoice.total_amount,
            "paid": total_paid,
            "balance": invoice.balance,
            "status": invoice.payment_status,
            
        },
        "payments": payment_list,
    }
    
@router.put("/invoices/{invoice_id}/cancel")
def cancel_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
):
    invoice = (
        db.query(Invoice)
        .filter(Invoice.id == invoice_id)
        .first()
    )

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found",
        )

    if invoice.paid_amount > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot cancel a paid invoice.",
        )

    invoice.cancelled = True
    invoice.payment_status = "CANCELLED"

    db.commit()

    return {
        "status": "success",
        "message": "Invoice cancelled successfully."
    }