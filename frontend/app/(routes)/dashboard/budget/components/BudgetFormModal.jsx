"use client";

import React from "react";
import { Calendar } from "lucide-react";

export default function BudgetFormModal({
  isOpen,
  mode,
  month,
  amount,
  busy,
  setMonth,
  setAmount,
  onClose,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 cursor-pointer" onClick={onClose} />
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
            onClick={onSubmit}
            disabled={busy}
            className="h-12 rounded-full bg-indigo-500 px-6 text-white font-semibold disabled:opacity-60 cursor-pointer"
          >
            {mode === "create" ? "Create Budget" : "Save Changes"}
          </button>

          <button
            onClick={onClose}
            disabled={busy}
            className="h-12 rounded-full bg-red-500 px-6 text-white font-semibold disabled:opacity-60 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
