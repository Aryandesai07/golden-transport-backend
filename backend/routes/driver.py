from fastapi import APIRouter, Depends, Form, UploadFile, File
from sqlalchemy.orm import Session
from fastapi.responses import HTMLResponse
import os
import shutil
import time
import folium
from database import SessionLocal
from models import (
    Driver,
    Notification,
    Trip,
    DriverLocation,
    FuelBill,
    Payment,
    SOSAlert
)
from schemas import (
    DriverLogin,
    SOSRequest,
    DriverCreate,
    LocationData
)
from auth import create_access_token
from config import (
    BASE_URL,
    UPLOAD_PROOFS,
    UPLOAD_FUEL
)
router = APIRouter(tags=["Driver"])

UPLOAD_DIR = UPLOAD_PROOFS
os.makedirs(UPLOAD_DIR, exist_ok=True)

# =========================================
# DATABASE CONNECTION
# =========================================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/update-status")
def update_status(data: dict, db: Session = Depends(get_db)):

    try:
        trip = db.query(Trip).filter(Trip.id == data["trip_id"]).first()

        if not trip:
            return {"status": "error", "message": "Trip not found"}

        trip.status = data["status"]

        db.commit()

        return {"status": "success", "message": "Status updated"}

    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}
# =========================================
# DRIVER LOGIN
# =========================================

@router.post("/login")
def login_driver(
    data: DriverLogin,
    db: Session = Depends(get_db)
):
    print("===================================")
    print("LOGIN REQUEST")
    print("Mobile :", data.mobile)
    print("Password :", data.password)

    driver = db.query(Driver).filter(
        Driver.mobile == data.mobile
    ).first()

    if driver is None:
        print("❌ Driver not found")

        return {
            "status": "error",
            "message": "Driver not found"
        }

    print("✅ Driver Found :", driver.name)
    print("Stored Password :", driver.password)

    # =====================================
    # SIMPLE PASSWORD CHECK
    # =====================================
    if data.password != driver.password:
        print("❌ Invalid Password")

        return {
            "status": "error",
            "message": "Invalid password"
        }

    token = create_access_token(
        {"driver_id": driver.id}
    )

    print("✅ Login Success")
    print("===================================")

    return {
        "status": "success",
        "message": "Login successful",
        "token": token,
        "driver": {
            "id": driver.id,
            "name": driver.name,
            "mobile": driver.mobile,
            "vehicle_no": driver.vehicle_no,
            "vehicle_type": driver.vehicle_type,
            "earnings": driver.earnings
        }
    }
# =========================================
# GET DRIVER TRIPS
# =========================================

@router.get("/trips/{driver_id}")
def get_trips(driver_id: int, db: Session = Depends(get_db)):

    trips = db.query(Trip).filter(Trip.driver_id == driver_id).all()

    if not trips:
        return {
            "status": "success",
            "trips": [],
            "message": "No trips assigned"
        }

    return {
        "status": "success",
        "trips": [
            {
                "trip_id": t.id,
                "pickup": t.pickup,
                "drop": t.drop_location,
                "status": t.status
            }
            for t in trips
        ]
    }
# =========================================
# UPDATE TRIP STATUS
# =========================================

@router.post("/update-profile")
def update_profile(data: dict, db: Session = Depends(get_db)):
    driver = db.query(Driver).filter(Driver.id == data["driver_id"]).first()

    if not driver:
        return {"status": "error", "message": "Driver not found"}

    driver.name = data["name"]
    driver.mobile = data["mobile"]
    driver.vehicle_no = data["vehicle_no"]

    db.commit()

    return {"status": "success", "message": "Profile updated"}
@router.get("/profile/{driver_id}")
def driver_profile(
    driver_id: int,
    db: Session = Depends(get_db)
):

    driver = db.query(Driver).filter(
        Driver.id == driver_id
    ).first()

    if not driver:
        return {"status": "error", "message": "Driver not found"}

    return {
        "status": "success",
        "driver": {
            "id": driver.id,
            "name": driver.name,
            "mobile": driver.mobile,
            "vehicle_no": driver.vehicle_no,
            "vehicle_type": driver.vehicle_type,
            "earnings": driver.earnings
        }
    }
    
