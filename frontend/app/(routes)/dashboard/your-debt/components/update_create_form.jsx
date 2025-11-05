import React, { useState } from "react";
import { CreateLoan, UpdateLoan } from "./API_setup"; // API backend

// ========== CREATE FORM ==========
export function LoanInputForm({ id, onClose, onSubmit }) {
  const [person, setPerson] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("loan");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending");

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = {
        user_id: id,
        person,
        amount: parseFloat(amount),
        due_date: dueDate,
        type,
        status,
      };

      if (onSubmit) await onSubmit(data);
      else await CreateLoan(data);

      setPerson("");
      setAmount("");
      setType("loan");
      setDueDate("");
      setStatus("pending");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error creating loan/debt"); 
    }
  }; 

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <form
        className="bg-white p-6 rounded-xl w-[400px] flex flex-col gap-4 shadow-lg relative"
        onSubmit={handleCreate}
      >
        <h1 className="font-bold text-xl text-center">Create New Loan / Debt</h1>

        {/* Person */}
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

        {/* Amount */}
        <div>
          <label className="font-medium mb-1 block">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Type buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setType("loan")}
            className={`w-[48%] p-2 rounded-2xl cursor-pointer ${
              type === "loan"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Loan
          </button>
          <button
            type="button"
            onClick={() => setType("debt")}
            className={`w-[48%] p-2 rounded-2xl cursor-pointer ${
              type === "debt"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Debt
          </button>
        </div>

        {/* Due Date */}
        <div>
          <label className="font-medium mb-1 block">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-2 justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-2xl hover:bg-green-400 w-[45%] cursor-pointer"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-black p-2 rounded-2xl hover:bg-red-400 w-[45%] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ========== UPDATE FORM ==========
export function LoanUpdateForm({ loanid, datachange, onClose, onSubmit }) {
  const [person, setPerson] = useState(datachange.person || "");
  const [amount, setAmount] = useState(datachange.amount || "");
  const [type, setType] = useState(
    datachange.type ? datachange.type.toLowerCase() : "loan"
  );
  const [dueDate, setDueDate] = useState(datachange.due_date || "");
  const [status, setStatus] = useState(datachange.status || "pending");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const newData = {
        amount: parseFloat(amount),
        person: person.trim(),
        due_date: dueDate,
        type,
        status,
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
      <form
        className="bg-white p-6 rounded-2xl w-[400px] flex flex-col gap-4 shadow-xl relative"
        onSubmit={handleUpdate}
      >
        <h1 className="font-bold text-xl text-center mb-2">
          Update Loan / Debt
        </h1>

        {/* Person */}
        <div>
          <label className="font-medium mb-1 block">Person</label>
          <input
            type="text"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Tên người cho vay hoặc người nợ"
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label className="font-medium mb-1 block">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Nhập số tiền"
            required
          />
        </div>

        {/* Type Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setType("loan")}
            className={`w-[48%] p-2 rounded-2xl hover:bg-green-300 transition-colors cursor-pointer ${
              type === "loan"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Loan
          </button>
          <button
            type="button"
            onClick={() => setType("debt")}
            className={`w-[48%] p-2 rounded-2xl transition-colors hover:bg-red-400 cursor-pointer ${
              type === "debt"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Debt
          </button>
        </div>

        {/* Due Date */}
        <div>
          <label className="font-medium mb-1 block">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="font-medium mb-1 block">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 rounded cursor-pointer"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-2 justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-2xl hover:bg-green-400 w-[45%] cursor-pointer"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-black p-2 rounded-2xl hover:bg-red-400 w-[45%] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export function UpdateCurrentLoan_Debt({ loanid, oldAmount, currentType, currentstatus , onClose, onSubmit }) {
  const [currentAmount, setCurrentAmount] = useState("");
  const [typeSelect, setTypeSelect] = useState("loan"); // "loan" hoặc "debt"

  const handleUpdate = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(currentAmount);
    if (!parsedAmount || parsedAmount <= 0) return;

    // Tính toán mới
    // const newCurrent =
    //   typeSelect.toLowerCase() === "loan"
    //     ? Number(oldAmount) + parsedAmount
    //     : Number(oldAmount) - parsedAmount;
    //   typeSelect.toLowerCase() === "debt"
    //     ? Number(oldAmount) - parsedAmount
    //     : Number(oldAmount) + parsedAmount;

    let newCurrent = Number(oldAmount);
    if(currentType.toLowerCase() === 'loan'){
      if (typeSelect.toLowerCase() === "loan") {
        newCurrent += parsedAmount; 
      } else if (typeSelect.toLowerCase() === "debt") {
        newCurrent -= parsedAmount; 
      }
    }
    else {
      if (typeSelect.toLowerCase() === "loan") {
        newCurrent -= parsedAmount; 
      } else if (typeSelect.toLowerCase() === "debt") {
        newCurrent += parsedAmount; 
      }
    }
    const newStatus = Number(newCurrent) === 0 ? "paid" : "pending";

    const newData = {
      amount: Number(newCurrent.toFixed(2)), // backend loan dùng 'amount'
      status: newStatus
    };

    try {
      await onSubmit(newData); // gọi handleSubmit ở UpdateCurrentLoan
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error updating loan/debt");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <form
        className="bg-white p-6 rounded-2xl w-[400px] flex flex-col gap-4 shadow-xl relative"
        onSubmit={handleUpdate}
      >
        <h1 className="font-bold text-xl text-center mb-2">
          Update Loan Debt in/out
        </h1>

        {/* Type Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setTypeSelect("loan")}
            className={`w-[48%] p-2 rounded-2xl transition-colors cursor-pointer ${
              typeSelect === "loan"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-400"
            }`}
          >
            Loan
          </button>
          <button
            type="button"
            onClick={() => setTypeSelect("debt")}
            className={`w-[48%] p-2 rounded-2xl transition-colors cursor-pointer ${
              typeSelect === "debt"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-red-400"
            }`}
          >
            Debt
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="font-medium mb-1 block">Amount</label>
          <input
            type="number"
            min="0"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Nhập số tiền"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-2 justify-between">
          <button
            type="submit"
            disabled={!currentAmount || Number(currentAmount) <= 0}
            className={`w-[45%] p-2 rounded-2xl text-white transition-colors ${
              !currentAmount || Number(currentAmount) <= 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-green-400"
            }`}
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-black p-2 rounded-2xl hover:bg-red-400 w-[45%]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}