from sqlalchemy import Column, Integer, String, Date, DECIMAL, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from ..database import Base

class LoanDebt(Base):
    __tablename__ = "loans_debts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="NO ACTION", onupdate="NO ACTION"), nullable=False)
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