import { cls, currency, REPORT_COLORS } from "./helpers";

export default function ReportSection({
  reportTab,
  setReportTab,
  reportData,
  pieGradient,
}) {
  return (
    // Section report (bao gồm toggle + pie + table)
    <section className="mt-8 rounded-3xl bg-white p-5 shadow">
      <h2 className="mb-4 text-xl font-semibold text-blue-700">Report</h2>

      {/* ===== Toggle Income/Expense ===== */}
      <div className="mb-4 flex gap-3">
        <button
          // Chuyển tab report sang income
          onClick={() => setReportTab("income")}
          className={cls(
            "rounded-full px-4 py-2 text-sm font-semibold cursor-pointer",
            reportTab === "income"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          Income
        </button>

        <button
          // Chuyển tab report sang outcome
          onClick={() => setReportTab("outcome")}
          className={cls(
            "rounded-full px-4 py-2 text-sm font-semibold cursor-pointer",
            reportTab === "outcome"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          Expense
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* ===== Left: Pie chart + legend ===== */}
        <div className="flex flex-col items-center rounded-2xl bg-gray-50 p-4">
          {/* Pie chart giả lập bằng CSS conic-gradient từ props pieGradient */}
          <div
            className="mb-4 h-72 w-72 rounded-full border border-blue-400"
            style={{ background: pieGradient }}
          />

          {/* Title phụ theo reportTab */}
          <p className="text-base font-semibold">
            {reportTab === "income"
              ? "Income by categories"
              : "Expense by categories"}
          </p>

          {/* Legend: map reportData -> màu theo REPORT_COLORS */}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {reportData.map((item, idx) => (
              <div
                key={item.category}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                {/* Chấm màu theo index */}
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor:
                      REPORT_COLORS[idx % REPORT_COLORS.length],
                  }}
                />
                <span>{item.category}</span>
              </div>
            ))}

            {/* Empty state */}
            {!reportData.length && (
              <p className="text-sm text-gray-400">No data</p>
            )}
          </div>
        </div>

        {/* ===== Right: Table details ===== */}
        <div className="rounded-2xl bg-gray-50 p-4">
          <h3 className="mb-3 text-lg font-semibold">Details</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                  <th className="px-3 py-2 text-right">Percentage</th>
                </tr>
              </thead>

              <tbody>
                {/* Rows theo reportData */}
                {reportData.map((row) => (
                  <tr key={row.category} className="border-b">
                    <td className="px-3 py-2">{row.category}</td>
                    <td className="px-3 py-2 text-right">
                      {currency(row.amount)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {row.percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}

                {/* Empty state trong bảng */}
                {!reportData.length && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-3 py-4 text-center text-gray-400"
                    >
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
