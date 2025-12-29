from datetime import datetime
from typing import Annotated
from decimal import Decimal
from pydantic import BaseModel, Field
from pydantic.config import ConfigDict

from app.schemas.budget import Amount18_2, MonthStr


class DashboardSummary(BaseModel):
    """
    Schema dữ liệu tổng quan cho Dashboard (summary boxes).

    Bao gồm:
    - Tổng ngân sách
    - Tổng chi tiêu
    - Số dư còn lại
    """
    month: MonthStr
    total_budget: Amount18_2
    total_spend: Amount18_2
    current_balance: Amount18_2

    model_config = ConfigDict(from_attributes=True)


class IncomeOutcomePoint(BaseModel):
    """
    Điểm dữ liệu cho biểu đồ Income vs Outcome.

    label:
    - Thứ trong tuần (Mon, Tue, ...)
    - Hoặc ngày trong tháng (1, 2, 3, ...)
    """
    label: str
    income: Annotated[Decimal, Field(max_digits=18, decimal_places=2)]
    outcome: Annotated[Decimal, Field(max_digits=18, decimal_places=2)]


class CategoryExpenseItem(BaseModel):
    """
    Dữ liệu chi tiêu theo danh mục (Category Expense).

    Dùng cho biểu đồ tròn (Pie Chart).
    """
    category: str
    total: Amount18_2


class DashboardRecentTransaction(BaseModel):
    """
    Schema giao dịch gần nhất hiển thị trên Dashboard.
    """
    date: datetime
    category: str | None = None
    note: str | None = None
    amount: Amount18_2
    type: str  # 'income' | 'outcome'
