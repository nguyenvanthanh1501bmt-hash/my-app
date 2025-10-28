from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps import get_db
from app.schemas.loan import LoanCreate, LoanUpdate, LoanOut
from app.repo.loan import LoanRepo
from app.repo.user import UserRepo

router = APIRouter(prefix="/api/loans", tags=["Loans & Debts"])

@router.post("/", response_model=LoanOut)
def create_loan(body: LoanCreate, db: Session = Depends(get_db)):
    if not UserRepo.get_by_id(db, body.user_id):
        raise HTTPException(400, "User không tồn tại")
    return LoanRepo.create(db, **body.model_dump())

# NEW: find_by_user
@router.get("/find-by-user/{user_id}", response_model=list[LoanOut])
def find_by_user(user_id: int, db: Session = Depends(get_db)):
    return LoanRepo.find_by_user(db, user_id)

# NEW: update (theo id, không gọi get_by_id)
@router.patch("/{loan_id}", response_model=LoanOut)
def update_loan(loan_id: int, body: LoanUpdate, db: Session = Depends(get_db)):
    l = LoanRepo.update(db, loan_id, **body.model_dump())
    if not l:
        raise HTTPException(404, "Không tìm thấy khoản vay/nợ")
    return l

# NEW: update_status
@router.patch("/{loan_id}/status", response_model=LoanOut)
def update_status(loan_id: int, status: str, db: Session = Depends(get_db)):
    l = LoanRepo.update_status(db, loan_id, status)
    if not l:
        raise HTTPException(404, "Không tìm thấy khoản vay/nợ")
    return l

@router.delete("/{loan_id}")
def delete_loan(loan_id: int, db: Session = Depends(get_db)):
    LoanRepo.delete(db, loan_id)
    return {"deleted": True}
