"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import MonthFilter from "./components/MonthFilter";
import BudgetCard from "./components/BudgetCard";
import BudgetFormModal from "./components/BudgetFormModal";
import TransactionHistoryModal from "./components/TransactionHistoryModal";

import { normalizeList } from "./components/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function BudgetPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  // bridge Clerk -> backend user
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  // budgets
  const [allBudgets, setAllBudgets] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");

  // form create/edit
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [editing, setEditing] = useState(null);
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  // transaction history
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyMonth, setHistoryMonth] = useState("");
  const [historyItems, setHistoryItems] = useState([]);

  /* ================== Auth bridge Clerk → FastAPI ================== */
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !user) {
      setUserId(null);
      setToken(null);
      return;
    }

    const candidateName =
      user.username || user.primaryEmailAddress?.emailAddress || user.id;

    (async () => {
      try {
        const doLoginByName = async (name) => {
          const res = await fetch(
            `${API_BASE}/api/users/login?name=${encodeURIComponent(name)}`,
            { method: "POST" }
          );
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
          if (
            String(e.message).includes("404") ||
            String(e.message).includes("User không tồn tại")
          ) {
            await doRegister(candidateName);
            loginData = await doLoginByName(candidateName);
          } else throw e;
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

  /* ================== API helpers ================== */
  async function getBudgetsAPI(uid) {
    const res = await fetch(`${API_BASE}/api/budgets?user_id=${uid}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function createBudgetAPI(uid, ym, amt) {
    const payload = {
      user_id: uid,
      month: ym.trim(),
      amount: Number(amt),
      used: 0,
    };
    const res = await fetch(`${API_BASE}/api/budgets/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function deleteBudgetAPI(id) {
    const res = await fetch(`${API_BASE}/api/budgets/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function updateBudgetPartialAPI(uid, ym, newAmount) {
    const params = new URLSearchParams({
      user_id: String(uid),
      month: ym,
    });
    const res = await fetch(`${API_BASE}/api/budgets/partial?${params}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(newAmount) }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function getTransactionsByUserAPI(uid) {
    const res = await fetch(`${API_BASE}/api/transactions/by-user/${uid}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  /* ================== Load budgets ================== */
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      try {
        const list = await getBudgetsAPI(userId);
        const normalized = normalizeList(list);
        if (!cancelled) setAllBudgets(normalized);
        localStorage.setItem(`budgets_user_${userId}`, JSON.stringify(normalized));
      } catch (e) {
        console.error(e);
        const cached = localStorage.getItem(`budgets_user_${userId}`);
        if (cached && !cancelled) {
          try {
            setAllBudgets(JSON.parse(cached));
          } catch {}
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  /* ================== Derived ================== */
  const shown = useMemo(() => {
    if (!filterMonth) return allBudgets;
    return allBudgets.filter((b) => b.month === filterMonth);
  }, [allBudgets, filterMonth]);

  /* ================== Handlers ================== */
  function openCreate() {
    setMode("create");
    setEditing(null);
    setMonth("");
    setAmount("");
    setIsOpen(true);
  }

  function openEdit(b) {
    setMode("edit");
    setEditing(b);
    setMonth(b.month);
    setAmount(String(b.amount));
    setIsOpen(true);
  }

  async function submitForm() {
    if (!month || !amount) return alert("Vui lòng nhập đủ Month và Amount");
    try {
      setBusy(true);

      if (mode === "create") {
        const data = await createBudgetAPI(userId, month, Number(amount));
        const created = {
          id: data.id,
          user_id: data.user_id,
          month: data.month,
          amount: Number(data.amount),
          spent: Number(data.used) || 0,
        };
        const next = [created, ...allBudgets];
        setAllBudgets(next);
        localStorage.setItem(`budgets_user_${userId}`, JSON.stringify(next));
      } else if (mode === "edit" && editing) {
        const upd = await updateBudgetPartialAPI(editing.user_id ?? userId, month, Number(amount));
        const next = allBudgets.map((x) => (x.id === editing.id ? { ...x, amount: Number(upd.amount) } : x));
        setAllBudgets(next);
        localStorage.setItem(`budgets_user_${userId}`, JSON.stringify(next));
      }

      setIsOpen(false);
    } catch (e) {
      alert("API error: " + e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(b) {
    if (!confirm("Xóa budget này?")) return;
    try {
      setBusy(true);
      await deleteBudgetAPI(b.id);
      const next = allBudgets.filter((x) => x.id !== b.id);
      setAllBudgets(next);
      localStorage.setItem(`budgets_user_${userId}`, JSON.stringify(next));
    } catch (e) {
      alert("API error: " + e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleViewHistory(budget) {
    try {
      const list = await getTransactionsByUserAPI(userId);
      const filtered = (list || []).filter((tx) => {
        if (tx.type !== "outcome") return false;
        const ym = String(tx.date).slice(0, 7);
        return ym === budget.month;
      });

      setHistoryItems(filtered);
      setHistoryMonth(budget.month);
      setHistoryOpen(true);
    } catch (e) {
      console.error(e);
      alert("Không tải được transaction history: " + e.message);
    }
  }

  /* ================== Render ================== */
  if (!isLoaded) {
    return <div className="p-6 text-center text-slate-500">Đang tải...</div>;
  }

  if (!userId) {
    return <div className="p-6 text-center text-slate-500">Đang đồng bộ tài khoản với hệ thống...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight">My Budgets</h1>

      <MonthFilter value={filterMonth} onChange={setFilterMonth} />

      {shown.map((b) => (
        <BudgetCard
          key={b.id}
          budget={b}
          onEdit={() => openEdit(b)}
          onDelete={() => handleDelete(b)}
          onViewHistory={() => handleViewHistory(b)}
        />
      ))}

      <button
        onClick={openCreate}
        className="mt-2 w-full rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 p-10 text-center transition cursor-pointer"
      >
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-slate-300">
          <Plus className="h-5 w-5" />
        </div>
        <p className="text-lg font-semibold">Create New Budget</p>
      </button>

      <BudgetFormModal
        isOpen={isOpen}
        mode={mode}
        month={month}
        amount={amount}
        busy={busy}
        setMonth={setMonth}
        setAmount={setAmount}
        onClose={() => setIsOpen(false)}
        onSubmit={submitForm}
      />

      <TransactionHistoryModal
        open={historyOpen}
        month={historyMonth}
        items={historyItems}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}
