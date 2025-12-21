from pydantic import BaseModel, Field
from datetime import datetime

class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)

class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)

class UserOut(BaseModel):
    id: int
    name: str
    role: str
    created_at: datetime | None = None

    class Config:
        from_attributes = True

# (Optional) schema cho admin đổi role
class RoleUpdate(BaseModel):
    role: str = Field(pattern="^(admin|user)$")
