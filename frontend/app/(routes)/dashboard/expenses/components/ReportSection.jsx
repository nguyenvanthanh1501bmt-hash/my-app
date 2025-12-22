import { cls, currency, REPORT_COLORS } from "./helpers";

export default function ReportSection({
  reportTab,
  setReportTab,
  reportData,
  pieGradient,
}) {
  return (
    <section className="mt-8 rounded-3xl bg-white p-5 shadow">
      <h2 className="mb-4 text-xl font-semibold text-blue-700">Report</h2>

      <div className="mb-4 flex gap-3">
        <button
          onClick={() => setReportTab("income")}
          className={cls(
            "rounded-full px-4 py-2 text-sm font-semibold cursor-pointer",
            reportTab === "income" ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          Income
        </button>
        <button
          onClick={() => setReportTab("outcome")}
          className={cls(
            "rounded-full px-4 py-2 text-sm font-semibold cursor-pointer",
            reportTab === "outcome" ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          Expense
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col items-center rounded-2xl bg-gray-50 p-4">
          <div className="mb-4 h-72 w-72 rounded-full border border-blue-400" style={{ background: pieGradient }} />
          <p className="text-base font-semibold">
            {reportTab === "income" ? "Income by categories" : "Expense by categories"}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {reportData.map((item, idx) => (
              <div key={item.category} className="flex items-center gap-2 text-sm text-gray-700">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: REPORT_COLORS[idx % REPORT_COLORS.length] }}
                />
                <span>{item.category}</span>
              </div>
            ))}
            {!reportData.length && <p className="text-sm text-gray-400">No data</p>}
          </div>
        </div>

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
                {reportData.map((row) => (
                  <tr key={row.category} className="border-b">
                    <td className="px-3 py-2">{row.category}</td>
                    <td className="px-3 py-2 text-right">{currency(row.amount)}</td>
                    <td className="px-3 py-2 text-right">{row.percentage.toFixed(1)}%</td>
                  </tr>
                ))}
                {!reportData.length && (
                  <tr>
                    <td colSpan={3} className="px-3 py-4 text-center text-gray-400">
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
