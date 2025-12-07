"use client";
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

// URL FastAPI – chỉnh lại nếu bạn dùng port/host khác
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// màu cho pie chart report
const REPORT_COLORS = [
  "#2563eb",
  "#22c55e",
  "#f97316",
  "#e11d48",
  "#0ea5e9",
  "#a855f7",
];

/* --------- helpers --------- */
const currency = (n) =>
  (Number(n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) ||
    "0") + " ₫";

const currencyAbs = (n) =>
  (Number(Math.abs(n) || 0).toLocaleString("vi-VN", {
    maximumFractionDigits: 0,
  }) || "0") + " ₫";

const formatSigned = (n) =>
  (n > 0 ? "+" : n < 0 ? "-" : "") + currencyAbs(n);

const cls = (...a) => a.filter(Boolean).join(" ");

/* --------- modal component --------- */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-gray-100 text-xl hover:bg-gray-200"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* --------- main page --------- */
export default function ExpensesPage() {
  const [userId] = useState(1); // TODO: thay bằng ID user thật khi gắn auth
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterType, setFilterType] = useState("all"); // all | income | outcome
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("all");
  const [year, setYear] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportTab, setReportTab] = useState("income"); // income | outcome

  const [form, setForm] = useState({
    user_id: userId,
    amount: "",
    type: "outcome",
    note: "",
    date: "",
    category_id: 1,
  });

  /* --------- fetch data --------- */
  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/transactions/by-user/${userId}`
      );
      if (!res.ok) throw new Error("fetch transactions failed");
      const data = await res.json();
      console.log("TX data:", data);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetch transactions error:", err);
    }
  }, [userId]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categories`);
      if (!res.ok) throw new Error("fetch categories failed");
      const data = await res.json();
      console.log("Categories data:", data);
      setCategories(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0) {
        setForm((f) => ({ ...f, category_id: data[0].id }));
      }
    } catch (err) {
      console.error("fetch categories error:", err);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [fetchTransactions, fetchCategories]);

  /* --------- map category id -> name --------- */
  const catMap = useMemo(() => {
    const m = {};
    categories.forEach((c) => {
      m[c.id] = c.name;
    });
    return m;
  }, [categories]);

  /* --------- totals (tất cả transaction) cho Expense Tracker --------- */
  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [transactions]
  );
  const totalExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "outcome")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [transactions]
  );
  const currentBalance = totalIncome - totalExpense;

  /* --------- options month/year (dựa theo data) --------- */
  const monthOptions = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => {
      if (!t.date) return;
      const m = String(t.date).slice(5, 7);
      set.add(m);
    });
    return Array.from(set).sort();
  }, [transactions]);

  const yearOptions = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => {
      if (!t.date) return;
      const y = String(t.date).slice(0, 4);
      set.add(y);
    });
    return Array.from(set).sort();
  }, [transactions]);

  /* --------- apply filter cho phần Transaction --------- */
  const filteredTx = useMemo(() => {
    return transactions.filter((t) => {
      if (filterType !== "all" && t.type !== filterType) return false;
      if (
        search &&
        !String(t.note || "").toLowerCase().includes(search.toLowerCase())
      )
        return false;

      if (month !== "all" && String(t.date).slice(5, 7) !== month) return false;
      if (year !== "all" && String(t.date).slice(0, 4) !== year) return false;

      return true;
    });
  }, [transactions, filterType, search, month, year]);

  const txIncome = filteredTx
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount || 0), 0);
  const txExpense = filteredTx
    .filter((t) => t.type === "outcome")
    .reduce((s, t) => s + Number(t.amount || 0), 0);
  const txNet = txIncome - txExpense; // net = income - expense

  /* --------- REPORT: group by category trên FE (cách 1) --------- */

  // Income report
  const incomeReport = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (t.type !== "income") return;
      const name = catMap[t.category_id] || "Uncategorized";
      map[name] = (map[name] || 0) + Number(t.amount || 0);
    });

    const rows = Object.entries(map).map(([category, amount]) => ({
      category,
      amount,
    }));
    const total = rows.reduce((s, r) => s + r.amount, 0) || 1;
    return rows.map((r) => ({
      ...r,
      percentage: (r.amount / total) * 100,
    }));
  }, [transactions, catMap]);

  // Expense report
  const expenseReport = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (t.type !== "outcome") return;
      const name = catMap[t.category_id] || "Uncategorized";
      map[name] = (map[name] || 0) + Number(t.amount || 0);
    });

    const rows = Object.entries(map).map(([category, amount]) => ({
      category,
      amount,
    }));
    const total = rows.reduce((s, r) => s + r.amount, 0) || 1;
    return rows.map((r) => ({
      ...r,
      percentage: (r.amount / total) * 100,
    }));
  }, [transactions, catMap]);

  const reportData =
    reportTab === "income" ? incomeReport : expenseReport;

  // tạo conic-gradient cho pie chart
  const pieGradient = useMemo(() => {
    if (!reportData.length) return "#e5e7eb";
    let current = 0;
    const parts = reportData.map((item, idx) => {
      const start = current;
      const end = current + item.percentage;
      current = end;
      return `${REPORT_COLORS[idx % REPORT_COLORS.length]} ${start}% ${end}%`;
    });
    return `conic-gradient(${parts.join(",")})`;
  }, [reportData]);

  /* --------- handle modal --------- */
  const openAddModal = () => {
    setForm({
      user_id: userId,
      amount: "",
      type: "outcome",
      note: "",
      date: new Date().toISOString().slice(0, 10), // yyyy-MM-dd
      category_id: categories?.[0]?.id ?? 1,
    });
    setOpenModal(true);
  };

  const createTransaction = async () => {
    if (!form.amount) return alert("Vui lòng nhập Amount");
    if (!form.date) return alert("Vui lòng chọn Date");

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/transactions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Create transaction failed");
      }
      await fetchTransactions();
      setOpenModal(false);
    } catch (err) {
      console.error(err);
      alert("Không tạo được transaction, xem log server.");
    } finally {
      setLoading(false);
    }
  };

  /* --------- delete transaction (xoá + update totals) --------- */
  const deleteTransaction = async (id) => {
    if (!confirm("Delete this transaction?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/transactions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("delete failed");
      // cập nhật FE: những tổng phía trên tự tính lại từ state mới
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Xoá thất bại, xem log server.");
    }
  };

  /* ==============================================================
     UI
     ============================================================== */
  return (
    <div className="min-h-screen bg-white px-6 py-8 text-gray-800">
      {/* -------- Expense Tracker: GIỮ NGUYÊN -------- */}
      <h1 className="mb-6 text-3xl font-bold text-blue-700">Expense Tracker</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-blue-50 p-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-blue-700">Current Balance</p>
          <p className="mt-2 text-2xl font-extrabold text-blue-800">
            {currency(currentBalance)}
          </p>
        </div>
        <div className="rounded-3xl bg-green-50 p-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-green-700">Income</p>
          <p className="mt-2 text-2xl font-extrabold text-green-700">
            {currency(totalIncome)}
          </p>
        </div>
        <div className="rounded-3xl bg-red-50 p-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-red-700">Expense</p>
          <p className="mt-2 text-2xl font-extrabold text-red-700">
            {currency(totalExpense)}
          </p>
        </div>
      </div>

      {/* -------- Transaction section (tiêu đề đơn lẻ) -------- */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-blue-700">Transaction</h2>
        <button
          onClick={openAddModal}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 cursor-pointer"
        >
          + Add transaction
        </button>
      </div>

      {/* Filter + search bar */}
      <div className="mb-6 rounded-3xl bg-blue-50 p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* tabs */}
          <div className="flex gap-2">
            {[
              { key: "all", label: "All" },
              { key: "income", label: "Income" },
              { key: "outcome", label: "Expense" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterType(tab.key)}
                className={cls(
                  "rounded-full px-4 py-2 text-sm font-semibold cursor-pointer",
                  filterType === tab.key
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* search + month/year */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full max-w-xs rounded-full border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
            />

            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="h-10 rounded-full border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="all">Month</option>
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="h-10 rounded-full border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="all">Year</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3 stat cards dưới filter – có icon */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Total Income */}
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-xl">
            📈
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Income</p>
            <p className="mt-1 text-xl font-bold text-green-600">
              {currency(txIncome)}
            </p>
          </div>
        </div>

        {/* Total Expense */}
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-xl">
            📉
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Expense</p>
            <p className="mt-1 text-xl font-bold text-red-600">
              {currency(txExpense)}
            </p>
          </div>
        </div>

        {/* Net Amount */}
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-xl">
            📊
          </div>
          <div>
            <p className="text-sm text-gray-500">Net Amount</p>
            <p
              className={cls(
                "mt-1 text-xl font-bold",
                txNet > 0
                  ? "text-blue-700"
                  : txNet < 0
                  ? "text-red-600"
                  : "text-gray-700"
              )}
            >
              {formatSigned(txNet)}
            </p>
          </div>
        </div>
      </div>

      {/* All Transactions – card đỏ / xanh + category + icon xoá */}
      <div className="rounded-2xl bg-white p-4 shadow">
        <h3 className="mb-3 text-lg font-semibold text-blue-700">
          All Transaction
        </h3>

        <ul>
          {(showAll ? filteredTx : filteredTx.slice(0, 5)).map((t) => {
            const isIncome = t.type === "income";
            const catName = catMap[t.category_id] || "Uncategorized";
            const date = String(t.date).slice(0, 10);

            return (
              <li key={t.id} className="mb-3 last:mb-0">
                <div
                  className={cls(
                    "flex items-center justify-between rounded-3xl px-5 py-4 text-white shadow-md",
                    isIncome ? "bg-green-700" : "bg-red-800"
                  )}
                >
                  {/* left: date + note */}
                  <div className="flex items-start gap-3">
                    <div
                      className={cls(
                        "mt-1 grid h-8 w-8 place-items-center rounded-full border-2",
                        isIncome
                          ? "border-green-200 bg-green-500"
                          : "border-red-200 bg-red-500"
                      )}
                    >
                      {isIncome ? "↑" : "↓"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold opacity-80">
                        {date}
                      </p>
                      <p className="text-base font-semibold">
                        {t.note || "(no note)"}
                      </p>
                    </div>
                  </div>

                  {/* right: category pill + delete + amount */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                        {catName}
                      </span>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="grid h-7 w-7 place-items-center rounded-full bg-white/20 text-xs hover:bg-white/30 cursor-pointer"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                    <p
                      className={cls(
                        "text-lg font-bold",
                        isIncome ? "text-green-200" : "text-red-200"
                      )}
                    >
                      {isIncome ? "+" : "-"} {currency(t.amount)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {filteredTx.length > 5 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAll((s) => !s)}
              className="rounded-full border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 cursor-pointer"
            >
              {showAll ? "See less" : "See all"}
            </button>
          </div>
        )}
      </div>

      {/* ---------- Report section (Income / Expense by categories) ---------- */}
      <section className="mt-8 rounded-3xl bg-white p-5 shadow">
        <h2 className="mb-4 text-xl font-semibold text-blue-700">Report</h2>

        {/* Tabs */}
        <div className="mb-4 flex gap-3">
          <button
            onClick={() => setReportTab("income")}
            className={cls(
              "rounded-full px-4 py-2 text-sm font-semibold cursor-pointer",
              reportTab === "income"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            Income
          </button>
          <button
            onClick={() => setReportTab("outcome")}
            className={cls(
              "rounded-full px-4 py-2 text-sm font-semibold cursor-pointer",
              reportTab === "outcome"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            Expense
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Pie + legend */}
          <div className="flex flex-col items-center rounded-2xl bg-gray-50 p-4">
            <div
              className="mb-4 h-72 w-72 rounded-full border border-blue-400"
              style={{ background: pieGradient }}
            />
            <p className="text-base font-semibold">
              {reportTab === "income"
                ? "Income by categories"
                : "Expense by categories"}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {reportData.map((item, idx) => (
                <div
                  key={item.category}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor:
                        REPORT_COLORS[idx % REPORT_COLORS.length],
                    }}
                  />
                  <span>{item.category}</span>
                </div>
              ))}
              {!reportData.length && (
                <p className="text-sm text-gray-400">No data</p>
              )}
            </div>
          </div>

          {/* Details table */}
          <div className="rounded-2xl bg-gray-50 p-4">
            <h3 className="mb-3 text-lg font-semibold">Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">Category</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                    <th className="px-3 py-2 text-right">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row) => (
                    <tr key={row.category} className="border-b">
                      <td className="px-3 py-2">{row.category}</td>
                      <td className="px-3 py-2 text-right">
                        {currency(row.amount)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {row.percentage.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  {!reportData.length && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-3 py-4 text-center text-gray-400"
                      >
                        No data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Popup Create New Transaction ---------- */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Create New Transaction"
      >
        <div className="space-y-5">
          {/* Amount */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Amount (VND)
            </label>
            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full rounded-full border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Type */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Type
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full rounded-full border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="income">Income</option>
              <option value="outcome">Expense</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Description
            </label>
            <input
              type="text"
              placeholder="Transaction description"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full rounded-full border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Date & Category */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-full border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Category
              </label>
              <select
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: Number(e.target.value) })
                }
                className="w-full rounded-full border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              >
                {categories.length === 0 && (
                  <option value="">No category found</option>
                )}
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* buttons */}
          <div className="mt-2 grid gap-3 md:grid-cols-2">
            <button
              onClick={createTransaction}
              disabled={loading}
              className={cls(
                "rounded-2xl px-5 py-3 font-semibold text-white shadow cursor-pointer",
                loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {loading ? "Creating..." : "Create Transaction"}
            </button>
            <button
              onClick={() => setOpenModal(false)}
              className="rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white shadow hover:bg-red-700 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
