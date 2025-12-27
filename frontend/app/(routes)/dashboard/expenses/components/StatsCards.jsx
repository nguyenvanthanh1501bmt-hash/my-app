import { cls, currency, formatSigned } from "./helpers";

export default function StatsCards({ txIncome, txExpense, txNet }) {
  return (
    // Grid 3 card (income / expense / net)
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* ===== Total Income card ===== */}
      <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-xl">
          📈
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="mt-1 text-xl font-bold text-green-600">
            {currency(txIncome)}
          </p>
        </div>
      </div>

      {/* ===== Total Expense card ===== */}
      <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-xl">
          📉
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Expense</p>
          <p className="mt-1 text-xl font-bold text-red-600">
            {currency(txExpense)}
          </p>
        </div>
      </div>

      {/* ===== Net Amount card ===== */}
      <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-xl">
          📊
        </div>
        <div>
          <p className="text-sm text-gray-500">Net Amount</p>

          {/* 
            Đổi màu theo dấu:
            - >0: xanh
            - <0: đỏ
            - =0: xám
          */}
          <p
            className={cls(
              "mt-1 text-xl font-bold",
              txNet > 0
                ? "text-blue-700"
                : txNet < 0
                ? "text-red-600"
                : "text-gray-700"
            )}
          >
            {formatSigned(txNet)}
          </p>
        </div>
      </div>
    </div>
  );
}
