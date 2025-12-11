import { useEffect, useState } from "react";
import { GetSummary } from "./API_setup";

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
          {summary.total_budget?.toLocaleString("vi-VN")}
        </p>
      </div>

      {/* Đã xài */}
      <div className="bg-gray-50 p-5 rounded-xl shadow flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-700">Expense</h3>
        <p className="text-2xl font-bold text-red-600 mt-1">
          {summary.total_spend?.toLocaleString("vi-VN")}
        </p>
      </div>

      {/* Còn lại */}
      <div className="bg-gray-50 p-5 rounded-xl shadow flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-700">Remain</h3>
        <p className="text-2xl font-bold text-green-600 mt-1">
          {summary.current_balance?.toLocaleString("vi-VN")}
        </p>
      </div>

    </div>
  );
}
