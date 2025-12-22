"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";

// react-datepicker css giữ 1 chỗ (tại page)
import "react-datepicker/dist/react-datepicker.css";

import {
  API_BASE,
  REPORT_COLORS,
} from "./components/helpers";

import SummaryCards from "./components/SummaryCards";
import TransactionHeader from "./components/TransactionHeader";
import FiltersBar from "./components/FiltersBar";
import StatsCards from "./components/StatsCards";
import TransactionsList from "./components/TransactionsList";
import ReportSection from "./components/ReportSection";
import CreateTransactionModal from "./components/CreateTransactionModal";

export default function ExpensesPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

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
    user_id: null,
    amount: "",
    type: "outcome",
    note: "",
    date: "",
    category_id: 1,
  });

  /* ================== Auth bridge Clerk → FastAPI ================== */
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !user) {
      setUserId(null);
      setToken(null);
      return;
    }

    const candidateName = user.username || user.primaryEmailAddress?.emailAddress || user.id;

    (async () => {
      try {
        const doLoginByName = async (name) => {
          const res = await fetch(`${API_BASE}/api/users/login?name=${encodeURIComponent(name)}`, {
            method: "POST",
          });
          if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `Login failed (${res.status})`);
          }
          return res.json();
        };

        const doRegister = async (name) => {
          const res = await fetch(`${API_BASE}/api/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
          });
          if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `Register failed (${res.status})`);
          }
          return res.json();
        };

        let loginData;
        try {
          loginData = await doLoginByName(candidateName);
        } catch (e) {
          if (String(e.message).includes("404") || String(e.message).includes("User không tồn tại")) {
            await doRegister(candidateName);
            loginData = await doLoginByName(candidateName);
          } else {
            throw e;
          }
        }

        const storedToken = loginData.token;
        const backendUserId = loginData.user?.id;

        localStorage.setItem("token", storedToken);
        setToken(storedToken);
        setUserId(backendUserId);
      } catch (err) {
        console.error("Auth bridge error:", err);
        setUserId(null);
        setToken(null);
      }
    })();
  }, [isLoaded, isSignedIn, user]);

  /* --------- fetch data --------- */
  const fetchTransactions = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE}/api/transactions/by-user/${userId}`);
      if (!res.ok) throw new Error("fetch transactions failed");
      const data = await res.json();
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
      setCategories(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0) {
        setForm((f) => ({ ...f, category_id: data[0].id }));
      }
    } catch (err) {
      console.error("fetch categories error:", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!userId) return;
    fetchTransactions();
  }, [fetchTransactions, userId]);

  /* --------- map category id -> name --------- */
  const catMap = useMemo(() => {
    const m = {};
    categories.forEach((c) => {
      m[c.id] = c.name;
    });
    return m;
  }, [categories]);

  /* --------- totals --------- */
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

  /* --------- options month/year --------- */
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

  /* --------- apply filter --------- */
  const filteredTx = useMemo(() => {
    return transactions.filter((t) => {
      if (filterType !== "all" && t.type !== filterType) return false;
      if (search && !String(t.note || "").toLowerCase().includes(search.toLowerCase())) return false;

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

  const txNet = txIncome - txExpense;

  /* --------- REPORT: group by category --------- */
  const incomeReport = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (t.type !== "income") return;
      const name = catMap[t.category_id] || "Uncategorized";
      map[name] = (map[name] || 0) + Number(t.amount || 0);
    });

    const rows = Object.entries(map).map(([category, amount]) => ({ category, amount }));
    const total = rows.reduce((s, r) => s + r.amount, 0) || 1;
    return rows.map((r) => ({ ...r, percentage: (r.amount / total) * 100 }));
  }, [transactions, catMap]);

  const expenseReport = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (t.type !== "outcome") return;
      const name = catMap[t.category_id] || "Uncategorized";
      map[name] = (map[name] || 0) + Number(t.amount || 0);
    });

    const rows = Object.entries(map).map(([category, amount]) => ({ category, amount }));
    const total = rows.reduce((s, r) => s + r.amount, 0) || 1;
    return rows.map((r) => ({ ...r, percentage: (r.amount / total) * 100 }));
  }, [transactions, catMap]);

  const reportData = reportTab === "income" ? incomeReport : expenseReport;

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

  /* --------- modal handlers --------- */
  const openAddModal = () => {
    if (!userId) return;
    setForm({
      user_id: userId,
      amount: "",
      type: "outcome",
      note: "",
      date: new Date().toISOString().slice(0, 10),
      category_id: categories?.[0]?.id ?? 1,
    });
    setOpenModal(true);
  };

  const createTransaction = async () => {
    if (!form.amount) return alert("Vui lòng nhập Amount");
    if (!form.date) return alert("Vui lòng chọn Date");
    if (!userId) return alert("User chưa được đồng bộ với backend.");

    try {
      setLoading(true);
      const payload = { ...form, user_id: userId };
      const res = await fetch(`${API_BASE}/api/transactions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  const deleteTransaction = async (id) => {
    if (!confirm("Delete this transaction?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/transactions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Xoá thất bại, xem log server.");
    }
  };

  /* ================== Render ================== */
  if (!isLoaded) return <div className="p-6 text-center text-slate-500">Đang tải...</div>;
  if (!userId) return <div className="p-6 text-center text-slate-500">Đang đồng bộ tài khoản với hệ thống...</div>;

  return (
    <div className="min-h-screen bg-white px-6 py-8 text-gray-800">
      <h1 className="mb-6 text-3xl font-bold text-blue-700">Expense Tracker</h1>

      <SummaryCards
        currentBalance={currentBalance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
      />

      <TransactionHeader onAdd={openAddModal} />

      <FiltersBar
        filterType={filterType}
        setFilterType={setFilterType}
        search={search}
        setSearch={setSearch}
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
        monthOptions={monthOptions}
        yearOptions={yearOptions}
      />

      <StatsCards txIncome={txIncome} txExpense={txExpense} txNet={txNet} />

      <TransactionsList
        filteredTx={filteredTx}
        showAll={showAll}
        setShowAll={setShowAll}
        catMap={catMap}
        deleteTransaction={deleteTransaction}
      />

      <ReportSection
        reportTab={reportTab}
        setReportTab={setReportTab}
        reportData={reportData}
        pieGradient={pieGradient}
      />

      <CreateTransactionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        form={form}
        setForm={setForm}
        categories={categories}
        createTransaction={createTransaction}
        loading={loading}
      />
    </div>
  );
}
