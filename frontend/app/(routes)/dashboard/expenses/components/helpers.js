// Base URL gọi API backend (ưu tiên env, fallback localhost)
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Mảng màu dùng cho report chart/legend
export const REPORT_COLORS = [
  "#2563eb",
  "#22c55e",
  "#f97316",
  "#e11d48",
  "#0ea5e9",
  "#a855f7",
];

// Format tiền VND (không lấy phần thập phân)
export const currency = (n) =>
  (Number(n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) ||
    "0") + " ₫";

// Format trị tuyệt đối (dùng khi dấu +/- xử lý riêng)
export const currencyAbs = (n) =>
  (Number(Math.abs(n) || 0).toLocaleString("vi-VN", {
    maximumFractionDigits: 0,
  }) || "0") + " ₫";

// Thêm dấu (+/-) rõ ràng cho số tiền
export const formatSigned = (n) =>
  (n > 0 ? "+" : n < 0 ? "-" : "") + currencyAbs(n);

// Join className có điều kiện (giống clsx tối giản)
export const cls = (...a) => a.filter(Boolean).join(" ");

// Chuyển "YYYY-MM-DD" -> "DD/MM/YYYY"
export const formatDateVN = (value) => {
  if (!value) return "";
  // Cắt phần date nếu có timestamp (VD: 2025-12-27T00:00:00)
  const s = String(value).slice(0, 10);
  const [y, m, d] = s.split("-");
  if (!y || !m || !d) return s;
  return `${d}/${m}/${y}`;
};

// Parse "YYYY-MM-DD" -> Date object (cho react-datepicker)
export const parseISODate = (s) => {
  if (!s) return null;
  const [y, m, d] = String(s).slice(0, 10).split("-");
  if (!y || !m || !d) return null;
  // Month trong JS: 0-11 nên phải -1
  return new Date(Number(y), Number(m) - 1, Number(d));
};

// Date object -> "YYYY-MM-DD" (chuẩn hoá để lưu state & gửi backend)
export const toISODate = (date) => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
