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
        # NEW: default role='user'
        u = User(name=name, role="user")
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
        # trả về đủ role
        return db.query(User.id, User.name, User.role, User.created_at).all()

    @staticmethod
    def set_role(db: Session, user: User, role: str) -> User:
        user.role = role
        db.commit(); db.refresh(user)
        return user
