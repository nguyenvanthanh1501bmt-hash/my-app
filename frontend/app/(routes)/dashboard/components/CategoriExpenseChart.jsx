"use client";

import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { GetCategoryExpense } from "./API_setup";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryExpensePie({ userId, month }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !month) return;

    async function fetchData() {
      setLoading(true);
      try {
        const res = await GetCategoryExpense(userId, month);

        if (!res || res.length === 0) {
          setChartData(null);
          return;
        }

        const colors = [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#8A2BE2",
          "#00FF7F",
          "#FFA500",
          "#FF4500",
          "#1E90FF",
          "#FFD700",
          "#32CD32",
        ];

        setChartData({
          labels: res.map(item => item.category),
          datasets: [
            {
              data: res.map(item => Number(item.total)),
              backgroundColor: colors.slice(0, res.length),
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error("Failed to fetch category expense:", err);
        setChartData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId, month]);

  if (loading) return <p>Loading chart...</p>;
  if (!chartData) return <p>No expense data for this month.</p>;

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <Pie data={chartData} />
    </div>
  );
}