@router.post("/location")
def update_location(
    data: LocationData,
    db: Session = Depends(get_db)
):

    location = db.query(DriverLocation).filter(
        DriverLocation.driver_id == data.driver_id
    ).first()

    if location:
        location.latitude = data.latitude
        location.longitude = data.longitude

    else:
        location = DriverLocation(
            driver_id=data.driver_id,
            latitude=data.latitude,
            longitude=data.longitude
        )
        db.add(location)

    db.commit()

    return {
        "status": "success"
    }
@router.post("/upload-fuel-bill/{driver_id}")
def upload_fuel_bill(
    driver_id: int,
    amount: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    folder = UPLOAD_FUEL
    os.makedirs(folder, exist_ok=True)

    filename = (
        f"{driver_id}_{int(time.time())}_{file.filename}"
    )

    file_path = os.path.join(
        folder,
        filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    bill = FuelBill(
        driver_id=driver_id,
        amount=amount,
        image_path=f"fuel_bills/{filename}"
    )

    db.add(bill)
    db.commit()
    db.refresh(bill)

    return {
        "status": "success",
        "message": "Fuel bill uploaded successfully",
        "bill_id": bill.id,
        "image_url":
            f"{BASE_URL}/uploads/fuel_bills/{filename}"
    }
# =========================================
# ADMIN LIVE MAP
# =========================================

@router.get("/admin/live-map")
def live_map(db: Session = Depends(get_db)):

    locations = db.query(DriverLocation).all()

    m = folium.Map(
        location=[20.5937, 78.9629],
        zoom_start=5
    )

    for loc in locations:

        driver = db.query(Driver).filter(
            Driver.id == loc.driver_id
        ).first()

        name = driver.name if driver else "Unknown"

        folium.Marker(
            [float(loc.latitude), float(loc.longitude)],
            popup=name,
            icon=folium.Icon(
                color="green",
                icon="truck",
                prefix="fa"
            )
        ).add_to(m)

    return HTMLResponse(m._repr_html_())


# =========================================
# SOS ALERT
# =========================================

@router.post("/sos")
def send_sos(
    data: SOSRequest,
    db: Session = Depends(get_db)
):

    alert = SOSAlert(
        driver_id=data.driver_id,
        latitude=str(data.latitude),
        longitude=str(data.longitude),
        status="ACTIVE"
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)

    notification = Notification(
        driver_id=data.driver_id,
        title="🚨 SOS ALERT",
        message=f"Driver {data.driver_id} sent emergency alert"
    )

    db.add(notification)
    db.commit()

    return {
        "status": "success",
        "message": "SOS sent successfully",
        "alert_id": alert.id
    }


# =========================================
# DRIVER NOTIFICATIONS
# =========================================

@router.get("/notifications/{driver_id}")
def get_notifications(
    driver_id: int,
    db: Session = Depends(get_db)
):

    notifications = db.query(Notification).filter(
        Notification.driver_id == driver_id
    ).all()

    return {
        "status": "success",
        "notifications": [
            {
                "id": n.id,
                "title": n.title,
                "message": n.message,
                "status": n.status
            }
            for n in notifications
        ]
    }


# =========================================
# DRIVER PAYMENTS
# =========================================

@router.get("/payments/{driver_id}")
def get_payments(
    driver_id: int,
    db: Session = Depends(get_db)
):

    payments = db.query(Payment).filter(
        Payment.driver_id == driver_id
    ).all()

    return {
        "status": "success",
        "payments": [
            {
                "id": p.id,
                "amount": p.amount,
                "trip_id": p.trip_id,
                "payment_date": p.payment_date,
                "status": p.status
            }
            for p in payments
        ]
    }


# =========================================
# TRIP HISTORY
# =========================================

@router.get("/trip-history/{driver_id}")
def trip_history(
    driver_id: int,
    db: Session = Depends(get_db)
):

    trips = db.query(Trip).filter(
        Trip.driver_id == driver_id,
        Trip.status == "DELIVERED"
    ).all()

    return {
        "status": "success",
        "trips": [
            {
                "trip_id": trip.id,
                "pickup": trip.pickup,
                "drop": trip.drop_location,
                "status": trip.status
            }
            for trip in trips
        ]
    }
# =========================================
# UPLOAD PROOF
# =========================================

@router.post("/upload-proof/{trip_id}")
def upload_proof(
    trip_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    folder = UPLOAD_PROOFS
    os.makedirs(folder, exist_ok=True)

    filename = f"{trip_id}_{int(time.time())}_{file.filename}"
    file_path = os.path.join(folder, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    trip = db.query(Trip).filter(
        Trip.id == trip_id
    ).first()

    if not trip:
        return {
            "status": "error",
            "message": "Trip not found"
        }

    relative_path = f"proofs/{filename}"

    trip.proof_image = relative_path

    db.commit()
    db.refresh(trip)

    return {
        "status": "success",
        "image_url": f"{BASE_URL}/uploads/{relative_path}",
        "trip_id": trip_id
    }


# =========================================
# ADMIN SOS ALERTS
# =========================================

@router.get("/admin/sos-alerts")
def get_sos_alerts(
    db: Session = Depends(get_db)
):

    alerts = db.query(SOSAlert).all()

    return {
        "status": "success",
        "alerts": [
            {
                "id": a.id,
                "driver_id": a.driver_id,
                "latitude": a.latitude,
                "longitude": a.longitude,
                "status": a.status
            }
            for a in alerts
        ]
    }
# =========================================
# ADMIN DASHBOARD
# =========================================

@router.get("/admin/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db)
):

    return {
        "drivers": db.query(Driver).count(),
        "trips": db.query(Trip).count(),

        "active_trips": db.query(Trip).filter(
            Trip.status.in_([
                "ASSIGNED",
                "LOADED",
                "IN_TRANSIT"
            ])
        ).count(),

        "fuel_bills": db.query(
            FuelBill
        ).count(),

        "proofs": db.query(Trip).filter(
            Trip.proof_image.isnot(None)
        ).count()
    }


# =========================================
# DRIVER REGISTER
# =========================================

@router.post("/register")
def register_driver(
    driver: DriverCreate,
    db: Session = Depends(get_db)
):
    try:
        print("===================================")
        print("REGISTER REQUEST")
        print("Name :", driver.name)
        print("Mobile :", driver.mobile)
        print("Password :", driver.password)
        print("Vehicle No :", driver.vehicle_no)
        print("Vehicle Type :", driver.vehicle_type)
        print("===================================")

        # Check if mobile already exists
        existing_driver = db.query(Driver).filter(
            Driver.mobile == driver.mobile
        ).first()

        if existing_driver:
            return {
                "status": "error",
                "message": "Mobile number already registered"
            }

        # Save password as plain text (TEMPORARY)
        new_driver = Driver(
            name=driver.name,
            mobile=driver.mobile,
            password=driver.password,
            vehicle_no=driver.vehicle_no,
            vehicle_type=driver.vehicle_type,
            earnings=0
        )

        db.add(new_driver)
        db.commit()
        db.refresh(new_driver)

        print("✅ Driver Registered Successfully")
        print("===================================")

        return {
            "status": "success",
            "message": "Driver registered successfully",
            "driver_id": new_driver.id
        }

    except Exception as e:
        db.rollback()

        print("REGISTER ERROR")
        print(str(e))
        print("===================================")

        return {
            "status": "error",
            "message": str(e)
        }

@router.get("/admin/drivers")
def get_all_drivers(db: Session = Depends(get_db)):
    drivers = db.query(Driver).all()

    return {
        "status": "success",
        "count": len(drivers),
        "drivers": [
            {
                "id": d.id,
                "name": d.name,
                "mobile": d.mobile,
                "vehicle_no": d.vehicle_no,
                "vehicle_type": d.vehicle_type,
            }
            for d in drivers
        ],
    }