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
    // Container của filter bar
    <div className="mb-6 rounded-3xl bg-blue-50 p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* ===== Tabs filter theo type ===== */}
        <div className="flex gap-2">
          {[
            { key: "all", label: "All" },
            { key: "income", label: "Income" },
            { key: "outcome", label: "Expense" },
          ].map((tab) => (
            <button
              key={tab.key}
              // Click tab -> cập nhật filterType
              onClick={() => setFilterType(tab.key)}
              className={cls(
                "rounded-full px-4 py-2 text-sm font-semibold cursor-pointer",
                // Active tab style
                filterType === tab.key
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== Search + Month + Year ===== */}
        <div className="flex flex-1 items-center justify-end gap-3">
          {/* Search input theo keyword */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            // Update keyword search
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full max-w-xs rounded-full border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
          />

          {/* Dropdown filter theo month */}
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="h-10 rounded-full border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 cursor-pointer"
          >
            {/* Default option (không filter theo month) */}
            <option value="all">Month</option>

            {/* Render month options */}
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Dropdown filter theo year */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="h-10 rounded-full border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 cursor-pointer"
          >
            {/* Default option (không filter theo year) */}
            <option value="all">Year</option>

            {/* Render year options */}
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
