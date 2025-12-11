'use client'

import React from "react";
import SummarySection from "./components/SumarySection";
import IncomeOutcomeChart from "./components/InOutcomeChart";
import CategoryExpensePie from "./components/CategoriExpenseChart";
import RecentTransactions from "./components/RecenTrantraction";
import { useUserInfo } from "./components/necessary_info";

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function DashboardPage() {
  const { id: userId } = useUserInfo();
  const month = getCurrentMonth();

  return (
    <div className="p-6 space-y-8">

      {/* Summary */}
      <div className="bg-white rounded-xl shadow p-5">
        <SummarySection userId={userId} month={month} />
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">

        {/* LEFT 60% */}
        <div className="lg:col-span-6 space-y-8">

          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-3 text-center">Income Vs Outcome</h2>
            <IncomeOutcomeChart userId={userId} month={month} />
          </div>

          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-3 text-center">Category Expense</h2>
            <CategoryExpensePie userId={userId} month={month} />
          </div>
        </div>

        {/* RIGHT 40% */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow p-5 h-fit flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-3 text-center">Recent Transactions</h2>
          <RecentTransactions userId={userId} month={month} />
        </div>

      </div>
    </div>
  );
}
