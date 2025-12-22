import React, { useState } from "react";
import { useLoanData } from "./Loan_list";
import { useUserInfo } from "../../components/necessary_info";
import { Pencil, Trash2, Plus, CircleUser, CalendarDays, BadgeDollarSign } from "lucide-react";
import { Button } from "../../../../../components/ui/components/ui/button";
import { DeleteLoan, CreateLoan, UpdateLoan } from "./API_setup";
import { LoanInputForm, LoanUpdateForm, UpdateCurrentLoan_Debt } from "./update_create_form";
import LoanDebtCard from "./loan_debt_card";

// ===== helpers =====
const formatVND = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0đ";
  return `${new Intl.NumberFormat("vi-VN").format(n)}đ`;
};

const formatDMY = (dateVal) => {
  if (!dateVal) return "";
  const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
  if (Number.isNaN(d.getTime())) return String(dateVal);
  return d.toLocaleDateString("vi-VN"); // dd/mm/yyyy
};

// ✅ AUTO STATUS: Paid must override Overdue
const getAutoStatus = (amount, dueDate, storedStatus) => {
  const status = String(storedStatus || "").toLowerCase();
  if (status === "paid") return "paid"; // ✅ Paid always wins

  const amt = Number(amount) || 0;
  if (amt === 0) return "paid"; // amount = 0 => paid

  if (!dueDate) return "pending";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) return "pending";
  due.setHours(0, 0, 0, 0);

  // qua ngày hôm sau => overdue
  if (today > due) return "overdue";
  return "pending";
};

// ✅ Overdue đổi sang vàng
const STATUS_UI = {
  paid: {
    text: "Paid",
    className: "bg-green-100 text-green-600 border border-green-400",
  },
  pending: {
    text: "Pending",
    className: "bg-blue-100 text-blue-600 border border-blue-300",
  },
  overdue: {
    text: "Overdue",
    className: "bg-yellow-100 text-yellow-700 border border-yellow-400",
  },
};

