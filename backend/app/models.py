# app/models.py
from sqlalchemy import (
    Column, Integer, String, DateTime, Date, DECIMAL, ForeignKey, CheckConstraint, CHAR
)
from sqlalchemy.orm import relationship
from .database import Base


# ======================
# 1. USERS
# ======================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False)

    # relationships
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    budgets = relationship("Budget", back_populates="user", cascade="all, delete-orphan")
    loans_debts = relationship("LoanDebt", back_populates="user", cascade="all, delete-orphan")
    savings = relationship("Saving", back_populates="user", cascade="all, delete-orphan")


# ======================
# 2. CATEGORIES
# ======================
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)

    transactions = relationship("Transaction", back_populates="category", cascade="all, delete-orphan")


# ======================
# 3. BUDGETS
# ======================
class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="NO ACTION", onupdate="NO ACTION"), nullable=False)
    month = Column(CHAR(7), nullable=False)  # 'YYYY-MM'
    amount = Column(DECIMAL(18, 2), nullable=False)
    used = Column(DECIMAL(18, 2), nullable=False, default=0)

    user = relationship("User", back_populates="budgets")


# ======================
# 4. LOANS_DEBTS
# ======================
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


# ======================
# 5. SAVINGS
# ======================
class Saving(Base):
    __tablename__ = "savings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="NO ACTION", onupdate="NO ACTION"), nullable=False)
    goal_name = Column(String(100), nullable=False)
    target_amount = Column(DECIMAL(18, 2), nullable=False)
    current_amount = Column(DECIMAL(18, 2), nullable=False, default=0)

    user = relationship("User", back_populates="savings")


# ======================
# 6. TRANSACTIONS
# ======================
class Transaction(Base):
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

