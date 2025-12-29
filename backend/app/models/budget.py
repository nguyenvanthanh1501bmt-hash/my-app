from sqlalchemy import Column, Integer, DECIMAL, ForeignKey, CHAR
from sqlalchemy.orm import relationship
from ..database import Base

class Budget(Base):
    """
    ORM model đại diện cho bảng budgets.

    Lưu thông tin ngân sách theo tháng của từng người dùng.
    Mỗi bản ghi tương ứng với một tháng (định dạng YYYY-MM),
    dùng để theo dõi tổng ngân sách được cấp và số tiền đã sử dụng.

    Quan hệ:
    - Thuộc về một User
    - Một User có thể có nhiều Budget theo từng tháng
    """

    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="NO ACTION", onupdate="NO ACTION"),
        nullable=False
    )
    month = Column(CHAR(7), nullable=False)  # 'YYYY-MM'
    amount = Column(DECIMAL(18, 2), nullable=False)
    used = Column(DECIMAL(18, 2), nullable=False, default=0)

    user = relationship("User", back_populates="budgets")
