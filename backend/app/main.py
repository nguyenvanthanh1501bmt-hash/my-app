"""
Entry point của FastAPI application (Expense API).

Chức năng:
- Khởi tạo FastAPI app.
- Khởi tạo bảng DB sau khi import models.
- Cấu hình CORS middleware.
- Mount các router theo từng module.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
import app.models
from app.models import Base
from app.routers import categories, user, transaction, budget, saving, loan, dashboard

app = FastAPI(title="Expense API")

# Tạo bảng sau khi import app.models (để Base đã có đầy đủ model)
Base.metadata.create_all(bind=engine)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """
    Health-check endpoint.
    Dùng để kiểm tra API chạy ổn hay không.
    """
    return {"ok": True}


# Register routers
app.include_router(user.router)
app.include_router(categories.router)
app.include_router(transaction.router)
app.include_router(budget.router)
app.include_router(loan.router)
app.include_router(saving.router)
app.include_router(dashboard.router)
