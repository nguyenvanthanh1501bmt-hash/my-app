from datetime import date
from decimal import Decimal
from typing import Annotated, Optional, Literal

from pydantic import BaseModel, Field
from pydantic.config import ConfigDict

# Kiểu số thập phân 18,2 và không âm
Amount18_2 = Annotated[Decimal, Field(max_digits=18, decimal_places=2, ge=0)]
# Chuỗi tên người 1..100 ký tự
PersonStr = Annotated[str, Field(min_length=1, max_length=100)]
# Kiểu cố định cho type/status
LoanType = Literal["loan", "debt"]
LoanStatus = Literal["pending", "paid"]

class LoanCreate(BaseModel):
    user_id: int
    amount: Amount18_2
    person: PersonStr
    due_date: date
    type: LoanType
    status: LoanStatus = "pending"

class LoanUpdate(BaseModel):
    amount: Optional[Amount18_2] = None
    person: Optional[PersonStr] = None
    due_date: Optional[date] = None
    type: Optional[LoanType] = None
    status: Optional[LoanStatus] = None

class LoanOut(BaseModel):
    id: int
    user_id: int
    amount: Annotated[Decimal, Field(max_digits=18, decimal_places=2)]
    person: str
    due_date: date
    type: LoanType
    status: LoanStatus

    # Pydantic v2 thay Config bằng model_config
    model_config = ConfigDict(from_attributes=True)
