from sqlalchemy.orm import Session
from app.models.saving import Saving

class SavingRepo:
    @staticmethod
    def create(db: Session, **kw) -> Saving:
        s = Saving(**kw)
        db.add(s); db.commit(); db.refresh(s)
        return s

    @staticmethod
    def list_by_user(db: Session, user_id: int):
        return db.query(Saving).filter(Saving.user_id == user_id).all()

    @staticmethod
    def update_partial(db: Session, saving: Saving, **fields) -> Saving:
        for k, v in fields.items():
            if v is not None:
                setattr(saving, k, v)
        db.commit(); db.refresh(saving)
        return saving

    @staticmethod
    def get_by_id(db: Session, saving_id: int) -> Saving | None:
        return db.get(Saving, saving_id)

    @staticmethod
    def delete(db: Session, saving_id: int) -> None:
        s = db.get(Saving, saving_id)
        if s:
            db.delete(s); db.commit()
