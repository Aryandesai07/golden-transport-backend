import os

from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
)
from reportlab.lib.styles import getSampleStyleSheet


def generate_invoice_pdf(invoice, order):

    # ==========================================
    # BASE DIRECTORY
    # ==========================================
    BASE_DIR = os.path.dirname(
        os.path.abspath(__file__)
    )

    # ==========================================
    # CREATE invoices FOLDER
    # ==========================================
    folder = os.path.join(
        BASE_DIR,
        "invoices",
    )

    os.makedirs(folder, exist_ok=True)

    # ==========================================
    # FILE NAME
    # ==========================================
    filename = f"{invoice.invoice_number}.pdf"

    filepath = os.path.join(
        folder,
        filename,
    )

    # ==========================================
    # PDF DOCUMENT
    # ==========================================
    doc = SimpleDocTemplate(filepath)

    styles = getSampleStyleSheet()

    story = []

    # ==========================================
    # COMPANY
    # ==========================================
    story.append(
        Paragraph(
            "<b>GOLDEN TRANSPORT</b>",
            styles["Title"],
        )
    )

    story.append(
        Spacer(
            1,
            0.25 * inch,
        )
    )

    # ==========================================
    # INVOICE DETAILS
    # ==========================================
    story.append(
        Paragraph(
            f"<b>Invoice No:</b> {invoice.invoice_number}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Date:</b> {invoice.invoice_date}",
            styles["Normal"],
        )
    )

    story.append(
        Spacer(
            1,
            0.20 * inch,
        )
    )

    # ==========================================
    # CUSTOMER DETAILS
    # ==========================================
    story.append(
        Paragraph(
            f"<b>Customer:</b> {order.customer_name}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Phone:</b> {order.customer_phone}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Pickup:</b> {order.pickup}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Destination:</b> {order.drop}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Material:</b> {order.material}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Weight:</b> {order.weight}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Vehicle:</b> {order.vehicle_type}",
            styles["Normal"],
        )
    )

    story.append(
        Spacer(
            1,
            0.25 * inch,
        )
    )

    # ==========================================
    # BILL DETAILS
    # ==========================================
    story.append(
        Paragraph(
            f"<b>Freight:</b> ₹ {invoice.subtotal:.2f}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"<b>GST ({invoice.gst_percent}%):</b> ₹ {invoice.gst_amount:.2f}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Advance:</b> ₹ {invoice.advance:.2f}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Total:</b> ₹ {invoice.total_amount:.2f}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Balance:</b> ₹ {invoice.balance:.2f}",
            styles["Normal"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Payment Status:</b> {invoice.payment_status}",
            styles["Normal"],
        )
    )

    if invoice.remarks:
        story.append(
            Paragraph(
                f"<b>Remarks:</b> {invoice.remarks}",
                styles["Normal"],
            )
        )

    story.append(
        Spacer(
            1,
            0.5 * inch,
        )
    )

    # ==========================================
    # SIGNATURE
    # ==========================================
    story.append(
        Paragraph(
            "Authorized Signature",
            styles["Heading2"],
        )
    )

    # ==========================================
    # BUILD PDF
    # ==========================================
    doc.build(story)

    # ==========================================
    # SAVE RELATIVE PATH IN DATABASE
    # ==========================================
    return f"invoices/{filename}"