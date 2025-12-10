"use client";

import { useEffect, useState } from "react";
import { GetRecentTransactions } from "./API_setup";

export default function RecentTransactions({ userId, month, limit = 10 }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !month) return;

    async function fetchData() {
      setLoading(true);
      try {
        const res = await GetRecentTransactions(userId, month, limit);
        setTransactions(res || []);
      } catch (err) {
        console.error("Failed to fetch recent transactions:", err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId, month, limit]);

  if (loading) return <p>Loading recent transactions...</p>;
  if (!transactions.length) return <p>No transactions for this month.</p>;

  const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Category</th>
              <th className="px-3 py-2 text-left">Note</th>
              <th className="px-3 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, idx) => {
              const isOutcome = t.type === "outcome";
              const amount = isOutcome ? -Math.abs(t.amount) : Math.abs(t.amount);

              return (
                <tr key={idx} className="border-b">
                  <td className="px-3 py-2">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">{t.category || "-"}</td>
                  <td className="px-3 py-2">{t.note || "-"}</td>
                  <td
                    className={`px-3 py-2 text-right font-medium ${
                      isOutcome ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {formatCurrency(amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
