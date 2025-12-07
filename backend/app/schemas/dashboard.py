# app/schemas/dashboard.py
from datetime import datetime
from typing import Annotated
from decimal import Decimal

from pydantic import BaseModel, Field
from pydantic.config import ConfigDict

# Tái dùng kiểu dữ liệu từ Budget schema cho đẹp
from app.schemas.budget import Amount18_2, MonthStr  # :contentReference[oaicite:0]{index=0}


class DashboardSummary(BaseModel):
    month: MonthStr
    total_budget: Amount18_2
    total_spend: Amount18_2
    current_balance: Amount18_2

    model_config = ConfigDict(from_attributes=True)


class IncomeOutcomePoint(BaseModel):
    # label: Mon/Tue/... hoặc "1", "2", ... (ngày trong tháng)
    label: str
    income: Annotated[Decimal, Field(max_digits=18, decimal_places=2)]
    outcome: Annotated[Decimal, Field(max_digits=18, decimal_places=2)]


class CategoryExpenseItem(BaseModel):
    category: str
    total: Amount18_2


class DashboardRecentTransaction(BaseModel):
    date: datetime
    category: str | None = None
    note: str | None = None
    amount: Amount18_2
    type: str  # 'income' | 'outcome'
