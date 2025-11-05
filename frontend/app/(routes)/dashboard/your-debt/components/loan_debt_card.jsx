import React from "react";
import { BadgeDollarSign } from "lucide-react";

export default function LoanDebtCard({ title = "", value = 0 }) {
  return (
    <div className="w-[300px] bg-white shadow-lg rounded-2xl p-5 border border-gray-200 flex flex-col items-center justify-center 
                hover:bg-slate-100 hover:scale-105 transition-transform duration-300">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <div className="flex items-center gap-2">
        <BadgeDollarSign className="h-6 w-6 text-blue-500" />
        <span className= {Number(value) >=0 ? "text-green-400" : "text-red-300"}>${value}</span>
      </div>
    </div>
  );
}