export default function LoadingDisplay() {
  const { data, setData, error, total_loan, total_debt } = useLoanData();
  const { id: userId } = useUserInfo();

  const [showForm, setShowForm] = useState(false);
  const [updateModal, setUpdateModal] = useState({ show: false, item: null });
  const [showFormUpdateCurrent, setShowFormUpdateCurrent] = useState({ show: false, item: null });

  const handleDelete = async (id) => {
    await DeleteLoan(id);
    setData((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCreate = async (payload) => {
    const res = await CreateLoan({
      ...payload,
      status: (payload.status || "pending").toLowerCase(),
    });
    setData((prev) => [...prev, res]);
  };

  const handleUpdate = async (id, change) => {
    const res = await UpdateLoan(id, {
      ...change,
      status: change.status ? change.status.toLowerCase() : undefined,
    });
    setData((prev) => prev.map((i) => (i.id === id ? res : i)));
  };

  if (!data) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const net = Number(total_loan || 0) - Number(total_debt || 0);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 ml-[15%]">Your Loans & Debts</h2>

      <div className="flex justify-center flex-row items-center gap-15">
        <LoanDebtCard title="Total Loan" value={total_loan} />
        <LoanDebtCard title="Total Debt" value={total_debt} />
        <LoanDebtCard title="Net Currency" value={net} />
      </div>

      <div className="flex justify-center flex-col items-center">
        {data.map((item) => (
          <LoanFormDisplay
            key={item.id}
            {...item}
            onDelete={() => handleDelete(item.id)}
            onEdit={() => setUpdateModal({ show: true, item })}
            onUpdate={() => setShowFormUpdateCurrent({ show: true, item })}
          />
        ))}

        <Button
          className="mt-4 border-2 border-dotted rounded-2xl w-[70%] bg-transparent text-black py-15 cursor-pointer hover:scale-[1.02] hover:bg-slate-100 transition-transform"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-5 w-5 rounded-full bg-gray-200 p-1 border border-gray-400" />
          Create New Loan / Debt
        </Button>

        {showForm && (
          <InputFormModal userId={userId} onClose={() => setShowForm(false)} onCreate={handleCreate} />
        )}

        {updateModal.show && (
          <UpdateFormModal
            loanid={updateModal.item.id}
            datachange={updateModal.item}
            onClose={() => setUpdateModal({ show: false, item: null })}
            onUpdate={handleUpdate}
          />
        )}

        {showFormUpdateCurrent.show && (
          <UpdateCurrentLoan
            loanid={showFormUpdateCurrent.item.id}
            oldamount={showFormUpdateCurrent.item.amount}
            currentType={showFormUpdateCurrent.item.type}
            onClose={() => setShowFormUpdateCurrent({ show: false, item: null })}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
}

function InputFormModal({ userId, onClose, onCreate }) {
  const handleSubmit = async (data) => {
    await onCreate(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] flex flex-col gap-4 shadow-lg relative">
        <LoanInputForm id={userId} onClose={onClose} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

function UpdateFormModal({ loanid, datachange, onClose, onUpdate }) {
  const handleSubmit = async (change) => {
    await onUpdate(loanid, change);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] flex flex-col gap-4 shadow-lg relative">
        <LoanUpdateForm loanid={loanid} datachange={datachange} onClose={onClose} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

function UpdateCurrentLoan({ loanid, oldamount, currentType, onClose, onUpdate }) {
  const handleSubmit = async (change) => {
    await onUpdate(loanid, change);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <UpdateCurrentLoan_Debt loanid={loanid} oldAmount={oldamount} currentType={currentType} onClose={onClose} onSubmit={handleSubmit} />
    </div>
  );
}

function LoanFormDisplay({ amount, person, due_date, type, status, onDelete, onEdit, onUpdate }) {
  // ✅ paid overrides overdue
  const autoStatus = getAutoStatus(amount, due_date, status);
  const statusUI = STATUS_UI[autoStatus] || STATUS_UI.pending;

  const typeLabel = String(type).toLowerCase() === "loan" ? "Owed to you" : "You owed";

  return (
    <div
      className={`w-[70%] bg-gradient-to-br from-white to-slate-50 shadow-lg rounded-2xl p-5 mt-4 border transition-transform hover:scale-[1.01] ${
        autoStatus === "paid"
          ? "border-green-300"
          : autoStatus === "overdue"
          ? "border-yellow-300"
          : "border-blue-200"
      }`}
    >
      <div className="flex justify-between items-center">
        <p className="text-gray-700 font-semibold text-lg">
          Amount: <span className="text-blue-600 font-extrabold">{formatVND(amount)}</span>
        </p>

        <p className={`text-sm font-semibold uppercase tracking-wide px-4 py-1 rounded-full shadow-sm ${statusUI.className}`}>
          {statusUI.text}
        </p>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
        <div
          className={`w-[25%] text-center font-semibold py-3 rounded-xl shadow-inner ${
            String(type).toLowerCase() === "loan"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-orange-100 text-orange-700 border border-orange-300"
          }`}
        >
          {typeLabel}
        </div>

        <div className="flex flex-row items-center gap-2 text-gray-800 font-semibold text-lg">
          <CircleUser className="h-6 w-6 text-gray-500" />
          <span>{person}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-5">
        <div className="flex flex-row items-center gap-2 text-gray-500 text-sm font-medium bg-white shadow-inner rounded-xl px-4 py-2">
          <CalendarDays className="h-5 w-5 text-gray-400" />
          <span className={autoStatus === "overdue" ? "text-yellow-700 font-bold" : ""}>
            Due: {formatDMY(due_date)}
          </span>
        </div>

        <div className="flex gap-4">
          <BadgeDollarSign className="cursor-pointer hover:text-green-400 transition-colors" onClick={onUpdate} />
          <Pencil className="cursor-pointer hover:text-blue-500 transition-colors" onClick={onEdit} />
          <Trash2 className="cursor-pointer hover:text-red-500 transition-colors" onClick={onDelete} />
        </div>
      </div>
    </div>
  );
}
