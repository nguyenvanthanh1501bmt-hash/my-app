# app/database.py
import urllib.parse
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

# =============================
# 1️⃣ Khai báo Base để ORM dùng
# =============================
Base = declarative_base()

# =============================
# 2️⃣ Cấu hình kết nối SQL Server
# =============================
DRIVER   = "ODBC Driver 18 for SQL Server"  # hoặc "ODBC Driver 17 for SQL Server"
SERVER   = "localhost"                       # tên server, hoặc "localhost\\SQLEXPRESS" nếu SQL Express
DATABASE = "CHITIEU"

# Chuỗi ODBC
odbc_str = (
    f"DRIVER={{{DRIVER}}};"
    f"SERVER={SERVER};"
    f"DATABASE={DATABASE};"
    "Trusted_Connection=Yes;"
    "Encrypt=no;"
)

# URL cho SQLAlchemy
connect_url = "mssql+pyodbc:///?odbc_connect=" + urllib.parse.quote_plus(odbc_str)

# =============================
# 3️⃣ Tạo engine
# =============================
engine = create_engine(
    connect_url,
    use_setinputsizes=False,
    fast_executemany=True,
    pool_pre_ping=True,
    echo=True  # bật để debug SQL query
)

# =============================
# 4️⃣ Tạo Session
# =============================
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# =============================
# 5️⃣ Test kết nối (chạy trực tiếp)
# =============================
if __name__ == "__main__":
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT DB_NAME() AS db, GETDATE() AS now"))
            for row in result.mappings():
                print(row)
        print("✅ Kết nối SQL Server thành công!")
    except Exception as e:
        print("❌ Lỗi kết nối:", e)
