"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { GetIncomeOutcome } from "./API_setup";
import { useUserInfo } from "./necessary_info";

// Hàm lấy tháng hiện tại dạng "YYYY-MM"
function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function IncomeOutcomeChart() {
  const { id: userId } = useUserInfo();
  const [chartData, setChartData] = useState([]);
  const [mode, setMode] = useState("monthly"); // mặc định monthly
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      console.log("IncomeOutcomeChart: userId not ready yet");
      return;
    }

    async function load() {
      setLoading(true);
      try {
        console.log("Fetching data for:", { userId, mode, month: getCurrentMonth() });
        const res = await GetIncomeOutcome(userId, mode, getCurrentMonth());

        // Debug xem dữ liệu backend trả về có đúng format không
        if (!Array.isArray(res)) {
          console.warn("API trả về không phải array:", res);
          setChartData([]);
        } else if (res.length === 0) {
          console.info("API trả về array rỗng");
          setChartData([]);
        } else {
          console.log("IncomeOutcome API res:", res);
          // Chuyển res sang định dạng luôn có income/outcome để chart vẽ được
          const normalized = res.map(item => ({
            label: item.label || item.date || "N/A",
            income: item.income || 0,
            outcome: item.outcome || 0,
          }));
          setChartData(normalized);
        }
      } catch (err) {
        console.error("Load income-outcome error:", err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [userId, mode]);

  if (!userId || loading) {
    return (
      <div className="w-full h-80 p-4 flex items-center justify-center text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full h-80 p-4 flex items-center justify-center text-gray-500">
        Không có dữ liệu để hiển thị
      </div>
    );
  }

  return (
    <div className="w-full h-80 p-4">
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${
            mode === "weekly" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("weekly")}
        >
          Weekly
        </button>
        <button
          className={`px-3 py-1 rounded ${
            mode === "monthly" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("monthly")}
        >
          Monthly
        </button>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#4ade80" name="Thu nhập" />
          <Bar dataKey="outcome" fill="#f87171" name="Chi tiêu" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
