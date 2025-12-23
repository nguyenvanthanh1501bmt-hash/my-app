import { useEffect, useState } from "react";
import { GetSummary } from "./API_setup";

const formatVND = (value) => {
  if (value === null || value === undefined || value === "") return "0đ";
  const num = Number(value); // ép cả "5000000.00" -> 5000000
  if (Number.isNaN(num)) return "0đ";
  return num.toLocaleString("vi-VN") + "đ";
};

export default function SummarySection({ userId, month }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!userId || !month) return;

    async function fetchData() {
      try {
        const data = await GetSummary(userId, month);
        setSummary(data);
      } catch (err) {
        console.error("Load summary error:", err);
      }
    }

    fetchData();
  }, [userId, month]);

  if (!summary) {
    return <p className="text-center text-gray-500">Đang tải...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Budget */}
      <div className="bg-gray-50 p-5 rounded-xl shadow flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-700">Budget</h3>
        <p className="text-2xl font-bold text-blue-600 mt-1">
          {formatVND(summary.total_budget)}
        </p>
      </div>

      {/* Expense */}
      <div className="bg-gray-50 p-5 rounded-xl shadow flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-700">Expense</h3>
        <p className="text-2xl font-bold text-red-600 mt-1">
          {formatVND(summary.total_spend)}
        </p>
      </div>

      {/* Remain */}
      <div className="bg-gray-50 p-5 rounded-xl shadow flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-700">Remain</h3>
        <p className="text-2xl font-bold text-green-600 mt-1">
          {formatVND(summary.current_balance)}
        </p>
      </div>
    </div>
  );
}
