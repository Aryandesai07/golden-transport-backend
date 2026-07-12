from database import SessionLocal
from models import Admin
from auth import create_password_hash

db = SessionLocal()

username = "admin"

existing = db.query(Admin).filter(
    Admin.username == username
).first()

if existing:
    print("Admin already exists.")
    exit()

admin = Admin(
    username="admin",
    full_name="Super Administrator",
    password=create_password_hash("admin123"),
    role="Super Admin",
    is_active=True,
)

db.add(admin)

db.commit()

print("===================================")
print("Super Admin Created Successfully")
print("Username : admin")
print("Password : admin123")
print("===================================")