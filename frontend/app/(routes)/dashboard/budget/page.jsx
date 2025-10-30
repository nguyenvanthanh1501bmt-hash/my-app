"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Eye, Pencil, Trash2, Plus, Calendar } from "lucide-react";

// ===== Base URL =====
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

const formatVND = (n) =>
  (n ?? 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

export default function BudgetPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  // ===== Auth bridge state =====
  const [userId, setUserId] = useState(null); // user_id thật từ backend FastAPI
  const [token, setToken] = useState(null);

  // ===== UI state =====
  const [allBudgets, setAllBudgets] = useState([]); // luôn giữ tất cả budgets
  const [filterMonth, setFilterMonth] = useState(""); // tháng được chọn, nếu rỗng thì hiển thị tất cả

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [editing, setEditing] = useState(null);
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  // ====== Clerk → FastAPI session bridge ======
  useEffect(() => {
    if (!isLoaded) return; // chờ Clerk sẵn sàng
    if (!isSignedIn || !user) {
      setUserId(null);
      setToken(null);
      return;
    }

    // Quy ước ánh xạ tên đăng nhập sang backend: ưu tiên username, sau đó email, cuối cùng clerkId
    const candidateName =
      user.username ||
      user.primaryEmailAddress?.emailAddress ||
      user.id;

    (async () => {
      try {
        // Nếu đã có token (trước đó) thì thử dùng lại
        let storedToken = localStorage.getItem("token");
        let backendUserId = null;

        // Thử login bằng name (POST + query param như backend định nghĩa)
        const doLoginByName = async (name) => {
          const res = await fetch(
            `${API_BASE}/api/users/login?name=${encodeURIComponent(name)}`,
            { method: "POST" }
          );
          if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `Login failed (${res.status})`);
          }
          const data = await res.json(); // { token, user: { id, name, created_at } }
          return data;
        };

        // Đăng ký nếu cần
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

        // B1: thử login
        let loginData;
        try {
          loginData = await doLoginByName(candidateName);
        } catch (e) {
          // nếu 404 (user chưa tồn tại) → register rồi login lại
          if (String(e.message).includes("404") || String(e.message).includes("User không tồn tại")) {
            await doRegister(candidateName);
            loginData = await doLoginByName(candidateName);
          } else {
            throw e;
          }
        }

        storedToken = loginData.token;
        backendUserId = loginData.user?.id;

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

  // ===== API calls (fetch) =====
  async function getBudgetsAPI(uid) {
    // Điều chỉnh đường dẫn nếu router backend khác
    const res = await fetch(`${API_BASE}/api/budgets?user_id=${uid}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function createBudgetAPI(uid, ym, amt) {
    const payload = { user_id: uid, month: ym.trim(), amount: Number(amt), used: 0 };
    const res = await fetch(`${API_BASE}/api/budgets/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function deleteBudgetAPI(id) {
    const res = await fetch(`${API_BASE}/api/budgets/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function updateBudgetPartialAPI(uid, ym, newAmount) {
    const params = new URLSearchParams({ user_id: String(uid), month: ym });
    const res = await fetch(`${API_BASE}/api/budgets/partial?${params}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(newAmount) }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  // ===== Load budgets khi đã có userId =====
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

  function normalizeList(arr) {
    return (arr || []).map((it) => ({
      id: it.id,
      user_id: it.user_id,
      month: it.month,
      amount: Number(it.amount),
      spent: Number(it.used) || 0,
    }));
  }

  // ===== Derived: filtered budgets =====
  const shown = useMemo(() => {
    if (!filterMonth) return allBudgets;
    return allBudgets.filter((b) => b.month === filterMonth);
  }, [allBudgets, filterMonth]);

  // ===== Handlers =====
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
        const next = allBudgets.map((x) =>
          x.id === editing.id ? { ...x, amount: Number(upd.amount) } : x
        );
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

  // ===== UI render =====
  if (!isLoaded) {
    return <div className="p-6 text-center text-slate-500">Đang tải...</div>;
  }

  if (!userId) {
    // Đã đăng nhập Clerk nhưng đang khởi tạo phiên với backend FastAPI
    return (
      <div className="p-6 text-center text-slate-500">
        Đang đồng bộ tài khoản với hệ thống...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight">My Budgets</h1>

        {/* Filter by month (client-side) */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
            <label className="text-sm text-slate-600">Month</label>
            <input
            type="month"
            onChange={(e) => setFilterMonth(e.target.value)}
            className="h-10 rounded-lg border px-3"
            />
        </div>

      {shown.map((b) => (
        <BudgetCard
          key={b.id}
          budget={b}
          onEdit={() => openEdit(b)}
          onDelete={() => handleDelete(b)}
        />
      ))}

      <button
        onClick={openCreate}
        className="mt-2 w-full rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 p-10 text-center transition"
      >
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-slate-300">
          <Plus className="h-5 w-5" />
        </div>
        <p className="text-lg font-semibold">Create New Budget</p>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="relative z-10 w-[560px] max-w-[92vw] rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-xl font-semibold">
              {mode === "create" ? "Create New Budget" : "Edit Budget"}
            </h2>

            <label className="mb-2 block text-sm font-medium">Month</label>
            <div className="mb-5 relative">
              <input
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="YYYY-MM"
                className="h-12 w-full rounded-full border border-slate-300 px-5 pr-12 outline-none focus:border-slate-400"
              />
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <Calendar className="h-5 w-5" />
              </div>
            </div>

            <label className="mb-2 block text-sm font-medium">Amount</label>
            <div className="mb-8">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="numeric"
                placeholder="Amount"
                className="h-12 w-full rounded-full border border-slate-300 px-5 outline-none focus:border-slate-400"
              />
            </div>

            <div className="mt-2 flex items-center gap-4">
              <button
                onClick={submitForm}
                disabled={busy}
                className="h-12 rounded-full bg-indigo-500 px-6 text-white font-semibold disabled:opacity-60"
              >
                {mode === "create" ? "Create Budget" : "Save Changes"}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                disabled={busy}
                className="h-12 rounded-full bg-red-500 px-6 text-white font-semibold disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BudgetCard({ budget, onEdit, onDelete }) {
  const used = (budget.spent || 0) / Math.max(1, budget.amount);
  const remaining = Math.max(budget.amount - (budget.spent || 0), 0);

  return (
    <div className="mb-4 rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="font-semibold">{budget.month}</div>
        <div className="text-indigo-600 font-extrabold">{formatVND(budget.amount)}</div>
      </div>
      <div className="mt-2 grid grid-cols-2 text-slate-500 text-sm font-semibold">
        <div>{formatVND(budget.spent)} Spent</div>
        <div className="text-right">{formatVND(remaining)} Remaining</div>
      </div>
      <div className="mt-2 h-4 w-full rounded-full bg-slate-200">
        <div
          className="h-4 rounded-full bg-neutral-800"
          style={{ width: `${Math.min(used * 100, 100)}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-slate-500 font-semibold">
        <div>{Math.round(used * 100)}% Used</div>
        <div className="flex items-center gap-4">
          <button
            className="rounded-full p-2 hover:bg-slate-100"
            title="Xem lịch sử"
            onClick={() => alert("Lịch sử (demo)")}
          >
            <Eye className="h-5 w-5" />
          </button>
          <button
            className="rounded-full p-2 hover:bg-slate-100"
            title="Chỉnh sửa"
            onClick={onEdit}
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            className="rounded-full p-2 hover:bg-slate-100 text-red-600"
            title="Xóa"
            onClick={onDelete}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
