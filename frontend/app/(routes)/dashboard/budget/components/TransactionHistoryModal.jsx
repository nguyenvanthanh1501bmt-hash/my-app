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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 cursor-pointer" onClick={onClose} />
      <div className="relative z-10 w-[560px] max-w-[92vw] rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">Transaction history – {month}</h2>

        {items.length === 0 ? (
          <p className="text-sm text-slate-500">
            Không có giao dịch chi tiêu nào trong tháng này.
          </p>
        ) : (
          <ul className="max-h-80 space-y-3 overflow-y-auto">
            {items.map((tx) => {
              const meta = CATEGORY_META[tx.category_id] || CATEGORY_META[1];
              const dateStr = String(tx.date).slice(0, 10);

              return (
                <li
                  key={tx.id}
                  className="flex items-center justify-between rounded-3xl bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-3 text-sm text-white shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 grid h-9 w-9 place-items-center rounded-full ${meta.color}`}>
                      <span className="text-lg">{meta.icon}</span>
                    </div>

                    <div>
                      <div className="text-[11px] font-medium opacity-70">{dateStr}</div>
                      <div className="text-sm font-semibold">{meta.name}</div>
                      <div className="text-sm opacity-85">{tx.note || "(Không có ghi chú)"}</div>
                    </div>
                  </div>

                  {/* ✅ tiền: trắng + 500.000đ */}
                  <div className="text-right text-sm font-extrabold text-white">
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
