from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps import get_db
from app.schemas.saving import SavingCreate, SavingUpdate, SavingOut
from app.repo.saving import SavingRepo
from app.repo.user import UserRepo

router = APIRouter(prefix="/api/savings", tags=["Savings"])

@router.post("/", response_model=SavingOut)
def create_saving(body: SavingCreate, db: Session = Depends(get_db)):
    if not UserRepo.get_by_id(db, body.user_id):
        raise HTTPException(400, "User không tồn tại")
    return SavingRepo.create(db, **body.model_dump())

@router.get("/by-user/{user_id}", response_model=list[SavingOut])
def list_savings(user_id: int, db: Session = Depends(get_db)):
    return SavingRepo.list_by_user(db, user_id)

@router.patch("/{saving_id}", response_model=SavingOut)
def update_saving(saving_id: int, body: SavingUpdate, db: Session = Depends(get_db)):
    s = SavingRepo.get_by_id(db, saving_id)
    if not s:
        raise HTTPException(404, "Không tìm thấy mục tiết kiệm")
    return SavingRepo.update_partial(db, s, **body.model_dump())

@router.delete("/{saving_id}")
def delete_saving(saving_id: int, db: Session = Depends(get_db)):
    SavingRepo.delete(db, saving_id)
    return {"deleted": True}
