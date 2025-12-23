"use client";

import { useEffect, useState } from "react";

export default function UpdateForm({ open, onOpenChange, user }) {
  const [role, setRole] = useState(user?.role || "user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Khi user thay đổi, update state role
  useEffect(() => {
    if (user) setRole(user.role);
  }, [user]);

  if (!open || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token không tồn tại");

      const res = await fetch(
        `http://localhost:8000/api/users/${user.id}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role }),
        }
      );

      if (!res.ok) {
        throw new Error("Không thể cập nhật role");
      }

      // Đóng modal sau khi thành công
      onOpenChange(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Đổi role người dùng</h2>

        <div className="mb-3 text-sm text-gray-600">
          User: <b>{user.name}</b> (ID: {user.id})
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-3 py-1 border rounded"
              disabled={loading}
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1 bg-blue-600 text-white rounded disabled:opacity-60"
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
