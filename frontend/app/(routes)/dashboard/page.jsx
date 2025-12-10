'use client'

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/components/ui/button";
import SummarySection from "./components/SumarySection"
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
  const month = getCurrentMonth(); // tháng hiện tại

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Dashboard Page</h1>

      <SummarySection userId={userId} month={month} />
      <IncomeOutcomeChart userId={userId} month={month} className="mt-5" />
      <CategoryExpensePie userId={userId} month={month} className="mt-10" />
      <RecentTransactions userId={userId} month={month} className="mt-5" />
    </div>
  );
}
