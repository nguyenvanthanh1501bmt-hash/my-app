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
  const [mode, setMode] = useState("monthly"); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !month) return;

    async function load() {
      setLoading(true);
      try {
        const res = await GetIncomeOutcome(userId, month, mode);

        if (!Array.isArray(res)) {
          setChartData([]);
        } else {
          const normalized = res.map((item) => ({
            label: item.label ?? "N/A",
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
        Loading...
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full h-80 p-4 flex items-center justify-center text-gray-500">
        No data
      </div>
    );
  }

  return (
    <div className="w-full h-80 p-4">
      <div className="flex gap-2 mb-4 justify-center">
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

      {/* FIXED: height cố định */}
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#4ade80" name="Income" />
          <Bar dataKey="outcome" fill="#f87171" name="Expense" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
