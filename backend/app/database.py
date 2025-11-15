# app/database.py
import urllib.parse
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base   # ✅ thêm declarative_base

# ✅ Khai báo Base để ORM dùng làm lớp nền cho models
Base = declarative_base()

# Bạn có thể đổi driver thành: ODBC Driver 17 for SQL Server (khuyên dùng)
DRIVER   = "SQL Server"  # hoặc "ODBC Driver 17 for SQL Server"
SERVER   = r"LAPTOP-7N0B7R24\SQL"
DATABASE = "CHITIEU"

odbc_str = (
    f"DRIVER={{{DRIVER}}};"
    f"SERVER={SERVER};"
    f"DATABASE={DATABASE};"
    "Trusted_Connection=Yes;"
)

connect_url = "mssql+pyodbc:///?odbc_connect=" + urllib.parse.quote_plus(
    odbc_str.replace("{DRIVER}", DRIVER)
)

engine = create_engine(
    connect_url,
    use_setinputsizes=False, 
    fast_executemany=True,
    pool_pre_ping=True,
    echo=True
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

if __name__ == "__main__":
    with engine.connect() as conn:
        print(conn.execute(text("SELECT DB_NAME() AS db, GETDATE() AS now")).mappings().all())
