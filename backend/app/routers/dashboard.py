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

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    user_id: int,
    month: str = Query(..., description="Tháng dạng 'YYYY-MM'"),
    db: Session = Depends(get_db),
):
    data = DashboardRepo.get_summary(db, user_id, month)
    if not data:
        raise HTTPException(status_code=404, detail="Không có budget cho tháng này")
    return data


@router.get("/income-outcome", response_model=list[IncomeOutcomePoint])
def get_income_outcome(
    user_id: int,
    month: str = Query(..., description="Tháng dạng 'YYYY-MM'"),
    mode: str = Query("weekly", description="'weekly' hoặc 'monthly'"),
    db: Session = Depends(get_db),
):
    if mode not in ("weekly", "monthly"):
        raise HTTPException(
            status_code=400, detail="mode chỉ hỗ trợ 'weekly' hoặc 'monthly'"
        )
    return DashboardRepo.income_vs_outcome(db, user_id, month, mode)


@router.get("/category-expense", response_model=list[CategoryExpenseItem])
def get_category_expense(
    user_id: int,
    month: str = Query(..., description="Tháng dạng 'YYYY-MM'"),
    db: Session = Depends(get_db),
):
    return DashboardRepo.category_expense(db, user_id, month)


@router.get("/recent-transactions", response_model=list[DashboardRecentTransaction])
def get_recent_transactions(
    user_id: int,
    month: str | None = Query(None, description="Tuỳ chọn, filter theo tháng 'YYYY-MM'"),
    limit: int = Query(5, ge=1, le=50),
    db: Session = Depends(get_db),
):
    return DashboardRepo.recent_transactions(db, user_id, month, limit)
