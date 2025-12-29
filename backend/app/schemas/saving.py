from decimal import Decimal
from typing import Annotated, Optional
from pydantic import BaseModel, Field
from pydantic.config import ConfigDict

Amount18_2 = Annotated[Decimal, Field(max_digits=18, decimal_places=2, ge=0)]
GoalNameStr = Annotated[str, Field(min_length=1, max_length=100)]


class SavingCreate(BaseModel):
    """
    Schema tạo mục tiêu tiết kiệm mới.
    """
    user_id: int
    goal_name: GoalNameStr
    target_amount: Amount18_2
    current_amount: Amount18_2 = Decimal("0.00")


class SavingUpdate(BaseModel):
    """
    Schema cập nhật mục tiêu tiết kiệm (partial update).
    """
    goal_name: Optional[GoalNameStr] = None
    target_amount: Optional[Amount18_2] = None
    current_amount: Optional[Amount18_2] = None


class SavingOut(BaseModel):
    """
    Schema trả dữ liệu mục tiêu tiết kiệm ra API.
    """
    id: int
    user_id: int
    goal_name: str
    target_amount: Annotated[Decimal, Field(max_digits=18, decimal_places=2)]
    current_amount: Annotated[Decimal, Field(max_digits=18, decimal_places=2)]

    model_config = ConfigDict(from_attributes=True)
