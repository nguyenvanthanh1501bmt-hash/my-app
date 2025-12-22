import React from "react";
import DatePicker from "react-datepicker";
import Modal from "./Modal";
import { cls, formatDateVN, parseISODate, toISODate } from "./helpers";

export default function CreateTransactionModal({
  open,
  onClose,
  form,
  setForm,
  categories,
  createTransaction,
  loading,
}) {
  return (
    <Modal open={open} onClose={onClose} title="Create New Transaction">
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">Amount (VND)</label>
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full rounded-full border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full rounded-full border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="income">Income</option>
            <option value="outcome">Expense</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">Description</label>
          <input
            type="text"
            placeholder="Transaction description"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full rounded-full border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">Date</label>

            <DatePicker
              selected={parseISODate(form.date)}
              onChange={(date) => setForm({ ...form, date: toISODate(date) })}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              showPopperArrow={false}
              className="w-full rounded-full border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              Ngày đã chọn: <span className="font-semibold">{formatDateVN(form.date)}</span>
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
              className="w-full rounded-full border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 cursor-pointer"
            >
              {categories.length === 0 && <option value="">No category found</option>}
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

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
            onClick={onClose}
            className="rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white shadow hover:bg-red-700 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
