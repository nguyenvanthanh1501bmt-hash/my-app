from sqlalchemy.orm import Session
from app.models.categories import Category

class CategoryRepo:
    """
    Repository lớp Category (categories).

    Cung cấp các thao tác dữ liệu cơ bản cho danh mục:
    - Tạo mới category (name duy nhất)
    - Lấy danh sách toàn bộ category (sắp xếp theo tên)

    Dùng để:
    - Form tạo transaction (chọn category)
    - Thống kê theo category (dashboard/pie chart)
    """

    @staticmethod
    def create(db: Session, name: str):
        c = Category(name=name)
        db.add(c); db.commit(); db.refresh(c)
        return c

    @staticmethod
    def list_all(db: Session):
        return db.query(Category).order_by(Category.name).all()
