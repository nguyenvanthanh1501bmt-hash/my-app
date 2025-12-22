import { cls } from "./helpers";

export default function FiltersBar({
  filterType,
  setFilterType,
  search,
  setSearch,
  month,
  setMonth,
  year,
  setYear,
  monthOptions,
  yearOptions,
}) {
  return (
    <div className="mb-6 rounded-3xl bg-blue-50 p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {[
            { key: "all", label: "All" },
            { key: "income", label: "Income" },
            { key: "outcome", label: "Expense" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key)}
              className={cls(
                "rounded-full px-4 py-2 text-sm font-semibold cursor-pointer",
                filterType === tab.key
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full max-w-xs rounded-full border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
          />

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="h-10 rounded-full border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Month</option>
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="h-10 rounded-full border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Year</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
