# app/routers/dashboard.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.deps import get_db
from app.repo.dashboard import DashboardRepo
from app.schemas.dashboard import (
    DashboardSummary,
    IncomeOutcomePoint,
    CategoryExpenseItem,
    DashboardRecentTransaction,
)

# Router quản lý các API phục vụ Dashboard tổng hợp
router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    user_id: int,
    month: str = Query(..., description="Tháng dạng 'YYYY-MM'"),
    db: Session = Depends(get_db),
):
    """
    Lấy dữ liệu tổng quan (summary) cho dashboard theo user và tháng.
    Dùng cho các box tổng hợp ở đầu trang dashboard.
    """
    data = DashboardRepo.get_summary(db, user_id, month)
    if not data:
        # Trường hợp user chưa tạo budget cho tháng được chọn
        raise HTTPException(
            status_code=404,
            detail="Không có budget cho tháng này"
        )
    return data


@router.get("/income-outcome", response_model=list[IncomeOutcomePoint])
def get_income_outcome(
    user_id: int,
    month: str = Query(..., description="Tháng dạng 'YYYY-MM'"),
    mode: str = Query("weekly", description="'weekly' hoặc 'monthly'"),
    db: Session = Depends(get_db),
):
    """
    Lấy dữ liệu so sánh thu – chi (income vs outcome) để vẽ biểu đồ.

    - mode = 'weekly':
        Trả dữ liệu theo từng tuần trong tháng
    - mode = 'monthly':
        Trả dữ liệu tổng hợp theo tháng (phù hợp biểu đồ xu hướng)

    """
    if mode not in ("weekly", "monthly"):
        raise HTTPException(
            status_code=400,
            detail="mode chỉ hỗ trợ 'weekly' hoặc 'monthly'"
        )

    return DashboardRepo.income_vs_outcome(db, user_id, month, mode)


@router.get("/category-expense", response_model=list[CategoryExpenseItem])
def get_category_expense(
    user_id: int,
    month: str = Query(..., description="Tháng dạng 'YYYY-MM'"),
    db: Session = Depends(get_db),
):
    """
    Lấy thống kê chi tiêu theo danh mục (category).

    - Nhóm các transaction chi tiêu theo category
    - Tính tổng tiền cho từng category trong tháng

    Dùng cho:
    - Biểu đồ tròn (pie chart)
    - Biểu đồ thanh (bar chart)
    """
    return DashboardRepo.category_expense(db, user_id, month)


@router.get("/recent-transactions", response_model=list[DashboardRecentTransaction])
def get_recent_transactions(
    user_id: int,
    month: str | None = Query(
        None,
        description="Tuỳ chọn, filter theo tháng 'YYYY-MM'"
    ),
    limit: int = Query(5, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """
    Lấy danh sách các giao dịch gần nhất của user.

    - month (tuỳ chọn):
        Nếu có, chỉ lấy giao dịch trong tháng đó
    - limit:
        Số lượng giao dịch trả về (mặc định 5, tối đa 50)

    Dùng cho bảng "Recent Transactions" trên dashboard.
    """
    return DashboardRepo.recent_transactions(db, user_id, month, limit)
