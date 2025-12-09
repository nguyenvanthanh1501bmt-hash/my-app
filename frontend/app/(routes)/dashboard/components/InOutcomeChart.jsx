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

export default function IncomeOutcomeChart({ userId, month }) {
  const [chartData, setChartData] = useState([]);
  const [mode, setMode] = useState("monthly"); // mặc định monthly
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !month) {
      console.log("IncomeOutcomeChart: userId hoặc month chưa có");
      return;
    }

    async function load() {
      setLoading(true);
      try {
        console.log("Fetching data for:", { userId, mode, month });
        const res = await GetIncomeOutcome(userId, mode, month);

        if (!Array.isArray(res) || res.length === 0) {
          console.info("API trả về rỗng hoặc không phải array");
          setChartData([]);
        } else {
          const normalized = res.map(item => ({
            label: item.label || item.date || "N/A",
            income: Number(item.income) || 0,
            outcome: Number(item.outcome) || 0,
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
  }, [userId, month, mode]);

  if (loading) {
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
