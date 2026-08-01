import os
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RECEIPT_DIR = os.path.join(BASE_DIR, "receipts")

os.makedirs(RECEIPT_DIR, exist_ok=True)


def generate_payment_receipt(payment, invoice, order):
    filename = f"REC{payment.id:04d}.pdf"
    pdf_path = os.path.join(RECEIPT_DIR, filename)

    c = canvas.Canvas(pdf_path)

    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, 800, "Golden Transport")

    c.setFont("Helvetica", 11)
    c.drawString(50, 780, "PAYMENT RECEIPT")

    c.drawString(50, 740, f"Receipt No : REC{payment.id:04d}")
    c.drawString(50, 720, f"Invoice No : {invoice.invoice_number}")
    c.drawString(50, 700, f"Customer   : {order.customer_name}")
    c.drawString(50, 680, f"Amount     : ₹ {payment.amount:.2f}")
    c.drawString(50, 660, f"Mode       : {payment.payment_mode}")

    if payment.transaction_no:
        c.drawString(50, 640, f"Txn No     : {payment.transaction_no}")

    c.drawString(50, 620, f"Date       : {payment.paid_date}")

    if payment.remarks:
        c.drawString(50, 600, f"Remarks    : {payment.remarks}")

    c.drawString(50, 540, "Received With Thanks")

    c.save()

    return os.path.join("receipts", filename)