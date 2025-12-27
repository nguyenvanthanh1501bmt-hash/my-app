from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.deps import get_db
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetOut
from app.repo.budget import BudgetRepo
from app.repo.user import UserRepo

# Router quản lý các API liên quan đến Budget
router = APIRouter(prefix="/api/budgets", tags=["Budgets"])


@router.post("/", response_model=BudgetOut)
def create_budget(body: BudgetCreate, db: Session = Depends(get_db)):
    """
    Tạo mới ngân sách (budget) cho một user theo tháng.

    - Kiểm tra user có tồn tại hay không
    - Tạo budget với các thông tin: user_id, month, amount, used
    - (Tuỳ chọn) Đồng bộ lại số tiền đã sử dụng (used) từ bảng transactions
      để đảm bảo dữ liệu nhất quán khi khởi tạo
    """
    if not UserRepo.get_by_id(db, body.user_id):
        raise HTTPException(400, "User không tồn tại")

    b = BudgetRepo.create(
        db,
        body.user_id,
        body.month,
        body.amount,
        body.used
    )

    # Đồng bộ used từ transactions (nếu đã có giao dịch trước đó)
    b = BudgetRepo.recalc_used_from_transactions(db, b)
    return b


@router.get("/find", response_model=BudgetOut | None)
def find_user_by_month(user_id: int, month: str, db: Session = Depends(get_db)):
    """
    Lấy budget của một user theo tháng cụ thể.

    - Trả về budget nếu tồn tại
    - Trả về None nếu user chưa tạo budget cho tháng đó
    """
    return BudgetRepo.find_user_by_month(db, user_id, month)


@router.patch("/update-used")
def update_used_amount(user_id: int, month: str, delta: float, db: Session = Depends(get_db)):
    """
    Cập nhật số tiền đã sử dụng (used) của budget.

    - delta: số tiền thay đổi (thường là cộng thêm khi tạo transaction chi tiêu)
    - Dùng khi phát sinh giao dịch mới
    """
    b = BudgetRepo.update_used_amount(db, user_id, month, delta)
    if not b:
        raise HTTPException(404, "Không có budget cho tháng này")

    return {
        "ok": True,
        "budget": BudgetOut.model_validate(b)
    }


@router.patch("/revert-used")
def revert_used_amount(user_id: int, month: str, delta: float, db: Session = Depends(get_db)):
    """
    Hoàn tác (revert) số tiền đã sử dụng của budget.

    - delta: số tiền cần trừ đi
    - Thường dùng khi xóa hoặc chỉnh sửa transaction
    """
    b = BudgetRepo.revert_used_amount(db, user_id, month, delta)
    if not b:
        raise HTTPException(404, "Không có budget cho tháng này")

    return {
        "ok": True,
        "budget": BudgetOut.model_validate(b)
    }


@router.patch("/partial", response_model=BudgetOut)
def update_partial(user_id: int, month: str, body: BudgetUpdate, db: Session = Depends(get_db)):
    """
    Cập nhật một phần thông tin của budget (partial update).

    - Chỉ update các field được truyền lên (amount, used, ...)
    - Không thay đổi user_id và month
    """
    b = BudgetRepo.find_user_by_month(db, user_id, month)
    if not b:
        raise HTTPException(404, "Không có budget cho tháng này")

    b = BudgetRepo.update_partial(db, b, **body.model_dump())
    return b


@router.delete("/{budget_id}")
def delete_budget(budget_id: int, db: Session = Depends(get_db)):
    """
    Xóa budget theo budget_id.

    - Thường dùng khi user muốn reset hoặc xóa hoàn toàn ngân sách tháng
    """
    BudgetRepo.delete(db, budget_id)
    return {"deleted": True}


@router.get("/", response_model=list[BudgetOut])
def list_budgets(user_id: int = Query(...), db: Session = Depends(get_db)):
    """
    Lấy danh sách tất cả budget của một user.

    - Dùng cho màn hình quản lý ngân sách (budget overview)
    - Trả về danh sách budget theo các tháng
    """
    return BudgetRepo.list_by_user(db, user_id)
