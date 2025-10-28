from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.deps import get_db
from app.schemas.user import UserCreate, UserUpdate, UserOut
from app.repo.user import UserRepo
from app.auth_utils import hash_pw, verify_pw, issue_token
from jose import jwt, JWTError
import os

router = APIRouter(prefix="/api/users", tags=["Users & Auth"])

oauth2 = OAuth2PasswordBearer(tokenUrl="/api/users/login")
SECRET = os.getenv("JWT_SECRET", "secret_key")
ALGO = "HS256"

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2)):
    try:
        data = jwt.decode(token, SECRET, algorithms=[ALGO])
        uid = data.get("id")
    except JWTError:
        raise HTTPException(401, "Token không hợp lệ")
    user = UserRepo.get_by_id(db, uid)
    if not user:
        raise HTTPException(401, "Người dùng không tồn tại")
    return user

# Đăng ký
@router.post("/register", response_model=UserOut)
def register(body: UserCreate, db: Session = Depends(get_db)):
    # Email đã tồn tại?
    if UserRepo.find_by_email(db, body.email):
        raise HTTPException(status_code=400, detail="Email đã tồn tại")

    # Hash password an toàn, chặn lỗi 72 bytes & mật khẩu quá ngắn
    try:
        hashed = hash_pw(body.password)   # "abcdef"/"123456" OK, sẽ được hash
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    user = UserRepo.create(
        db,
        name=body.name,
        email=body.email,
        password_hash=hashed,
    )
    return user

# Đăng nhập
@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    u = UserRepo.find_by_email(db, email)
    if not u or not verify_pw(password, u.password):
        raise HTTPException(401, "Sai email hoặc mật khẩu")
    return {"token": issue_token({"id": u.id}), "user": {"id": u.id, "name": u.name, "email": u.email}}

# Hồ sơ (yêu cầu token)
@router.get("/me", response_model=UserOut)
def me(current=Depends(get_current_user)):
    return current

# Cập nhật thông tin (ví dụ đổi tên / mật khẩu)
@router.patch("/me", response_model=UserOut)
def update_me(body: UserUpdate, db: Session = Depends(get_db), current=Depends(get_current_user)):
    fields = {}
    if body.name is not None:
        fields["name"] = body.name
    if body.password is not None:
        fields["password"] = hash_pw(body.password)
    user = UserRepo.update_partial(db, current, **fields)
    return user

# Danh sách (nếu cần – bạn có thể bảo vệ bằng quyền Admin sau)
@router.get("/", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db)):
    rows = UserRepo.list_basic(db)
    return [UserOut(id=r.id, name=r.name, email=r.email, created_at=None) for r in rows]
