from pydantic import BaseModel, Field
from datetime import datetime


class UserCreate(BaseModel):
    """
    Schema tạo user mới (đăng ký).
    """
    name: str = Field(min_length=1, max_length=100)


class UserUpdate(BaseModel):
    """
    Schema cập nhật thông tin user (chỉ đổi name).
    """
    name: str | None = Field(default=None, min_length=1, max_length=100)


class UserOut(BaseModel):
    """
    Schema trả thông tin user ra API.
    """
    id: int
    name: str
    role: str
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class RoleUpdate(BaseModel):
    """
    Schema cho admin cập nhật role user.
    """
    role: str = Field(pattern="^(admin|user)$")
