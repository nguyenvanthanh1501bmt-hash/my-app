// helpers.js
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const REPORT_COLORS = ["#2563eb", "#22c55e", "#f97316", "#e11d48", "#0ea5e9", "#a855f7"];

export const currency = (n) =>
  (Number(n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) || "0") + " ₫";

export const currencyAbs = (n) =>
  (Number(Math.abs(n) || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) || "0") + " ₫";

export const formatSigned = (n) => (n > 0 ? "+" : n < 0 ? "-" : "") + currencyAbs(n);

export const cls = (...a) => a.filter(Boolean).join(" ");

// Format YYYY-MM-DD -> DD/MM/YYYY
export const formatDateVN = (value) => {
  if (!value) return "";
  const s = String(value).slice(0, 10);
  const [y, m, d] = s.split("-");
  if (!y || !m || !d) return s;
  return `${d}/${m}/${y}`;
};

// Date <-> ISO string (yyyy-mm-dd)
export const parseISODate = (s) => {
  if (!s) return null;
  const [y, m, d] = String(s).slice(0, 10).split("-");
  if (!y || !m || !d) return null;
  return new Date(Number(y), Number(m) - 1, Number(d));
};

export const toISODate = (date) => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
