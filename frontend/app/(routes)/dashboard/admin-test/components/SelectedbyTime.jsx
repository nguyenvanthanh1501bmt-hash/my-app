"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";

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

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => now.getFullYear() - i);

  return (
    <div className="flex items-end gap-4">
      {/* Month */}
      <div className="flex flex-col relative">
        <label className="text-sm font-medium">Month</label>
        <div className="relative">
          <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          <select
            value={month}
            onChange={e => {
              const m = Number(e.target.value);
              setMonth(m);
              emit(m, year);
            }}
            className="appearance-none border border-gray-300 rounded-md px-6 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition text-sm"
          >
            {months.map(m => (
              <option key={m} value={m}>
                Month {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Year */}
      <div className="flex flex-col relative">
        <label className="text-sm font-medium">Year</label>
        <div className="relative">
          <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          <select
            value={year}
            onChange={e => {
              const y = Number(e.target.value);
              setYear(y);
              emit(month, y);
            }}
            className="appearance-none border border-gray-300 rounded-md px-6 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition text-sm"
          >
            {years.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
