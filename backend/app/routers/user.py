from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.deps import get_db
from app.schemas.user import UserCreate, UserUpdate, UserOut, RoleUpdate
from app.repo.user import UserRepo
from app.auth_utils import issue_token
from jose import jwt, JWTError
import os

router = APIRouter(prefix="/api/users", tags=["Users & Auth"])

# ====== JWT / OAuth2 bearer ======
oauth2 = OAuth2PasswordBearer(tokenUrl="/api/users/login")
SECRET = os.getenv("JWT_SECRET", "super_secret_key")
ALGO = "HS256"

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2)):
    """
    Giải mã JWT và trả về user hiện tại (theo user_id).
    Payload token kỳ vọng chứa {"id": <user_id>}.
    """
    try:
        data = jwt.decode(token, SECRET, algorithms=[ALGO])
        uid = data.get("id")
        if not uid:
            raise HTTPException(status_code=401, detail="Token thiếu user id")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

    user = UserRepo.get_by_id(db, uid)
    if not user:
        raise HTTPException(status_code=401, detail="Người dùng không tồn tại")
    return user

def require_admin(current=Depends(get_current_user)):
    if getattr(current, "role", None) != "admin":
        raise HTTPException(status_code=403, detail="Chỉ admin mới được phép")
    return current

# ====== Đăng ký (theo name) ======
@router.post("/register", response_model=UserOut)
def register(body: UserCreate, db: Session = Depends(get_db)):
    """
    Tạo user mới chỉ với name. Chặn trùng name.
    """
    existing_user = UserRepo.find_by_name(db, body.name)
    if existing_user:
        return existing_user

    user = UserRepo.create(db, name=body.name)
    return user

# ====== Đăng nhập (không mật khẩu) ======
@router.post("/login")
def login(
    db: Session = Depends(get_db),
    user_id: int | None = Query(default=None, description="Đăng nhập theo user_id"),
    name: str | None = Query(default=None, description="Hoặc đăng nhập theo name"),
):
    """
    - /login?user_id=123
    - /login?name=alice
    """
    user = None
    if user_id is not None:
        user = UserRepo.get_by_id(db, user_id)
    elif name is not None:
        user = UserRepo.find_by_name(db, name)
    else:
        raise HTTPException(status_code=400, detail="Cần truyền user_id hoặc name")

    if not user:
        raise HTTPException(status_code=404, detail="User không tồn tại")

    token = issue_token({"id": user.id})
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "role": user.role,                # NEW
            "created_at": user.created_at,
        },
    }

# ====== Hồ sơ hiện tại ======
@router.get("/me", response_model=UserOut)
def me(current=Depends(get_current_user)):
    return current

"""Cập nhật thông tin (chỉ cho đổi name) """ 
@router.patch("/me", response_model=UserOut)
def update_me(
    body: UserUpdate,
    db: Session = Depends(get_db),
    current=Depends(get_current_user),
):
    fields = {}

    if body.name is not None:
        existing = UserRepo.find_by_name(db, body.name)
        if existing and existing.id != current.id:
            raise HTTPException(status_code=400, detail="Name đã được sử dụng")
        fields["name"] = body.name

    user = UserRepo.update_partial(db, current, **fields)
    return user

""" Danh sách người dùng (ADMIN ONLY) """
@router.get("/", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db), admin=Depends(require_admin)):
    rows = UserRepo.list_basic(db)
    out = []
    for r in rows:
        # tuple: (id, name, role, created_at)
        rid, rname, rrole, rcreated = r
        out.append(UserOut(id=rid, name=rname, role=rrole, created_at=rcreated))
    return out

""" Xóa user (ADMIN ONLY) """ 
@router.delete("/{user_id}", response_model=dict)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    u = UserRepo.get_by_id(db, user_id)
    if not u:
        raise HTTPException(status_code=404, detail="User không tồn tại")

    UserRepo.delete(db, user_id)
    return {"deleted": True}

""" Đổi role cho user (ADMIN ONLY) - Optional """
@router.patch("/{user_id}/role", response_model=UserOut)
def set_user_role(
    user_id: int,
    body: RoleUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    u = UserRepo.get_by_id(db, user_id)
    if not u:
        raise HTTPException(status_code=404, detail="User không tồn tại")

    u = UserRepo.set_role(db, u, body.role)
    return u
