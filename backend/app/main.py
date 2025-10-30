# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
import app.models                      # 👈 quan trọng: đăng ký User/Category/Transaction
from app.models import Base
from app.routers import categories,user,transaction,budget,saving,loan     # router của bạn

import traceback
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse 

app = FastAPI(title="Expense API")
origins = [
    #"http://localhost:3000",  # domain/port frontend của bạn
    # "http://localhost:5173", nếu dùng Vite dev server
]

Base.metadata.create_all(bind=engine)  # tạo bảng sau khi import app.models

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

@app.get("/")
def root():
    return {"ok": True}

# @app.exception_handler(Exception)
# async def all_exception_handler(request: Request, exc: Exception):
#     print("Exception occurred:", exc)
#     traceback.print_exc()
#     return JSONResponse(
#         status_code=500,
#         content={"detail": str(exc)}
#     )

app.include_router(user.router)         
app.include_router(categories.router)
app.include_router(transaction.router)
app.include_router(budget.router)
app.include_router(loan.router)
app.include_router(saving.router)
