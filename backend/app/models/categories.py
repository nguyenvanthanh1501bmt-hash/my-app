# app/models/category.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)

    # Chỉ dùng chuỗi tên class ORM của bạn
    transactions = relationship("Transaction", back_populates="category",
                                cascade="all, delete-orphan")
