# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
import app.models                      # 👈 quan trọng: đăng ký User/Category/Transaction
from app.models import Base
from app.routers import categories,user,transaction,budget,saving,loan     # router của bạn

app = FastAPI(title="Expense API")

Base.metadata.create_all(bind=engine)  # tạo bảng sau khi import app.models

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

@app.get("/")
def root():
    return {"ok": True}

app.include_router(user.router)         
app.include_router(categories.router)
app.include_router(transaction.router)
app.include_router(budget.router)
app.include_router(loan.router)
app.include_router(saving.router)
