import xml.etree.ElementTree as ET
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Driver

def export_drivers_to_xml():
    db: Session = SessionLocal()
    drivers = db.query(Driver).all()

    root = ET.Element("Drivers")

    for d in drivers:
        driver_elem = ET.SubElement(root, "Driver")
        ET.SubElement(driver_elem, "ID").text = str(d.id)
        ET.SubElement(driver_elem, "Name").text = d.name
        ET.SubElement(driver_elem, "Mobile").text = d.mobile
        ET.SubElement(driver_elem, "VehicleNo").text = d.vehicle_no
        ET.SubElement(driver_elem, "VehicleType").text = d.vehicle_type

    tree = ET.ElementTree(root)
    tree.write("drivers.xml", encoding="utf-8", xml_declaration=True)

if __name__ == "__main__":
    export_drivers_to_xml()
