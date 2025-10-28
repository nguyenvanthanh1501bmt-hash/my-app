# app/routers/categories.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps import get_db
from app.schemas.categories import CategoryCreate, CategoryOut
from app.repo.categories import CategoryRepo   

router = APIRouter(prefix="/api/categories", tags=["Categories"])

@router.post("/", response_model=CategoryOut)
def create_category(body: CategoryCreate, db: Session = Depends(get_db)):
    return CategoryRepo.create(db, body.name)

@router.get("/", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return CategoryRepo.list_all(db)
