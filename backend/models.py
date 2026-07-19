from sqlalchemy import Boolean, Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime,timezone
# =========================
# DRIVER TABLE
# =========================
class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    mobile = Column(String, unique=True, index=True)
    password = Column(String)

    # Vehicle Information

    vehicle_no = Column(String)

    vehicle_type = Column(String)

    vehicle_model = Column(String, nullable=True)

    load_capacity = Column(String, nullable=True)

    manufacturer = Column(String, nullable=True)

    fuel_type = Column(String, nullable=True)

    registration_year = Column(String, nullable=True)
    earnings = Column(Integer, default=0)

    license_number = Column(String)
    address = Column(String)
    photo = Column(String)

    # Relationships
    trips = relationship("Trip", back_populates="driver")
    locations = relationship("DriverLocation", back_populates="driver")
    fuel_bills = relationship("FuelBill", back_populates="driver")
    sos_alerts = relationship("SOSAlert", back_populates="driver")
    notifications = relationship("Notification", back_populates="driver")
    payments = relationship("Payment", back_populates="driver")
    settings = relationship("DriverSettings", back_populates="driver", uselist=False)
    documents = relationship(
    "DriverDocument",
    back_populates="driver",
    uselist=False,
)


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)

    driver_id = Column(Integer, ForeignKey("drivers.id"))

    trip_number = Column(String, unique=True, index=True)

    customer_name = Column(String)

    customer_mobile = Column(String)

    pickup = Column(String)

    drop_location = Column(String)

    material = Column(String)

    load_weight = Column(String)

    amount = Column(Float)

    expected_delivery = Column(DateTime)

    remarks = Column(String, nullable=True)

    status = Column(String, default="ASSIGNED")

    proof_image = Column(String, nullable=True)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    driver = relationship("Driver", back_populates="trips")

    payments = relationship(
        "Payment",
        back_populates="trip",
    )

    delivery_proofs = relationship(
        "DeliveryProof",
        back_populates="trip",
    )
# =========================
# DRIVER LIVE LOCATION
# =========================

class DriverLocation(Base):
    __tablename__ = "driver_locations"

    id = Column(Integer, primary_key=True, index=True)

    driver_id = Column(
        Integer,
        ForeignKey("drivers.id"),
        index=True,
    )

    latitude = Column(Float)

    longitude = Column(Float)

    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
    )

    driver = relationship(
        "Driver",
        back_populates="locations",
    )
# =========================
# FUEL BILL
# =========================
class FuelBill(Base):
    __tablename__ = "fuel_bills"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), index=True)

    amount = Column(Integer)
    image_path = Column(String)

    driver = relationship("Driver", back_populates="fuel_bills")


# =========================
# SOS ALERT
# =========================
class SOSAlert(Base):
    __tablename__ = "sos_alerts"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), index=True)

    latitude = Column(Float)
    longitude = Column(Float)
    status = Column(String, default="ACTIVE")

    driver = relationship("Driver", back_populates="sos_alerts")


# =========================
# NOTIFICATIONS
# =========================
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), index=True)

    title = Column(String)
    message = Column(String)
    status = Column(String, default="UNREAD")

    driver = relationship("Driver", back_populates="notifications")


# =========================
# PAYMENTS
# =========================
class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), index=True)

    amount = Column(Integer)
    payment_date = Column(DateTime)
    status = Column(String, default="PAID")

    driver = relationship("Driver", back_populates="payments")
    trip = relationship("Trip", back_populates="payments")


# =========================
# DELIVERY PROOF
# =========================
class DeliveryProof(Base):
    __tablename__ = "delivery_proofs"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), index=True)
    image_path = Column(String)

    trip = relationship("Trip", back_populates="delivery_proofs")


# =========================
# DRIVER SETTINGS
# =========================
class DriverSettings(Base):
    __tablename__ = "driver_settings"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), index=True)

    gps_enabled = Column(Boolean, default=True)
    notifications = Column(Boolean, default=True)
    dark_mode = Column(Boolean, default=False)

    driver = relationship("Driver", back_populates="settings")

class DriverDocument(Base):
    __tablename__ = "driver_documents"

    id = Column(Integer, primary_key=True, index=True)

    driver_id = Column(
        Integer,
        ForeignKey("drivers.id"),
        nullable=False,
        unique=True,
    )

    # =========================
    # DOCUMENT PATHS
    # =========================

    license_url = Column(String, nullable=True)
    aadhaar_url = Column(String, nullable=True)
    pan_url = Column(String, nullable=True)

    rc_book_url = Column(String, nullable=True)
    insurance_url = Column(String, nullable=True)
    puc_url = Column(String, nullable=True)

    # =========================
    # DOCUMENT STATUS
    # =========================

    license_status = Column(String, default="Missing")
    aadhaar_status = Column(String, default="Missing")
    pan_status = Column(String, default="Missing")

    rc_book_status = Column(String, default="Missing")
    insurance_status = Column(String, default="Missing")
    puc_status = Column(String, default="Missing")
    
    # =========================
    # REJECTION REASONS
    # =========================

    license_rejection_reason = Column(String, nullable=True)
    aadhaar_rejection_reason = Column(String, nullable=True)
    pan_rejection_reason = Column(String, nullable=True)

    rc_book_rejection_reason = Column(String, nullable=True)
    insurance_rejection_reason = Column(String, nullable=True)
    puc_rejection_reason = Column(String, nullable=True)

    # =========================
    # CREATED DATE
    # =========================

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
    )

    # Relationship

    driver = relationship(
    "Driver",
    back_populates="documents",
)
    
# ==========================================
# ADMIN TABLE
# ==========================================

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, unique=True, nullable=False)

    full_name = Column(String, nullable=False)

    password = Column(String, nullable=False)

    role = Column(String, default="Admin")

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    
class AdminNotification(Base):
    __tablename__ = "admin_notifications"

    id = Column(Integer, primary_key=True, index=True)

    driver_id = Column(
        Integer,
        ForeignKey("drivers.id"),
        nullable=False,
    )

    title = Column(String, nullable=False)

    message = Column(String, nullable=False)

    type = Column(String, default="DOCUMENT")

    status = Column(String, default="UNREAD")

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
    )

    driver = relationship("Driver")