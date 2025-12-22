// Format tiền: 500000.00 -> 500.000đ
export const formatVND = (n) => {
  const num = Number(n ?? 0);
  return `${num.toLocaleString("vi-VN")}đ`;
};

export function normalizeList(arr) {
  return (arr || []).map((it) => ({
    id: it.id,
    user_id: it.user_id,
    month: it.month,
    amount: Number(it.amount),
    spent: Number(it.used) || 0, // used từ backend
  }));
}
