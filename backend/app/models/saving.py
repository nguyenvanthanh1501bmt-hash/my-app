from sqlalchemy import Column, Integer, DECIMAL, ForeignKey, String
from sqlalchemy.orm import relationship
from ..database import Base

class Saving(Base):
    """
    ORM model đại diện cho bảng savings.

    Lưu thông tin các mục tiêu tiết kiệm của người dùng,
    bao gồm số tiền mục tiêu và số tiền hiện tại đã tích lũy.

    Quan hệ:
    - Thuộc về một User
    - Một User có thể có nhiều mục tiêu tiết kiệm
    """

    __tablename__ = "savings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="NO ACTION", onupdate="NO ACTION"),
        nullable=False
    )
    goal_name = Column(String(100), nullable=False)
    target_amount = Column(DECIMAL(18, 2), nullable=False)
    current_amount = Column(DECIMAL(18, 2), nullable=False, default=0)

    user = relationship("User", back_populates="savings")
