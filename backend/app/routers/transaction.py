from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps import get_db
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionOut
from app.repo.transaction import TransactionRepo
from app.repo.user import UserRepo
from app.models.transaction import Transaction
from app.repo.budget import BudgetRepo


router = APIRouter(prefix="/api/transactions", tags=["Transactions"])


@router.post("/", response_model=TransactionOut)
def create_tx(body: TransactionCreate, db: Session = Depends(get_db)):
    """
    Tạo giao dịch mới (income/outcome).

    Điều kiện:
    - user_id phải tồn tại.

    Thêm vào đó:
    - Nếu tx.type == 'outcome' => tăng 'used' của budget tương ứng theo tháng.
    """
    if not UserRepo.get_by_id(db, body.user_id):
        raise HTTPException(400, "User không tồn tại")

    tx = TransactionRepo.create(db, **body.model_dump())

    if tx.type == "outcome":
        month = tx.date.strftime("%Y-%m")
        BudgetRepo.update_used_amount(db, tx.user_id, month, tx.amount)

    return tx


@router.get("/by-user/{user_id}", response_model=list[TransactionOut])
def list_by_user(user_id: int, db: Session = Depends(get_db)):
    """
    Lấy danh sách giao dịch theo user_id (mới nhất trước).
    """
    return TransactionRepo.list_by_user(db, user_id)


@router.get("/search", response_model=list[TransactionOut])
def search_by_note(user_id: int, q: str, db: Session = Depends(get_db)):
    """
    Tìm kiếm giao dịch theo nội dung note của một user.
    """
    return TransactionRepo.search_by_note(db, user_id, q)


@router.get("/category-by-name")
def get_category_by_name(name: str, db: Session = Depends(get_db)):
    """
    Lấy category theo name (phục vụ map category khi nhập liệu).
    """
    cat = TransactionRepo.get_category_by_name(db, name)
    if not cat:
        raise HTTPException(404, "Không tìm thấy category")
    return {"id": cat.id, "name": cat.name}


@router.patch("/{tx_id}", response_model=TransactionOut)
def update_tx(tx_id: int, body: TransactionUpdate, db: Session = Depends(get_db)):
    """
    Cập nhật giao dịch theo tx_id (partial update).
    """
    tx = db.get(Transaction, tx_id)
    if not tx:
        raise HTTPException(404, "Không tìm thấy giao dịch")
    return TransactionRepo.update_partial(db, tx, **body.model_dump())


@router.delete("/{tx_id}")
def delete_tx(tx_id: int, db: Session = Depends(get_db)):
    """
    Xóa giao dịch theo tx_id.

    Thêm vào đó:
    - Nếu giao dịch là 'outcome' => revert used của budget theo tháng.
    """
    tx = db.get(Transaction, tx_id)
    if not tx:
        raise HTTPException(404, "Không tìm thấy giao dịch")

    if tx.type == "outcome":
        month = tx.date.strftime("%Y-%m")
        BudgetRepo.revert_used_amount(db, tx.user_id, month, tx.amount)

    TransactionRepo.delete(db, tx_id)
    return {"deleted": True}
