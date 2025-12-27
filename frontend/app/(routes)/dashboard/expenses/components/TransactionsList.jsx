import { cls, currency, formatDateVN } from "./helpers";

export default function TransactionsList({
  filteredTx,
  showAll,
  setShowAll,
  catMap,
  deleteTransaction,
}) {
  return (
    // Container list
    <div className="rounded-2xl bg-white p-4 shadow">
      <h3 className="mb-3 text-lg font-semibold text-blue-700">
        All Transaction
      </h3>

      <ul>
        {/* Nếu showAll=false thì chỉ show 5 item đầu */}
        {(showAll ? filteredTx : filteredTx.slice(0, 5)).map((t) => {
          // Xác định giao dịch thu/chi để đổi màu & icon
          const isIncome = t.type === "income";

          // Lookup tên danh mục từ catMap
          const catName = catMap[t.category_id] || "Uncategorized";

          // Format ngày dd/mm/yyyy
          const date = formatDateVN(t.date);

          return (
            <li key={t.id} className="mb-3 last:mb-0">
              {/* Row item: đổi màu nền theo type */}
              <div
                className={cls(
                  "flex items-center justify-between rounded-3xl px-5 py-4 text-white shadow-md",
                  isIncome ? "bg-green-700" : "bg-red-800"
                )}
              >
                {/* ===== Left: icon + date + note ===== */}
                <div className="flex items-start gap-3">
                  {/* Icon mũi tên: ↑ thu | ↓ chi */}
                  <div
                    className={cls(
                      "mt-1 grid h-8 w-8 place-items-center rounded-full border-2",
                      isIncome
                        ? "border-green-200 bg-green-500"
                        : "border-red-200 bg-red-500"
                    )}
                  >
                    {isIncome ? "↑" : "↓"}
                  </div>

                  {/* Thông tin cơ bản: ngày + note */}
                  <div>
                    <p className="text-sm font-semibold opacity-80">{date}</p>
                    <p className="text-base font-semibold">
                      {t.note || "(no note)"}
                    </p>
                  </div>
                </div>

                {/* ===== Right: category tag + delete + amount ===== */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {/* Tag category */}
                    <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                      {catName}
                    </span>

                    {/* Nút delete transaction */}
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="grid h-7 w-7 place-items-center rounded-full bg-white/20 text-xs hover:bg-white/30 cursor-pointer"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Amount: có dấu + hoặc - theo type */}
                  <p
                    className={cls(
                      "text-lg font-bold",
                      isIncome ? "text-green-200" : "text-red-200"
                    )}
                  >
                    {isIncome ? "+" : "-"} {currency(t.amount)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Button xem thêm / thu gọn khi list > 5 */}
      {filteredTx.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll((s) => !s)}
            className="rounded-full border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 cursor-pointer"
          >
            {showAll ? "See less" : "See all"}
          </button>
        </div>
      )}
    </div>
  );
}
