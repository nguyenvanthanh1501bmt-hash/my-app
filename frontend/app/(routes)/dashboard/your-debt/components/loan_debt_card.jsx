import React from "react";
import { HandCoins, ReceiptText, Wallet } from "lucide-react";

// Format tiền VND: 600000 -> 600.000đ
const formatVND = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0đ";
  return `${new Intl.NumberFormat("vi-VN").format(n)}đ`;
};

export default function LoanDebtCard({ title = "", value = 0 }) {
  // chọn icon theo title
  const pickIcon = () => {
    const t = String(title).toLowerCase();
    if (t.includes("total loan")) return <HandCoins className="h-8 w-8 text-blue-600" />;
    if (t.includes("total debt")) return <ReceiptText className="h-8 w-8 text-blue-600" />;
    return <Wallet className="h-8 w-8 text-blue-600" />;
  };

  // màu tiền
  const t = String(title).toLowerCase();
  const isDebtCard = t.includes("total debt");
  const isNetCard = t.includes("net");
  const num = Number(value) || 0;

  const moneyClass =
    isDebtCard ? "text-red-400" : isNetCard ? (num >= 0 ? "text-green-500" : "text-red-400") : "text-green-500";

  return (
    <div className="w-[300px] bg-white shadow-lg rounded-2xl p-6 border border-gray-200 flex flex-col items-center justify-center
                    hover:bg-slate-100 hover:scale-105 transition-transform duration-300">
      <h3 className="text-gray-700 text-xl font-extrabold mb-3">{title}</h3>

      <div className="flex items-center gap-3">
        {pickIcon()}
        <span className={`text-2xl font-extrabold ${moneyClass}`}>
          {formatVND(value)}
        </span>
      </div>
    </div>
  );
}
