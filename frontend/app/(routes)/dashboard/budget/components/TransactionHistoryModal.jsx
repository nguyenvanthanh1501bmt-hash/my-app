"use client";

import React from "react";
import { CATEGORY_META } from "./constants";
import { formatVND } from "./utils";

export default function TransactionHistoryModal({
  open,
  month,
  items,
  onClose,
}) {
  if (!open) return null;

  // format date dd/mm/yyyy
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 cursor-pointer"
        onClick={onClose}
      />

      <div className="relative z-10 w-[600px] max-w-[92vw] rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">
          Transaction history – {month}
        </h2>

        {items.length === 0 ? (
          <p className="text-sm text-slate-500">
            Không có giao dịch chi tiêu nào trong tháng này.
          </p>
        ) : (
          <ul className="max-h-96 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-200">
            {items.map((tx, idx) => {
              const meta = CATEGORY_META[tx.category_id] || CATEGORY_META[1];

              return (
                <li
                  key={tx.id}
                  className={`flex items-center justify-between px-4 py-3 ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-100"
                  }`}
                >
                  {/* LEFT */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 grid h-9 w-9 place-items-center rounded-full ${meta.color}`}
                    >
                      <span className="text-lg">{meta.icon}</span>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">
                        {formatDate(tx.date)}
                      </div>
                      <div className="text-sm font-semibold text-slate-800">
                        {meta.name}
                      </div>
                      <div className="text-sm text-slate-600">
                        {tx.note || "(Không có ghi chú)"}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right text-sm font-bold text-red-600">
                    - {formatVND(tx.amount)}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="inline-flex items-center rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
