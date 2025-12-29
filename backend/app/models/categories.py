from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Category(Base):
    """
    ORM model đại diện cho bảng categories.

    Lưu danh mục phân loại cho các giao dịch thu / chi
    (ví dụ: Ăn uống, Đi lại, Lương, Giải trí, ...).

    Quan hệ:
    - Một Category có thể được sử dụng cho nhiều Transaction
    """

    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)

    # Chỉ dùng chuỗi tên class ORM
    transactions = relationship(
        "Transaction",
        back_populates="category",
        cascade="all, delete-orphan"
    )
