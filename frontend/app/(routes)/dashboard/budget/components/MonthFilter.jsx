"use client";

import React from "react";
import { Calendar } from "lucide-react";

/**
 * Bộ lọc chọn tháng
 *
 * Props:
 * - value: giá trị tháng (YYYY-MM)
 * - onChange: callback khi đổi tháng
 */
export default function MonthFilter({ value, onChange }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <label className="text-sm text-slate-600">Month</label>

      {/* Input type=month ẩn, dùng icon thay thế */}
      <div className="relative">
        <input
          type="month"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 appearance-none border rounded-lg opacity-0 absolute inset-0"
        />
        <div className="h-10 w-10 flex items-center justify-center border rounded-lg bg-white">
          <Calendar className="h-5 w-5 text-slate-600" />
        </div>
      </div>
    </div>
  );
}
