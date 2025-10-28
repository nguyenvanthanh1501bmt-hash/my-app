from sqlalchemy.orm import Session
from app.models.loan import LoanDebt

class LoanRepo:
    @staticmethod
    def create(db: Session, **kw) -> LoanDebt:
        l = LoanDebt(**kw)
        db.add(l); db.commit(); db.refresh(l)
        return l

    # NEW: tìm theo user (thay cho list_by_user)
    @staticmethod
    def find_by_user(db: Session, user_id: int):
        return db.query(LoanDebt).filter(LoanDebt.user_id == user_id) \
                 .order_by(LoanDebt.due_date.asc()).all()

    # NEW: update theo id (tự fetch bên trong, KHÔNG lộ get_by_id)
    @staticmethod
    def update(db: Session, loan_id: int, **fields) -> LoanDebt | None:
        l = db.get(LoanDebt, loan_id)
        if not l: return None
        for k, v in fields.items():
            if v is not None:
                setattr(l, k, v)
        db.commit(); db.refresh(l)
        return l

    # NEW: update status riêng
    @staticmethod
    def update_status(db: Session, loan_id: int, status: str) -> LoanDebt | None:
        l = db.get(LoanDebt, loan_id)
        if not l: return None
        l.status = status
        db.commit(); db.refresh(l)
        return l

    @staticmethod
    def delete(db: Session, loan_id: int) -> None:
        l = db.get(LoanDebt, loan_id)
        if l:
            db.delete(l); db.commit()
