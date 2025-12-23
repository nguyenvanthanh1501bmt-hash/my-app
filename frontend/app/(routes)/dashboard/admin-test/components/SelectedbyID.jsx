"use client";

export default function UserIdInput({ value = "", onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">User ID</label>
      <input
        type="number"
        placeholder="Nhập ID..."
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="border rounded px-2 py-1"
      />
    </div>
  );
}
