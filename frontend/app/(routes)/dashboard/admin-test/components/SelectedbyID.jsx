"use client";

import { Search } from "lucide-react";

export default function UserIdInput({ value = "", onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">User ID</label>
      <div className="relative">
        <input
          type="number"
          placeholder="Search by user ID..."
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className="border rounded px-8 py-1 w-full" // px-8 để chừa chỗ icon
        />
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      </div>
    </div>
  );
}
