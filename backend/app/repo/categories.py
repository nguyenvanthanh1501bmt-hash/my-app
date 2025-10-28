# app/repositories/category_repo.py
from sqlalchemy.orm import Session
from app.models.categories import Category

class CategoryRepo:
    @staticmethod
    def create(db: Session, name: str):
        c = Category(name=name)
        db.add(c); db.commit(); db.refresh(c)
        return c

    @staticmethod
    def list_all(db: Session):
        return db.query(Category).order_by(Category.name).all()
