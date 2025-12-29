"""
ORM Models (SQLAlchemy) cho Expense API.

Bao gồm:
- User: thông tin người dùng
- Category: danh mục thu/chi
- Budget: ngân sách theo tháng
- LoanDebt: khoản vay/nợ
- Saving: mục tiêu tiết kiệm
- Transaction: giao dịch thu/chi

Mục đích:
- Định nghĩa cấu trúc bảng và quan hệ giữa các bảng (relationships)
- Dùng cho truy vấn/CRUD thông qua SQLAlchemy ORM
"""
from sqlalchemy import (
    Column, Integer, String, DateTime, Date, DECIMAL, ForeignKey, CheckConstraint, CHAR
)
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    """
    ORM model đại diện cho bảng users.

    Lưu thông tin người dùng hệ thống (cấu hình theo hướng có email/password).
    Bao gồm:
    - định danh người dùng
    - thông tin đăng nhập (email/password)
    - thời điểm tạo tài khoản

    Quan hệ:
    - Một User có nhiều Transaction
    - Một User có nhiều Budget
    - Một User có nhiều LoanDebt
    - Một User có nhiều Saving
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False)

    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    budgets = relationship("Budget", back_populates="user", cascade="all, delete-orphan")
    loans_debts = relationship("LoanDebt", back_populates="user", cascade="all, delete-orphan")
    savings = relationship("Saving", back_populates="user", cascade="all, delete-orphan")


class Category(Base):
    """
    ORM model đại diện cho bảng categories.

    Lưu danh mục phân loại giao dịch thu/chi (ví dụ: Ăn uống, Lương,...).

    Quan hệ:
    - Một Category có thể được tham chiếu bởi nhiều Transaction
    """
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)

    transactions = relationship("Transaction", back_populates="category", cascade="all, delete-orphan")


class Budget(Base):
    """
    ORM model đại diện cho bảng budgets.

    Lưu ngân sách theo tháng của từng user.
    - month dạng 'YYYY-MM'
    - amount: tổng ngân sách
    - used: số tiền đã sử dụng (thường cập nhật theo các outcome transactions)

    Quan hệ:
    - Thuộc về một User
    """
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="NO ACTION", onupdate="NO ACTION"), nullable=False)
    month = Column(CHAR(7), nullable=False)  # 'YYYY-MM'
    amount = Column(DECIMAL(18, 2), nullable=False)
    used = Column(DECIMAL(18, 2), nullable=False, default=0)

    user = relationship("User", back_populates="budgets")


class LoanDebt(Base):
    """
    ORM model đại diện cho bảng loans_debts.

    Lưu khoản vay/nợ để theo dõi:
    - amount: số tiền
    - person: đối tượng liên quan
    - due_date: ngày đến hạn
    - type: 'loan' | 'debt'
    - status: 'pending' | 'paid'

    Ràng buộc:
    - type chỉ nhận 'loan' hoặc 'debt'
    - status chỉ nhận 'pending' hoặc 'paid'

    Quan hệ:
    - Thuộc về một User
    """
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


class Saving(Base):
    """
    ORM model đại diện cho bảng savings.

    Lưu mục tiêu tiết kiệm của user:
    - goal_name: tên mục tiêu
    - target_amount: số tiền mục tiêu
    - current_amount: số tiền hiện tại đã tích lũy

    Quan hệ:
    - Thuộc về một User
    """
    __tablename__ = "savings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="NO ACTION", onupdate="NO ACTION"), nullable=False)
    goal_name = Column(String(100), nullable=False)
    target_amount = Column(DECIMAL(18, 2), nullable=False)
    current_amount = Column(DECIMAL(18, 2), nullable=False, default=0)

    user = relationship("User", back_populates="savings")


class Transaction(Base):
    """
    ORM model đại diện cho bảng transactions.

    Lưu giao dịch thu/chi của user:
    - amount: số tiền
    - date: thời điểm ghi nhận
    - category_id: danh mục
    - note: ghi chú
    - type: 'income' | 'outcome'

    Ràng buộc:
    - type chỉ nhận 'income' hoặc 'outcome'

    Quan hệ:
    - Thuộc về một User
    - Thuộc về một Category
    """
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(DECIMAL(18, 2), nullable=False)
    date = Column(DateTime, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    note = Column(String(255))
    type = Column(String(10), nullable=False)  # 'income' | 'outcome'

    __table_args__ = (
        CheckConstraint("type IN ('income', 'outcome')", name="ck_transactions_type"),
    )

    user = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")
