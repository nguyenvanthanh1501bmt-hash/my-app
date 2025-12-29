from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.transaction import Transaction
from app.models.categories import Category

class TransactionRepo:
    """
    Repository lớp Transaction .

    Quản lý giao dịch thu/chi:
    - Tạo mới transaction
    - Lấy danh sách theo user (mới nhất trước)
    - Cập nhật từng phần dựa trên instance Transaction
    - Xóa theo id
    - Tìm kiếm theo note 
    - Lấy Category theo tên 
    """

    @staticmethod
    def create(db: Session, **kw) -> Transaction:
        t = Transaction(**kw)
        db.add(t); db.commit(); db.refresh(t)
        return t

    @staticmethod
    def list_by_user(db: Session, user_id: int):
        return db.query(Transaction).filter(Transaction.user_id == user_id) \
                 .order_by(Transaction.date.desc()).all()

    @staticmethod
    def update_partial(db: Session, tx: Transaction, **fields) -> Transaction:
        for k, v in fields.items():
            if v is not None:
                setattr(tx, k, v)
        db.commit(); db.refresh(tx)
        return tx

    @staticmethod
    def delete(db: Session, tx_id: int) -> None:
        t = db.get(Transaction, tx_id)
        if t:
            db.delete(t); db.commit()

    """ tìm theo note (case-insensitive cho SQL Server) """
    @staticmethod
    def search_by_note(db: Session, user_id: int, keyword: str):
        kw = f"%{keyword.lower()}%"
        return db.query(Transaction) \
            .filter(
                Transaction.user_id == user_id,
                func.lower(Transaction.note).like(kw)
            ) \
            .order_by(Transaction.date.desc()).all()

    """ lấy category theo tên """
    @staticmethod
    def get_category_by_name(db: Session, name: str) -> Category | None:
        return db.query(Category).filter(func.lower(Category.name) == name.lower()).first()
