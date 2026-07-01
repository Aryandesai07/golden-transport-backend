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

    vehicle_no = Column(String)
    vehicle_type = Column(String)
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


# =========================
# TRIP TABLE
# =========================
class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), index=True)

    pickup = Column(String)
    drop_location = Column(String)
    status = Column(String)

    proof_image = Column(String, nullable=True)

    # Relationships
    driver = relationship("Driver", back_populates="trips")
    payments = relationship("Payment", back_populates="trip")
    delivery_proofs = relationship("DeliveryProof", back_populates="trip")


# =========================
# DRIVER LIVE LOCATION
# =========================
class DriverLocation(Base):
    __tablename__ = "driver_locations"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), index=True)

    latitude = Column(Float)
    longitude = Column(Float)

    driver = relationship("Driver", back_populates="locations")


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
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)

    license_url = Column(String, nullable=True)
    aadhaar_url = Column(String, nullable=True)
    pan_url = Column(String, nullable=True)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )