from datetime import datetime
from decimal import Decimal
from typing import Annotated, Optional
from pydantic import BaseModel, Field, field_validator
from pydantic.config import ConfigDict
import re

# Kiểu số thập phân 18,2 và không âm
Amount18_2 = Annotated[Decimal, Field(max_digits=18, decimal_places=2, ge=0)]

# Kiểu tháng dạng YYYY-MM (ràng buộc chặt tháng 01..12)
MonthStr = Annotated[str, Field(pattern=r"^\d{4}-(0[1-9]|1[0-2])$")]


class BudgetCreate(BaseModel):
    """
    Schema dùng khi tạo mới ngân sách (Budget).

    Mục đích:
    - Gắn ngân sách cho một user theo từng tháng (YYYY-MM)
    - Xác định số tiền ngân sách được cấp ban đầu

    Ghi chú:
    - used mặc định = 0
    - month phải đúng định dạng YYYY-MM
    """
    user_id: int
    month: MonthStr
    amount: Amount18_2
    used: Amount18_2 = Decimal("0.00")

    @field_validator("month", mode="before")
    @classmethod
    def _validate_month(cls, v: str) -> str:
        if not re.fullmatch(r"\d{4}-(0[1-9]|1[0-2])", v):
            raise ValueError("month phải ở dạng 'YYYY-MM' và tháng 01..12")
        return v


class BudgetUpdate(BaseModel):
    """
    Schema cập nhật ngân sách (partial update).

    Chỉ cho phép cập nhật:
    - amount: tổng ngân sách
    - used: số tiền đã sử dụng
    """
    amount: Optional[Amount18_2] = None
    used: Optional[Amount18_2] = None


class BudgetOut(BaseModel):
    """
    Schema trả dữ liệu ngân sách ra ngoài API.

    Dùng cho:
    - Dashboard
    - Trang quản lý ngân sách
    """
    id: int
    user_id: int
    month: MonthStr
    amount: Annotated[Decimal, Field(max_digits=18, decimal_places=2)]
    used: Annotated[Decimal, Field(max_digits=18, decimal_places=2)]

    model_config = ConfigDict(from_attributes=True)
