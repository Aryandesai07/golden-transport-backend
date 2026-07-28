from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import extract, func

from database import get_db

from models import DriverTruck, Order, Driver, Trip

from order_schema import (
    OrderCreate,
    OrderUpdate,
    OrderAssign,
    OrderStatus,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin Orders"],
)

@router.post("/orders")
def create_order(
    data: OrderCreate,
    db: Session = Depends(get_db),
):

    last_order = (
        db.query(Order)
        .order_by(Order.id.desc())
        .first()
    )

    next_number = last_order.id + 1 if last_order else 1

    order = Order(
    order_number=f"ORD{1000 + next_number}",

    customer_name=data.customer_name,
    customer_phone=data.customer_phone,

    pickup=data.pickup,
    drop=data.drop,

    pickup_lat=data.pickup_lat,
    pickup_lng=data.pickup_lng,

    drop_lat=data.drop_lat,
    drop_lng=data.drop_lng,

    material=data.material,
    weight=data.weight,

    vehicle_type=data.vehicle_type,

    expected_delivery=data.expected_delivery,

    freight=data.freight,
    advance=data.advance,
    notes=data.notes,

    assigned_driver=None,
    assigned_trip=None,

    status="PENDING",
)

    db.add(order)
    db.commit()
    db.refresh(order)

    return {
        "status": "success",
        "message": "Order Created Successfully",
        "order_id": order.id,
    }
    
@router.get("/orders")
def get_orders(
    db: Session = Depends(get_db),
):

    orders = (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .all()
    )

    result = []

    for order in orders:

        result.append({

            "id": order.id,

            "order_number": order.order_number,

            "customer_name": order.customer_name,
            "customer_phone": order.customer_phone,

            "pickup": order.pickup,
            "drop": order.drop,
            
            "pickup_lat": order.pickup_lat,
            "pickup_lng": order.pickup_lng,

            "drop_lat": order.drop_lat,
            "drop_lng": order.drop_lng,

            "material": order.material,
            "weight": order.weight,

            "vehicle_type": order.vehicle_type,

            "status": order.status,

            "assigned_driver": order.assigned_driver,
            "assigned_trip": order.assigned_trip,

            "created_at": order.created_at,
            
            "expected_delivery": order.expected_delivery,

            "freight": order.freight,
            "advance": order.advance,
            "notes": order.notes,

            "driver_name": order.driver.name if order.driver else None,
            "vehicle_no": order.driver.vehicle_no if order.driver else None,
        })

    return {
        "status": "success",
        "orders": result,
    }
    
