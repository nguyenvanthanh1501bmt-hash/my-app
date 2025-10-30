from sqlalchemy.orm import Session
from app.models.user import User

class UserRepo:
    @staticmethod
    def get_by_id(db: Session, user_id: int) -> User | None:
        return db.get(User, user_id)

    @staticmethod
    def find_by_name(db: Session, name: str) -> User | None:
        return db.query(User).filter(User.name == name).first()

    @staticmethod
    def create(db: Session, name: str) -> User:
        u = User(name=name)
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
        # Trả về luôn cả created_at để map ra UserOut cho dễ
        return db.query(User.id, User.name, User.created_at).all()
