"use client";

import { useState } from "react";

export default function ConfirmForm({ open, onOpenChange, user }) {
  const [loading, setLoading] = useState(false);

  if (!open || !user) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // --- Xóa user trên DB ---
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found for DB deletion");

      const resDB = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resDB.ok) {
        const errorData = await resDB.json().catch(() => ({}));
        throw new Error(
          `DB deletion failed: ${errorData.detail || resDB.statusText}`
        );
      }

      // --- Xóa user trên Clerk ---
      const resClerk = await fetch("/api/deleteuseronclerk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user.name }), // gửi name thay vì id
    });


      if (!resClerk.ok) {
        const errorData = await resClerk.json().catch(() => ({}));
        throw new Error(
          `Clerk deletion failed: ${errorData.message || resClerk.statusText}`
        );
      }

      onOpenChange(false);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
        <p className="mb-6">
          Are you sure you want to delete user{" "}
          <span className="font-medium">{user.name}</span>?
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            )}
            {loading ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>

        {/* Close X */}
        <button
          onClick={() => onOpenChange(false)}
          disabled={loading}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  );
}
