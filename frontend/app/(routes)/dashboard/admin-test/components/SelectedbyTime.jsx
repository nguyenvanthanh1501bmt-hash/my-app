"use client";

import { useState } from "react";

export default function MonthYearPicker({ onChange }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1); // 1–12
  const [year, setYear] = useState(now.getFullYear());

  const emit = (m, y) => {
    onChange?.({
      month: m,
      year: y,
      value: `${y}-${String(m).padStart(2, "0")}`, // YYYY-MM
    });
  };

  return (
    <div className="flex items-end gap-4">
      {/* Month */}
      <div className="flex flex-col">
        <label className="text-sm font-medium">Tháng</label>
        <select
          value={month}
          onChange={e => {
            const m = Number(e.target.value);
            setMonth(m);
            emit(m, year);
          }}
          className="border rounded px-2 py-1"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>
              Tháng {m}
            </option>
          ))}
        </select>
      </div>

      {/* Year */}
      <div className="flex flex-col">
        <label className="text-sm font-medium">Năm</label>
        <select
          value={year}
          onChange={e => {
            const y = Number(e.target.value);
            setYear(y);
            emit(month, y);
          }}
          className="border rounded px-2 py-1"
        >
          {Array.from({ length: 10 }, (_, i) => now.getFullYear() - i).map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
