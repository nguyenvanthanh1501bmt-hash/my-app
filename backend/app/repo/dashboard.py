from decimal import Decimal
from typing import Any

from sqlalchemy.orm import Session
from sqlalchemy import text

from app.repo.budget import BudgetRepo
from app.models.transaction import Transaction
from app.models.categories import Category


def _ym(month: str) -> tuple[int, int]:
    """Chuyển 'YYYY-MM' -> (year, month int)"""
    y, m = month.split("-")
    return int(y), int(m)


class DashboardRepo:
    """
    Repository phục vụ Dashboard.

    Gom các truy vấn tổng hợp để trả dữ liệu hiển thị dashboard, gồm:
    - Summary 3 box: total_budget, total_spend, current_balance
    - Biểu đồ income vs outcome (theo weekday hoặc theo day-of-month)
    - Pie chart chi tiêu theo category
    - Danh sách recent transactions

    """

    @staticmethod
    def get_summary(db: Session, user_id: int, month: str) -> dict[str, Any] | None:
        """
        Lấy tổng quan cho 3 box:
        - currentBalance
        - totalBudget
        - totalSpend
        Dựa trên bảng budgets: amount & used.
        """
        budget = BudgetRepo.find_user_by_month(db, user_id, month)
        if not budget:
            return None

        amount = Decimal(budget.amount or 0)
        used = Decimal(budget.used or 0)
        current = amount - used

        return {
            "month": budget.month,
            "total_budget": amount,
            "total_spend": used,
            "current_balance": current,
        }

    @staticmethod
    def income_vs_outcome(
        db: Session, user_id: int, month: str, mode: str = "weekly"
    ) -> list[dict[str, Any]]:
        """
        Trả data cho biểu đồ Income vs Outcome.

        mode:
        - 'weekly'  : nhóm theo thứ trong tuần (DATENAME/DATEPART)
        - 'monthly' : nhóm theo ngày trong tháng (DAY)
        """
        y, m = _ym(month)

        if mode == "monthly":
            sql = text("""
                SELECT 
                DAY([date]) AS label,
                SUM(CASE WHEN [type] = 'income' THEN amount ELSE 0 END) AS income,
                SUM(CASE WHEN [type] = 'outcome' THEN amount ELSE 0 END) AS outcome
                FROM transactions
                WHERE user_id = :uid
                AND YEAR([date]) = :y AND MONTH([date]) = :m
                GROUP BY DAY([date])
                ORDER BY DAY([date])
            """)
        else:
            sql = text("""
                SELECT 
                DATENAME(WEEKDAY, [date]) AS label,
                DATEPART(WEEKDAY, [date]) AS sort_order,
                SUM(CASE WHEN [type] = 'income' THEN amount ELSE 0 END) AS income,
                SUM(CASE WHEN [type] = 'outcome' THEN amount ELSE 0 END) AS outcome
                FROM transactions
                WHERE user_id = :uid
                AND YEAR([date]) = :y AND MONTH([date]) = :m
                GROUP BY DATENAME(WEEKDAY, [date]), DATEPART(WEEKDAY, [date])
                ORDER BY sort_order
            """)

        rows = db.execute(sql, {"uid": user_id, "y": y, "m": m}).mappings().all()

        result = []
        for r in rows:
            result.append({
                "label": str(r["label"]),
                "income": Decimal(r["income"] or 0),
                "outcome": Decimal(r["outcome"] or 0),
            })

        return result

    @staticmethod
    def category_expense(
        db: Session, user_id: int, month: str
    ) -> list[dict[str, Any]]:
        """
        Data cho pie chart 'Category expense' – chỉ tính outcome.
        """
        y, m = _ym(month)
        sql = text(
            """
            SELECT 
              c.name AS category,
              SUM(t.amount) AS total
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = :uid
              AND t.[type] = 'outcome'
              AND YEAR(t.[date]) = :y AND MONTH(t.[date]) = :m
            GROUP BY c.name
            ORDER BY total DESC
            """
        )
        rows = db.execute(sql, {"uid": user_id, "y": y, "m": m}).mappings().all()
        return [{"category": r["category"], "total": r["total"]} for r in rows]

    @staticmethod
    def recent_transactions(
        db: Session, user_id: int, month: str | None = None, limit: int = 5
    ) -> list[dict[str, Any]]:
        """
        Data cho list 'Recent Transaction'.
        - mặc định lấy `limit` record mới nhất
        - nếu truyền month='YYYY-MM' thì filter theo tháng đó
        """
        params: dict[str, Any] = {"uid": user_id}
        filter_month = ""
        if month:
            y, m = _ym(month)
            filter_month = "AND YEAR(t.[date]) = :y AND MONTH(t.[date]) = :m"
            params.update({"y": y, "m": m})

        sql = text(
            f"""
            SELECT TOP {limit}
              t.[date]   AS [date],
              c.name     AS category,
              t.note     AS note,
              t.amount   AS amount,
              t.[type]   AS [type]
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = :uid
              {filter_month}
            ORDER BY t.[date] DESC
            """
        )

        rows = db.execute(sql, params).mappings().all()
        return [
            {
                "date": r["date"],
                "category": r["category"],
                "note": r["note"],
                "amount": r["amount"],
                "type": r["type"],
            }
            for r in rows
        ]
