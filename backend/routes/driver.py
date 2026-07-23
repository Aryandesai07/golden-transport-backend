import traceback

from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from fastapi.responses import HTMLResponse
import os
import shutil
import time
import folium
from database import SessionLocal
import cloudinary.uploader
import cloudinary_config

from models import (
    Driver,
    Notification,
    Order,
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

@router.get("/route-test")
def route_test():
    return {"message": "driver router working"}

@router.put("/update-vehicle/{driver_id}")
def update_vehicle(
    driver_id:int,
    data:dict,
    db:Session=Depends(get_db)
):

    driver = db.query(Driver).filter(
        Driver.id==driver_id
    ).first()


    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )


    driver.vehicle_type = data.get(
        "vehicle_type"
    )

    driver.vehicle_model = data.get(
        "vehicle_model"
    )

    driver.load_capacity = data.get(
        "load_capacity"
    )


    db.commit()
    db.refresh(driver)


    return {
        "status":"success",
        "message":"Vehicle updated",
        "driver":driver
    }
    
@router.post("/update-trip-status")
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
    # PASSWORD CHECK
    # =====================================

    if data.password != driver.password:
        print("❌ Invalid Password")

        return {
            "status": "error",
            "message": "Invalid password"
        }

    # =====================================
    # SET DRIVER ONLINE
    # =====================================

    driver.online = True
    db.commit()
    db.refresh(driver)

    # =====================================
    # CREATE TOKEN
    # =====================================

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
            "earnings": driver.earnings,
            "photo": driver.photo,
            "online": driver.online
        }
    }
    
@router.post("/logout")
def logout_driver(data: dict, db: Session = Depends(get_db)):

    driver = db.query(Driver).filter(
        Driver.id == data["driver_id"]
    ).first()

    if not driver:
        return {
            "status": "error",
            "message": "Driver not found"
        }

    driver.online = False

    db.commit()

    return {
        "status": "success",
        "message": "Logged out"
    }
# =========================================
# GET DRIVER TRIPS
# =========================================

@router.get("/trips/{driver_id}")
def get_trips(driver_id: int, db: Session = Depends(get_db)):
    try:
        print("========== GET TRIPS ==========")
        print("Driver ID:", driver_id)

        trips = db.query(Trip).filter(
            Trip.driver_id == driver_id
        ).all()

        print("Trips:", trips)

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

    except Exception as e:
        import traceback
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
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
    "earnings": driver.earnings,
    "photo": driver.photo,
    "online": driver.online,
}
}
    
@router.post("/upload-profile-photo")
async def upload_profile_photo(
    driver_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    driver = db.query(Driver).filter(
        Driver.id == driver_id
    ).first()

    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not found",
        )

    upload_result = cloudinary.uploader.upload(
        file.file,
        folder=f"driver_profile/{driver_id}",
        public_id=f"profile_{driver_id}",
        overwrite=True,
        resource_type="image",
    )

    driver.photo = upload_result["secure_url"]

    db.commit()
    db.refresh(driver)

    return {
        "status": "success",
        "message": "Profile photo uploaded successfully",
        "photo": driver.photo,
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
    trip_id: int = Form(...),
    amount: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Upload image directly to Cloudinary
    result = cloudinary.uploader.upload(
        file.file,
        folder=f"fuel_bills/{driver_id}",
        public_id=f"fuel_{int(time.time())}",
        resource_type="image",
    )

    image_url = result["secure_url"]

    # Save Fuel Bill
    bill = FuelBill(
    driver_id=driver_id,
    trip_id=trip_id,
    amount=amount,
    image_path=image_url,
    status="PENDING",
)

    db.add(bill)
    db.commit()
    db.refresh(bill)

    return {
    "status": "success",
    "message": "Fuel bill uploaded successfully",
    "bill": {
        "id": bill.id,
        "trip_id": bill.trip_id,
        "driver_id": bill.driver_id,
        "amount": bill.amount,
        "status": bill.status,
        "image_url": bill.image_path,
    },
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
@router.get("/admin/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db)
):

    recent_orders = (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .limit(5)
        .all()
    )

    return {

        "stats": {

            "drivers": db.query(Driver).count(),

            "trips": db.query(Trip).count(),

            "active_trips": db.query(Trip).filter(
                Trip.status.in_([
                    "ASSIGNED",
                    "LOADED",
                    "IN_TRANSIT"
                ])
            ).count(),

            "fuel_bills": db.query(FuelBill).count(),

            "proofs": db.query(Trip).filter(
                Trip.proof_image.isnot(None)
            ).count(),

            "sos_alerts": db.query(SOSAlert).count(),

        },

        "recent_orders": [

            {

                "id": order.id,

                "order_number": order.order_number,

                "customer_name": order.customer_name,

                "driver_name": (
                    order.driver.name
                    if order.driver
                    else None
                ),

                "vehicle_no": (
                    order.driver.vehicle_no
                    if order.driver
                    else None
                ),

                "freight": order.freight,

                "status": order.status,

            }

            for order in recent_orders

        ]

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
                "photo": d.photo,
                "online": d.online,
            }
            for d in drivers
        ],
    }
    
