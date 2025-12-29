from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    """
    Schema tạo mới danh mục (Category).

    Dùng khi:
    - Người dùng tạo danh mục thu/chi mới
    """
    name: str = Field(min_length=1, max_length=100)


class CategoryUpdate(BaseModel):
    """
    Schema cập nhật danh mục (partial update).

    Chỉ cho phép đổi tên danh mục.
    """
    name: str | None = Field(default=None, min_length=1, max_length=100)


class CategoryOut(BaseModel):
    """
    Schema trả dữ liệu danh mục ra API.

    Dùng cho:
    - Form tạo transaction
    - Thống kê theo category
    """
    id: int
    name: str

    class Config:
        from_attributes = True
