from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)

class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    # thường không cho đổi email; nếu cần thì thêm: email: EmailStr | None = None

class UserOut(BaseModel):
    id: int
    name: str
    created_at: datetime | None = None
    class Config:
        from_attributes = True