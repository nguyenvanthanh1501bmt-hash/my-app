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
    // Wrapper modal dùng chung: tự xử lý overlay + title + close
    <Modal open={open} onClose={onClose} title="Create New Transaction">
      <div className="space-y-5">
        {/* ===== Amount input ===== */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Amount (VND)
          </label>

          {/* Input số tiền (VND) */}
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            // Update form.amount mỗi khi user nhập
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full rounded-full border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* ===== Type select (income/outcome) ===== */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Type
          </label>

          {/* Dropdown chọn loại giao dịch */}
          <select
            value={form.type}
            // Update form.type ("income" hoặc "outcome")
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full rounded-full border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="income">Income</option>
            <option value="outcome">Expense</option>
          </select>
        </div>

        {/* ===== Note/Description input ===== */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            Description
          </label>

          {/* Input mô tả / ghi chú transaction */}
          <input
            type="text"
            placeholder="Transaction description"
            value={form.note}
            // Update form.note mỗi khi user nhập
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full rounded-full border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* ===== 2 columns: Date + Category ===== */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* ---- Date picker ---- */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Date
            </label>

            {/* 
              DatePicker cần Date object:
              - form.date đang là string "YYYY-MM-DD"
              - parseISODate(...) chuyển string -> Date
            */}
            <DatePicker
              selected={parseISODate(form.date)}
              /*
                Khi chọn ngày:
                - DatePicker trả Date object
                - toISODate(...) chuyển Date -> "YYYY-MM-DD"
                - Lưu vào form.date để backend dễ xử lý
              */
              onChange={(date) => setForm({ ...form, date: toISODate(date) })}
              // Hiển thị format dd/MM/yyyy trên UI
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              showPopperArrow={false}
              className="w-full rounded-full border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />

            {/* Preview ngày đã chọn theo format VN (dd/mm/yyyy) */}
            <p className="mt-1 text-xs text-gray-500">
              Ngày đã chọn:{" "}
              <span className="font-semibold">{formatDateVN(form.date)}</span>
            </p>
          </div>

          {/* ---- Category select ---- */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Category
            </label>

            {/* Dropdown category_id (ép Number để khớp backend) */}
            <select
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: Number(e.target.value) })
              }
              className="w-full rounded-full border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 cursor-pointer"
            >
              {/* Empty state nếu không có category */}
              {categories.length === 0 && (
                <option value="">No category found</option>
              )}

              {/* Render danh sách category */}
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ===== Actions ===== */}
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          {/* Submit tạo transaction */}
          <button
            onClick={createTransaction}
            // Disable khi đang loading để tránh bấm nhiều lần
            disabled={loading}
            className={cls(
              "rounded-2xl px-5 py-3 font-semibold text-white shadow cursor-pointer",
              // Đổi màu theo trạng thái loading
              loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {/* Đổi text theo trạng thái */}
            {loading ? "Creating..." : "Create Transaction"}
          </button>

          {/* Cancel / đóng modal */}
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
