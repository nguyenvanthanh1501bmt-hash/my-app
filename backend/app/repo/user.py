from sqlalchemy.orm import Session
from app.models.user import User

class UserRepo:
    @staticmethod
    def find_by_email(db: Session, email: str) -> User | None:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_by_id(db: Session, user_id: int) -> User | None:
        return db.get(User, user_id)

    @staticmethod
    def create(db: Session, name: str, email: str, password_hash: str) -> User:
        u = User(name=name, email=email, password=password_hash)
        db.add(u); db.commit(); db.refresh(u)
        return u

    @staticmethod
    def update_partial(db: Session, user: User, **fields) -> User:
        for k, v in fields.items():
            if v is not None:
                setattr(user, k, v)
        db.commit(); db.refresh(user)
        return user

    @staticmethod
    def list_basic(db: Session):
        return db.query(User.id, User.name, User.email).all()
