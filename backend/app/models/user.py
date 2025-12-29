from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    """
    ORM model đại diện cho bảng users.

    Lưu thông tin người dùng của hệ thống,
    bao gồm vai trò (user / admin) và thời điểm tạo tài khoản.

    Quan hệ:
    - Một User có nhiều Transaction
    - Một User có nhiều Budget
    - Một User có nhiều LoanDebt
    - Một User có nhiều Saving
    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)

    # Vai trò người dùng: user | admin
    role = Column(String(20), nullable=False, default="user")

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    transactions = relationship(
        "Transaction",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    budgets = relationship(
        "Budget",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    loans_debts = relationship(
        "LoanDebt",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    savings = relationship(
        "Saving",
        back_populates="user",
        cascade="all, delete-orphan"
    )
