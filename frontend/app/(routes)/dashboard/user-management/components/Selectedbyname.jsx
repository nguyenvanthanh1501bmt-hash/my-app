"use client";

import { Search } from "lucide-react";

export default function UsernameInput({ value = "", onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">User name</label>
      <div className="relative">
        <input
          type="text"
          placeholder="Search by username..."
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className="border rounded px-8 py-1 w-full" // chừa chỗ icon bên trái
        />
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      </div>
    </div>
  );
}
