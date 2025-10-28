from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps import get_db
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetOut
from app.repo.budget import BudgetRepo
from app.repo.user import UserRepo

router = APIRouter(prefix="/api/budgets", tags=["Budgets"])

@router.post("/", response_model=BudgetOut)
def create_budget(body: BudgetCreate, db: Session = Depends(get_db)):
    if not UserRepo.get_by_id(db, body.user_id):
        raise HTTPException(400, "User không tồn tại")
    b = BudgetRepo.create(db, body.user_id, body.month, body.amount, body.used)
    # (tuỳ chọn) đồng bộ used từ transactions lúc khởi tạo
    b = BudgetRepo.recalc_used_from_transactions(db, b)
    return b

# NEW: tìm theo user + month
@router.get("/find", response_model=BudgetOut | None)
def find_user_by_month(user_id: int, month: str, db: Session = Depends(get_db)):
    return BudgetRepo.find_user_by_month(db, user_id, month)

@router.patch("/update-used")
def update_used_amount(user_id: int, month: str, delta: float, db: Session = Depends(get_db)):
    b = BudgetRepo.update_used_amount(db, user_id, month, delta)
    if not b: raise HTTPException(404, "Không có budget cho tháng này")
    return {"ok": True, "budget": BudgetOut.model_validate(b)}

@router.patch("/revert-used")
def revert_used_amount(user_id: int, month: str, delta: float, db: Session = Depends(get_db)):
    b = BudgetRepo.revert_used_amount(db, user_id, month, delta)
    if not b: raise HTTPException(404, "Không có budget cho tháng này")
    return {"ok": True, "budget": BudgetOut.model_validate(b)}

@router.patch("/partial", response_model=BudgetOut)
def update_partial(user_id: int, month: str, body: BudgetUpdate, db: Session = Depends(get_db)):
    b = BudgetRepo.find_user_by_month(db, user_id, month)
    if not b:
        raise HTTPException(404, "Không có budget cho tháng này")
    b = BudgetRepo.update_partial(db, b, **body.model_dump())
    return b

@router.delete("/{budget_id}")
def delete_budget(budget_id: int, db: Session = Depends(get_db)):
    BudgetRepo.delete(db, budget_id)
    return {"deleted": True}