import React, { useState } from "react";
import { CreateLoan, UpdateLoan } from "./API_setup";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Date -> "YYYY-MM-DD"
const toYMD = (date) => {
  if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const parseToDate = (val) => {
  if (!val) return null;
  const d = val instanceof Date ? val : new Date(val);
  return Number.isNaN(d.getTime()) ? null : d;
};

// ========== CREATE ==========
export function LoanInputForm({ id, onClose, onSubmit }) {
  const [person, setPerson] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("loan");
  const [dueDate, setDueDate] = useState(null);
  const [status, setStatus] = useState("pending");

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = {
        user_id: id,
        person,
        amount: parseFloat(amount),
        due_date: toYMD(dueDate), // YYYY-MM-DD
        type,
        status,
      };

      if (onSubmit) await onSubmit(data);
      else await CreateLoan(data);

      setPerson("");
      setAmount("");
      setType("loan");
      setDueDate(null);
      setStatus("pending");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error creating loan/debt");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <form className="bg-white p-6 rounded-xl w-[400px] flex flex-col gap-4 shadow-lg relative" onSubmit={handleCreate}>
        <h1 className="font-bold text-xl text-center">Create New Loan / Debt</h1>

        <div>
          <label className="font-medium mb-1 block">Person</label>
          <input
            type="text"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="font-medium mb-1 block">Amount (đ)</label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border p-2 rounded pr-10"
              required
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">đ</span>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setType("loan")}
            className={`w-[48%] p-2 rounded-2xl cursor-pointer ${
              type === "loan" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Loan
          </button>
          <button
            type="button"
            onClick={() => setType("debt")}
            className={`w-[48%] p-2 rounded-2xl cursor-pointer ${
              type === "debt" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Debt
          </button>
        </div>

        <div>
          <label className="font-medium mb-1 block">Due Date</label>
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            className="w-full border p-2 rounded"
            showPopperArrow={false}
            required
          />
        </div>

        <div className="flex gap-2 mt-2 justify-between">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-2xl hover:bg-green-400 w-[45%] cursor-pointer">
            Save
          </button>
          <button type="button" onClick={onClose} className="bg-gray-300 text-black p-2 rounded-2xl hover:bg-red-400 w-[45%] cursor-pointer">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ========== UPDATE ==========
export function LoanUpdateForm({ loanid, datachange, onClose, onSubmit }) {
  const [person, setPerson] = useState(datachange.person || "");
  const [amount, setAmount] = useState(datachange.amount || "");
  const [type, setType] = useState(datachange.type ? datachange.type.toLowerCase() : "loan");
  const [dueDate, setDueDate] = useState(parseToDate(datachange.due_date));
  const [status, setStatus] = useState((datachange.status || "pending").toLowerCase());

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const newData = {
        amount: parseFloat(amount),
        person: person.trim(),
        due_date: toYMD(dueDate),
        type,
        status, // vẫn lưu pending/paid (overdue sẽ tự tính khi render)
      };

      if (onSubmit) await onSubmit(newData);
      else await UpdateLoan(loanid, newData);

      onClose();
    } catch (err) {
      console.error(err);
      alert("Error updating loan");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <form className="bg-white p-6 rounded-2xl w-[400px] flex flex-col gap-4 shadow-xl relative" onSubmit={handleUpdate}>
        <h1 className="font-bold text-xl text-center mb-2">Update Loan / Debt</h1>

        <div>
          <label className="font-medium mb-1 block">Person</label>
          <input
            type="text"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="font-medium mb-1 block">Amount (đ)</label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border p-2 rounded pr-10"
              required
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">đ</span>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setType("loan")}
            className={`w-[48%] p-2 rounded-2xl cursor-pointer ${
              type === "loan" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Loan
          </button>
          <button
            type="button"
            onClick={() => setType("debt")}
            className={`w-[48%] p-2 rounded-2xl cursor-pointer ${
              type === "debt" ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Debt
          </button>
        </div>

        <div>
          <label className="font-medium mb-1 block">Due Date</label>
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            className="w-full border p-2 rounded"
            showPopperArrow={false}
            required
          />
        </div>

        <div>
          <label className="font-medium mb-1 block">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 rounded cursor-pointer"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            {/* Nếu muốn test tay "overdue" thì mở dòng dưới */}
            {/* <option value="overdue">Overdue</option> */}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            * Overdue will be calculated automatically based on Due Date.
          </p>
        </div>

        <div className="flex gap-2 mt-2 justify-between">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-2xl hover:bg-green-400 w-[45%] cursor-pointer">
            Save
          </button>
          <button type="button" onClick={onClose} className="bg-gray-300 text-black p-2 rounded-2xl hover:bg-red-400 w-[45%] cursor-pointer">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ========== UPDATE CURRENT (Record Repayment / Borrowing) ==========
export function UpdateCurrentLoan_Debt({ loanid, oldAmount, currentType, onClose, onSubmit }) {
  const [currentAmount, setCurrentAmount] = useState("");
  // mapping logic giữ nguyên: "loan" / "debt"
  // UI label: Repayment / Borrow More
  const [typeSelect, setTypeSelect] = useState("repayment"); // "repayment" | "borrow_more"

  const handleUpdate = async (e) => {
    e.preventDefault();

    const parsedAmount = parseFloat(currentAmount);
    if (!parsedAmount || parsedAmount <= 0) return;

    let newCurrent = Number(oldAmount) || 0;

    const baseType = String(currentType || "").toLowerCase(); // loan/debt

    // repayment => giảm số dư; borrow_more => tăng số dư
    // nhưng với loan/debt gốc, chiều +/- khác nhau như code bạn đã làm
    if (baseType === "loan") {
      // LOAN: người ta nợ mình
      if (typeSelect === "borrow_more") newCurrent += parsedAmount; // mượn thêm => tăng số dư
      if (typeSelect === "repayment") newCurrent -= parsedAmount;  // trả bớt => giảm số dư
    } else {
      // DEBT: mình nợ người ta
      if (typeSelect === "borrow_more") newCurrent += parsedAmount; // mượn thêm => tăng số dư nợ
      if (typeSelect === "repayment") newCurrent -= parsedAmount;  // trả bớt => giảm nợ
    }

    // clamp không cho âm
    if (newCurrent < 0) newCurrent = 0;

    const newStatus = Number(newCurrent) === 0 ? "paid" : "pending";

    const newData = {
      amount: Number(newCurrent.toFixed(2)),
      status: newStatus,
    };

    try {
      await onSubmit(newData);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error updating loan/debt");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <form className="bg-white p-6 rounded-2xl w-[400px] flex flex-col gap-4 shadow-xl relative" onSubmit={handleUpdate}>
        <h1 className="font-bold text-xl text-center mb-1">Record Repayment / Borrowing</h1>
        <p className="text-center text-sm text-gray-500 mb-2">Record the amount repaid or borrowed more to update the balance.</p>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setTypeSelect("repayment")}
            className={`w-[48%] p-2 rounded-2xl transition-colors cursor-pointer ${
              typeSelect === "repayment" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-green-100"
            }`}
          >
            Repayment
          </button>
          <button
            type="button"
            onClick={() => setTypeSelect("borrow_more")}
            className={`w-[48%] p-2 rounded-2xl transition-colors cursor-pointer ${
              typeSelect === "borrow_more" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-blue-100"
            }`}
          >
            Borrow More
          </button>
        </div>

        <div>
          <label className="font-medium mb-1 block">Amount (đ)</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              className="w-full border p-2 rounded pr-10"
              placeholder="Nhập số tiền"
              required
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">đ</span>
          </div>
        </div>

        <div className="flex gap-2 mt-2 justify-between">
          <button
            type="submit"
            disabled={!currentAmount || Number(currentAmount) <= 0}
            className={`w-[45%] p-2 rounded-2xl text-white transition-colors ${
              !currentAmount || Number(currentAmount) <= 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-green-400"
            }`}
          >
            Save
          </button>
          <button type="button" onClick={onClose} className="bg-gray-300 text-black p-2 rounded-2xl hover:bg-red-400 w-[45%]">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
