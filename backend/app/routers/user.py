from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.deps import get_db
from app.schemas.user import UserCreate, UserUpdate, UserOut
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

# ====== Đăng ký (theo name) ======
@router.post("/register", response_model=UserOut)
def register(body: UserCreate, db: Session = Depends(get_db)):
    """
    Tạo user mới chỉ với name. Chặn trùng name.
    """
    print("Register request body:", body)  # log request

    try:
        # Kiểm tra trùng tên
        if UserRepo.find_by_name(db, body.name):
            raise HTTPException(status_code=400, detail="User đã tồn tại")

        # Tạo user mới
        user = UserRepo.create(db, name=body.name)
        print("User created:", user)  # log thành công
        return user
    except Exception as e:
        import traceback
        print("Error creating user:", e)
        traceback.print_exc()  # log stack trace đầy đủ
        raise HTTPException(status_code=500, detail=str(e))


# ====== Đăng nhập (không mật khẩu) ======
@router.post("/login")
def login(
    db: Session = Depends(get_db),
    user_id: int | None = Query(default=None, description="Đăng nhập theo user_id"),
    name: str | None = Query(default=None, description="Hoặc đăng nhập theo name"),
):
    """
    Hai cách:
    - /login?user_id=123
    - /login?name=alice

    Trả về: {"token": "...", "user": {...}}
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
        "user": {"id": user.id, "name": user.name, "created_at": user.created_at},
    }

# ====== Hồ sơ hiện tại ======
@router.get("/me", response_model=UserOut)
def me(current=Depends(get_current_user)):
    return current

# ====== Cập nhật thông tin (chỉ cho đổi name) ======
@router.patch("/me", response_model=UserOut)
def update_me(
    body: UserUpdate,
    db: Session = Depends(get_db),
    current=Depends(get_current_user),
):
    """
    Chỉ cho phép đổi name. Nếu name mới đã có người dùng khác dùng -> 400.
    """
    fields = {}

    if body.name is not None:
        # Nếu trùng với người khác (không phải chính mình) -> chặn
        existing = UserRepo.find_by_name(db, body.name)
        if existing and existing.id != current.id:
            raise HTTPException(status_code=400, detail="Name đã được sử dụng")
        fields["name"] = body.name

    user = UserRepo.update_partial(db, current, **fields)
    return user

# ====== Danh sách người dùng (basic) ======
@router.get("/", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db)):
    rows = UserRepo.list_basic(db)
    # rows có thể là tuple/Row: (id, name, created_at) tuỳ query
    out = []
    for r in rows:
        # Hỗ trợ cả object (User) và tuple
        if hasattr(r, "id"):
            out.append(UserOut(id=r.id, name=r.name, created_at=getattr(r, "created_at", None)))
        else:
            # tuple dạng (id, name, created_at)
            rid, rname, rcreated = r if len(r) == 3 else (r[0], r[1], None)
            out.append(UserOut(id=rid, name=rname, created_at=rcreated))
    return out
