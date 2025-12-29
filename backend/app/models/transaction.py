from sqlalchemy import Column, Integer, String, Date, DECIMAL, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class Transaction(Base):
    """
    ORM model đại diện cho bảng transactions.

    Lưu thông tin các giao dịch tài chính của người dùng,
    bao gồm thu nhập (income) và chi tiêu (outcome).

    Thuộc tính type:
    - 'income'  : giao dịch thu
    - 'outcome' : giao dịch chi

    Quan hệ:
    - Thuộc về một User
    - Thuộc về một Category
    """

    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(DECIMAL(18, 2), nullable=False)
    date = Column(Date, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    note = Column(String(255))
    type = Column(String(10), nullable=False)  # 'income' | 'outcome'

    __table_args__ = (
        CheckConstraint("type IN ('income','outcome')", name="ck_transactions_type"),
    )

    user = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")
