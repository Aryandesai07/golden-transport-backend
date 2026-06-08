from sqlalchemy import Boolean, Column, Integer, String, Float
from database import Base


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


# =========================
# TRIP TABLE
# =========================
class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)

    driver_id = Column(Integer, index=True)

    pickup = Column(String)
    drop_location = Column(String)   # ✅ FIXED (better naming)
    status = Column(String)

    # 🔥 DELIVERY PROOF IMAGE
    proof_image = Column(String, nullable=True)


# =========================
# DRIVER LIVE LOCATION
# =========================
class DriverLocation(Base):
    __tablename__ = "driver_locations"

    id = Column(Integer, primary_key=True, index=True)

    driver_id = Column(Integer, index=True)

    latitude = Column(Float)
    longitude = Column(Float)


# =========================
# FUEL BILL
# =========================
class FuelBill(Base):
    __tablename__ = "fuel_bills"

    id = Column(Integer, primary_key=True, index=True)

    driver_id = Column(Integer, index=True)

    amount = Column(Integer)
    image_path = Column(String)


# =========================
# SOS ALERT
# =========================
class SOSAlert(Base):
    __tablename__ = "sos_alerts"

    id = Column(Integer, primary_key=True, index=True)

    driver_id = Column(Integer, index=True)

    latitude = Column(String)
    longitude = Column(String)

    status = Column(String, default="ACTIVE")
# =========================
# NOTIFICATIONS
# =========================
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    driver_id = Column(Integer, index=True)

    title = Column(String)
    message = Column(String)

    status = Column(String, default="UNREAD")


# =========================
# PAYMENTS
# =========================
class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    driver_id = Column(Integer, index=True)
    trip_id = Column(Integer, index=True)

    amount = Column(Integer)
    payment_date = Column(String)

    status = Column(String, default="PAID")
    
class DeliveryProof(Base):
    __tablename__ = "delivery_proofs"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer)
    image_path = Column(String)
    
class DriverSettings(Base):
    __tablename__ = "driver_settings"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer)
    gps_enabled = Column(Boolean, default=True)
    notifications = Column(Boolean, default=True)
    dark_mode = Column(Boolean, default=False)