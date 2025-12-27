import { currency } from "./helpers";

export default function SummaryCards({ currentBalance, totalIncome, totalExpense }) {
  return (
    // 3 card: balance / income / expense
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* ===== Current balance ===== */}
      <div className="rounded-3xl bg-blue-50 p-5 text-center shadow-sm">
        <p className="text-sm font-semibold text-blue-700">Current Balance</p>
        <p className="mt-2 text-2xl font-extrabold text-blue-800">
          {currency(currentBalance)}
        </p>
      </div>

      {/* ===== Income ===== */}
      <div className="rounded-3xl bg-green-50 p-5 text-center shadow-sm">
        <p className="text-sm font-semibold text-green-700">Income</p>
        <p className="mt-2 text-2xl font-extrabold text-green-700">
          {currency(totalIncome)}
        </p>
      </div>

      {/* ===== Expense ===== */}
      <div className="rounded-3xl bg-red-50 p-5 text-center shadow-sm">
        <p className="text-sm font-semibold text-red-700">Expense</p>
        <p className="mt-2 text-2xl font-extrabold text-red-700">
          {currency(totalExpense)}
        </p>
      </div>
    </div>
  );
}
