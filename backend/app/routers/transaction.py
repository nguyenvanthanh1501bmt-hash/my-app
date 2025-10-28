from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps import get_db
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionOut
from app.repo.transaction import TransactionRepo
from app.repo.user import UserRepo
from app.models.transaction import Transaction

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])

@router.post("/", response_model=TransactionOut)
def create_tx(body: TransactionCreate, db: Session = Depends(get_db)):
    if not UserRepo.get_by_id(db, body.user_id):
        raise HTTPException(400, "User không tồn tại")
    tx = TransactionRepo.create(db, **body.model_dump())
    return tx

@router.get("/by-user/{user_id}", response_model=list[TransactionOut])
def list_by_user(user_id: int, db: Session = Depends(get_db)):
    return TransactionRepo.list_by_user(db, user_id)

@router.get("/search", response_model=list[TransactionOut])
def search_by_note(user_id: int, q: str, db: Session = Depends(get_db)):
    return TransactionRepo.search_by_note(db, user_id, q)

@router.get("/category-by-name")
def get_category_by_name(name: str, db: Session = Depends(get_db)):
    cat = TransactionRepo.get_category_by_name(db, name)
    if not cat:
        raise HTTPException(404, "Không tìm thấy category")
    return {"id": cat.id, "name": cat.name}

@router.patch("/{tx_id}", response_model=TransactionOut)
def update_tx(tx_id: int, body: TransactionUpdate, db: Session = Depends(get_db)):
    tx = db.get(Transaction, tx_id)
    if not tx:
        raise HTTPException(404, "Không tìm thấy giao dịch")
    return TransactionRepo.update_partial(db, tx, **body.model_dump())

@router.delete("/{tx_id}")
def delete_tx(tx_id: int, db: Session = Depends(get_db)):
    TransactionRepo.delete(db, tx_id)
    return {"deleted": True}
