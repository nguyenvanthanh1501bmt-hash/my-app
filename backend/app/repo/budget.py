from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.budget import Budget

def _ym(month: str) -> tuple[int, int]:
    y, m = month.split("-"); return int(y), int(m)

class BudgetRepo:
    @staticmethod
    def create(db: Session, user_id: int, month: str, amount, used):
        b = Budget(user_id=user_id, month=month, amount=amount, used=used)
        db.add(b); db.commit(); db.refresh(b)
        return b

    # NEW: tìm budget theo user + month (YYYY-MM)
    @staticmethod
    def find_user_by_month(db: Session, user_id: int, month: str) -> Budget | None:
        return db.query(Budget).filter(Budget.user_id==user_id, Budget.month==month).first()

    # cập nhật trường thông thường (không dùng get_by_id nữa)
    @staticmethod
    def update_partial(db: Session, budget: Budget, **fields) -> Budget:
        for k, v in fields.items():
            if v is not None:
                setattr(budget, k, v)
        db.commit(); db.refresh(budget)
        return budget

    # tính used từ transactions cho đúng tháng
    @staticmethod
    def recalc_used_from_transactions(db: Session, budget: Budget) -> Budget:
        y, m = _ym(budget.month)
        row = db.execute(text("""
            SELECT COALESCE(SUM(amount),0) AS used
            FROM transactions
            WHERE user_id = :uid
              AND type = 'outcome'
              AND YEAR([date]) = :y AND MONTH([date]) = :m
        """), {"uid": budget.user_id, "y": y, "m": m}).mappings().one()
        budget.used = row["used"]
        db.commit(); db.refresh(budget)
        return budget

    # NEW: tăng used lên một lượng (vd khi thêm giao dịch outcome)
    @staticmethod
    def update_used_amount(db: Session, user_id: int, month: str, delta):
        b = BudgetRepo.find_user_by_month(db, user_id, month)
        if not b:
            return None
        b.used = (b.used or 0) + delta
        if b.used < 0:
            b.used = 0
        db.commit(); db.refresh(b)
        return b

    # NEW: giảm used (vd khi xóa giao dịch outcome)
    @staticmethod
    def revert_used_amount(db: Session, user_id: int, month: str, delta):
        # delta nên truyền vào là số dương; hàm sẽ trừ
        return BudgetRepo.update_used_amount(db, user_id, month, -abs(delta))

    @staticmethod
    def delete(db: Session, budget_id: int) -> None:
        b = db.get(Budget, budget_id)
        if b:
            db.delete(b); db.commit()
