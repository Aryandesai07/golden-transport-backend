from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db

from models import Order, Driver, Trip

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

    if last_order:
        next_number = last_order.id + 1
    else:
        next_number = 1

    order = Order(
    order_number=f"ORD{1000 + next_number}",

    customer_name=data.customer_name,
    customer_phone=data.customer_phone,
    pickup=data.pickup,
    drop=data.drop,
    material=data.material,
    weight=data.weight,

    vehicle_type=data.vehicle_type,
    expected_delivery=data.expected_delivery,

    assigned_driver=(
        data.driver_id
        if data.driver_id and data.driver_id > 0
        else None
    ),

    freight=data.freight,
    advance=data.advance,
    notes=data.notes,
)

    db.add(order)
    db.commit()
    db.refresh(order)

    return {
        "status": "success",
        "message": "Order created successfully",
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

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    driver = db.query(Driver).filter(
        Driver.id == data.driver_id
    ).first()

    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    trip = db.query(Trip).filter(
        Trip.id == data.trip_id
    ).first()

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    order.assigned_driver = data.driver_id
    order.assigned_trip = data.trip_id
    order.status = "ASSIGNED"

    db.commit()

    return {
        "status": "success",
        "message": "Driver assigned successfully"
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
    
