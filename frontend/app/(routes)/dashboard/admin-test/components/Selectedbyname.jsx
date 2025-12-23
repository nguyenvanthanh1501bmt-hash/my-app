"use client";

export default function UsernameInput({ value = "", onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">User name</label>
      <input
        type="text"
        placeholder="Nhập tên người dùng..."
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="border rounded px-2 py-1"
      />
    </div>
  );
}