@router.get("/orders/{order_id}")
def get_order(
    order_id: int,
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

    return {
        "status": "success",
        "order": {

            "id": order.id,

            "order_number": order.order_number,

            "customer_name": order.customer_name,
            "customer_phone": order.customer_phone,

            "pickup": order.pickup,
            "drop": order.drop,
            
            "pickup_lat": order.pickup_lat,
            "pickup_lng": order.pickup_lng,

            "drop_lat": order.drop_lat,
            "drop_lng": order.drop_lng,

            "material": order.material,
            "weight": order.weight,

            "vehicle_type": order.vehicle_type,

            "expected_delivery": order.expected_delivery,

            "status": order.status,

            "assigned_driver": order.assigned_driver,
            "assigned_trip": order.assigned_trip,

            "created_at": order.created_at,
            
            "freight": order.freight,
            "advance": order.advance,
            "notes": order.notes,

            "driver_name": order.driver.name if order.driver else None,
            "vehicle_no": order.driver.vehicle_no if order.driver else None,
        }
    }
    
@router.put("/orders/{order_id}")
def update_order(
    order_id: int,
    data: OrderUpdate,
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

    update_data = data.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(order, key, value)

    db.commit()
    db.refresh(order)

    return {
        "status": "success",
        "message": "Order updated successfully"
    }
    
@router.delete("/orders/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    db.delete(order)
    db.commit()

    return {
        "status": "success",
        "message": "Order deleted successfully"
    }
    
@router.put("/orders/{order_id}/assign")
def assign_driver(
    order_id: int,
    data: OrderAssign,
    db: Session = Depends(get_db),
):

    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(404, "Order not found")

    driver = db.query(Driver).filter(
        Driver.id == data.driver_id
    ).first()
    
    truck = db.query(DriverTruck).filter(
        DriverTruck.id == data.truck_id
    ).first()

    if not truck:
        raise HTTPException(
            404,
            "Truck not found",
        )
        
    if truck.availability == "ON_TRIP":
        raise HTTPException(
            status_code=400,
            detail="Truck is already on another trip",
        )

    if not driver:
        raise HTTPException(404, "Driver not found")


    # ----------------------------------
    # Trip already exists?
    # ----------------------------------

    if order.assigned_trip:

        trip = db.query(Trip).filter(
            Trip.id == order.assigned_trip
        ).first()

        if not trip:
            raise HTTPException(404, "Trip not found")

        # If changing truck, free the old truck first
        if trip.truck_id and trip.truck_id != truck.id:
            old_truck = db.query(DriverTruck).filter(
                DriverTruck.id == trip.truck_id
            ).first()

            if old_truck:
                old_truck.availability = "AVAILABLE"

        trip.driver_id = driver.id
        trip.truck_id = truck.id

        # Selected truck is now busy
        truck.availability = "ON_TRIP"

        trip.customer_name = order.customer_name
        trip.customer_mobile = order.customer_phone
        
        trip.pickup = order.pickup
        trip.pickup_lat = order.pickup_lat
        trip.pickup_lng = order.pickup_lng

        trip.drop_location = order.drop
        trip.drop_lat = order.drop_lat
        trip.drop_lng = order.drop_lng
        
        
        trip.material = order.material

        trip.load_weight = str(order.weight)

        trip.amount = order.freight
        trip.expected_delivery = order.expected_delivery
        trip.remarks = order.notes

    else:

        last_trip = db.query(Trip).order_by(
            Trip.id.desc()
        ).first()

        next_trip = last_trip.id + 1 if last_trip else 1

        trip = Trip(
            trip_number=f"GT{1000 + next_trip}",

            driver_id=driver.id,
            truck_id=truck.id,

            customer_name=order.customer_name,
            customer_mobile=order.customer_phone,

            pickup=order.pickup,
            pickup_lat=order.pickup_lat,
            pickup_lng=order.pickup_lng,

            drop_location=order.drop,
            drop_lat=order.drop_lat,
            drop_lng=order.drop_lng,

            material=order.material,
            load_weight=str(order.weight),

            amount=order.freight,

            expected_delivery=order.expected_delivery,

            remarks=order.notes,

            status="ASSIGNED",
        )

        db.add(trip)
        db.flush()

        order.assigned_trip = trip.id


    order.assigned_driver = driver.id
    order.status = "ASSIGNED"

    db.commit()

    return {
        "status": "success",
        "message": "Driver Assigned Successfully"
    }
    
@router.get("/order-analytics")
def order_analytics(db: Session = Depends(get_db)):

    # -----------------------------
    # Summary
    # -----------------------------

    total_orders = db.query(Order).count()

    completed_orders = (
        db.query(Order)
        .filter(Order.status == "DELIVERED")
        .count()
    )

    pending_orders = (
        db.query(Order)
        .filter(
            Order.status.in_([
                "PENDING",
                "ASSIGNED",
                "LOADED",
                "IN_TRANSIT",
            ])
        )
        .count()
    )

    cancelled_orders = (
        db.query(Order)
        .filter(Order.status == "CANCELLED")
        .count()
    )

    # -----------------------------
    # Chart (Jan-Jun)
    # -----------------------------

    current_year = datetime.now().year

    received = []
    delivered = []

    current_month = datetime.now().month

    start_month = max(1, current_month - 5)

    for month in range(start_month, current_month + 1):

        received_count = (
            db.query(Order)
            .filter(
                extract("year", Order.created_at) == current_year,
                extract("month", Order.created_at) == month,
            )
            .count()
        )

        delivered_count = (
            db.query(Order)
            .filter(
                Order.status == "DELIVERED",
                extract("year", Order.created_at) == current_year,
                extract("month", Order.created_at) == month,
            )
            .count()
        )

        received.append(received_count)
        delivered.append(delivered_count)

    # -----------------------------
    # Response
    # -----------------------------

    return {
        "status": "success",
        "summary": {
            "total_orders": total_orders,
            "completed": completed_orders,
            "pending": pending_orders,
            "cancelled": cancelled_orders,
        },
        "chart": {
            "received": received,
            "completed": delivered,
        },
    }
    
@router.put("/orders/{order_id}/status")
def change_order_status(
    order_id: int,
    data: OrderStatus,
    db: Session = Depends(get_db),
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order.status = data.status

    db.commit()

    return {
        "status": "success",
        "message": "Order status updated"
    }
    
@router.get("/order-dashboard")
def order_dashboard(
    db: Session = Depends(get_db),
):

    return {
        "status": "success",
        "dashboard": {

            "total_orders":
                db.query(Order).count(),

            "pending":
                db.query(Order)
                .filter(Order.status == "PENDING")
                .count(),

            "assigned":
                db.query(Order)
                .filter(Order.status == "ASSIGNED")
                .count(),

            "loaded":
                db.query(Order)
                .filter(Order.status == "LOADED")
                .count(),

            "in_transit":
                db.query(Order)
                .filter(Order.status == "IN_TRANSIT")
                .count(),

            "delivered":
                db.query(Order)
                .filter(Order.status == "DELIVERED")
                .count(),

            "cancelled":
                db.query(Order)
                .filter(Order.status == "CANCELLED")
                .count(),
        }
    }
    
@router.get("/order-analytics")
def order_analytics(
    db: Session = Depends(get_db),
):

    monthly = (
        db.query(
            func.to_char(Order.created_at, "Mon").label("month"),
            func.count(Order.id).label("orders"),
        )
        .group_by(
            func.to_char(Order.created_at, "Mon")
        )
        .order_by(
            func.min(Order.created_at)
        )
        .all()
    )

    return {
        "status": "success",
        "monthly": [
            {
                "month": m.month,
                "orders": m.orders,
            }
            for m in monthly
        ]
    }
    
