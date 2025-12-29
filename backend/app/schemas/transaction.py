from datetime import datetime
from datetime import date
from decimal import Decimal
from typing import Annotated, Literal

from pydantic import BaseModel, Field

# Khai báo 1 alias kiểu cho số thập phân 18,2 và không âm
Amount18_2 = Annotated[Decimal, Field(max_digits=18, decimal_places=2, ge=0)]

class TransactionCreate(BaseModel):
    """
    Schema tạo giao dịch thu / chi.
    """
    user_id: int
    category_id: int
    amount: Amount18_2
    date: date
    note: str | None = Field(default=None, max_length=255)
    type: Literal["income", "outcome"]

class TransactionUpdate(BaseModel):
    """
    Schema cập nhật giao dịch (partial update).
    """
    category_id: int | None = None
    amount: Annotated[Decimal | None, Field(max_digits=18, decimal_places=2, ge=0)] = None
    date: datetime | None = None
    note: str | None = Field(default=None, max_length=255)
    type: Literal["income", "outcome"] | None = None

class TransactionOut(BaseModel):
    """
    Schema trả dữ liệu giao dịch ra API.
    """
    id: int
    user_id: int
    category_id: int
    amount: Annotated[Decimal, Field(max_digits=18, decimal_places=2)]
    date: date
    note: str | None
    type: Literal["income", "outcome"]

    class Config:
        from_attributes = True
