from sqlalchemy import Column, Integer, DECIMAL, ForeignKey,String
from sqlalchemy.orm import relationship
from ..database import Base
class Saving(Base):
    __tablename__ = "savings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="NO ACTION", onupdate="NO ACTION"), nullable=False)
    goal_name = Column(String(100), nullable=False)
    target_amount = Column(DECIMAL(18, 2), nullable=False)
    current_amount = Column(DECIMAL(18, 2), nullable=False, default=0)

    user = relationship("User", back_populates="savings")