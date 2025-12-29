from sqlalchemy import Column, Integer, String, Date, DECIMAL, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from ..database import Base

class LoanDebt(Base):
    """
    ORM model đại diện cho bảng loans_debts.

    Lưu thông tin các khoản vay hoặc nợ của người dùng.
    Dùng để theo dõi số tiền, đối tượng liên quan,
    ngày đến hạn và trạng thái thanh toán.

    Thuộc tính type:
    - 'loan' : cho người khác vay
    - 'debt' : nợ người khác

    Thuộc tính status:
    - 'pending' : chưa thanh toán
    - 'paid'    : đã thanh toán

    Quan hệ:
    - Thuộc về một User
    """

    __tablename__ = "loans_debts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="NO ACTION", onupdate="NO ACTION"),
        nullable=False
    )
    amount = Column(DECIMAL(18, 2), nullable=False)
    person = Column(String(100), nullable=False)
    due_date = Column(Date, nullable=False)
    type = Column(String(10), nullable=False)     # 'loan' | 'debt'
    status = Column(String(10), nullable=False, default='pending')  # 'pending' | 'paid'

    __table_args__ = (
        CheckConstraint("type IN ('loan', 'debt')", name="ck_loans_debts_type"),
        CheckConstraint("status IN ('pending', 'paid')", name="ck_loans_debts_status"),
    )

    user = relationship("User", back_populates="loans_debts")
