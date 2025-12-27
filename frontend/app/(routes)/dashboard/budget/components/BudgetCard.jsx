"use client";

import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { formatVND } from "./utils";

export default function BudgetCard({ budget, onEdit, onDelete, onViewHistory }) {

  // Tỷ lệ đã chi so với ngân sách (0 → 1)
  const usedRatio =
    budget.amount > 0 ? (budget.spent || 0) / budget.amount : 0;

  // Số tiền còn lại (không âm)
  const remaining = Math.max(
    budget.amount - (budget.spent || 0),
    0
  );

  return (
    <div className="mb-4 rounded-2xl border border-slate-200 p-5 shadow-sm">
      
      {/* Header: Tháng + Tổng ngân sách */}
      <div className="flex items-start justify-between">
        <div className="font-semibold">{budget.month}</div>
        <div className="text-indigo-600 font-extrabold">
          {formatVND(budget.amount)}
        </div>
      </div>

      {/* Thông tin chi tiêu */}
      <div className="mt-2 grid grid-cols-2 text-sm font-semibold">
        <div className="text-red-600">
          Spent: {formatVND(budget.spent)}
        </div>
        <div className="text-right text-emerald-600">
          {formatVND(remaining)} Remaining
        </div>
      </div>

      {/* Thanh progress thể hiện % đã sử dụng */}
      <div className="mt-2 h-4 w-full rounded-full bg-slate-200">
        <div
          className="h-4 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400"
          style={{ width: `${Math.min(usedRatio * 100, 100)}%` }}
        />
      </div>

      {/* Footer: % Used + Action buttons */}
      <div className="mt-3 flex items-center justify-between text-slate-500 font-semibold">
        <div>{Math.round(usedRatio * 100)}% Used</div>

        <div className="flex items-center gap-4">
          {/* Xem lịch sử giao dịch */}
          <button
            className="rounded-full p-2 hover:bg-slate-100 cursor-pointer"
            title="Xem lịch sử"
            onClick={onViewHistory}
          >
            <Eye className="h-5 w-5" />
          </button>

          {/* Chỉnh sửa budget */}
          <button
            className="rounded-full p-2 hover:bg-slate-100 cursor-pointer"
            title="Chỉnh sửa"
            onClick={onEdit}
          >
            <Pencil className="h-5 w-5" />
          </button>

          {/* Xoá budget */}
          <button
            className="rounded-full p-2 hover:bg-slate-100 text-red-600 cursor-pointer"
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
