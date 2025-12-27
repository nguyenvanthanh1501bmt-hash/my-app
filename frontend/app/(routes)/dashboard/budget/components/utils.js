/**
 * Format tiền Việt Nam
 * Ví dụ: 500000.00 → 500.000đ
 */
export const formatVND = (n) => {
  const num = Number(n ?? 0);
  return `${num.toLocaleString("vi-VN")}đ`;
};

/**
 * Chuẩn hoá danh sách budget từ backend
 *
 * - Ép kiểu number cho amount, used
 * - Mapping used → spent cho frontend dễ dùng
 */
export function normalizeList(arr) {
  return (arr || []).map((it) => ({
    id: it.id,
    user_id: it.user_id,
    month: it.month,
    amount: Number(it.amount),
    spent: Number(it.used) || 0, // used từ backend
  }));
}
