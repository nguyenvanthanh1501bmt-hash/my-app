"use client";

export default function RoleSelector({ value = "all", onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">Role</label>
      <select
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="all">Tất cả</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
    </div>
  );
}
