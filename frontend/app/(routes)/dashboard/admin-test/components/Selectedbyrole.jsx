"use client";

import { User, ChevronDown } from "lucide-react";

export default function RoleSelector({ value = "all", onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">Role</label>
      <div className="relative flex items-center">
        <User className="absolute left-2 text-gray-400 pointer-events-none" size={14} />
        <select
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className="appearance-none w-full border border-gray-300 rounded-md px-6 py-1.5 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition text-sm"
        >
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <ChevronDown className="absolute right-2 text-gray-400 pointer-events-none" size={14} />
      </div>
    </div>
  );
}
