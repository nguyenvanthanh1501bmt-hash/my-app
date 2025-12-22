// ================= COMPONENT LoadingDisplay =================
import React, { useState } from "react";
import { useLoanData } from "./Loan_list";
import { useUserInfo } from "../../components/necessary_info";
import {
  Pencil,
  Trash2,
  Plus,
  CircleUser,
  CalendarDays,
  BadgeDollarSign,
} from "lucide-react";
import { Button } from "../../../../../components/ui/components/ui/button";
import { DeleteLoan, CreateLoan, UpdateLoan } from "./API_setup";
import {
  LoanInputForm,
  LoanUpdateForm,
  UpdateCurrentLoan_Debt,
} from "./update_create_form";
import LoanDebtCard from "./loan_debt_card";

// ===== helpers =====
const formatVND = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0đ";
  return `${new Intl.NumberFormat("vi-VN").format(n)}đ`;
};

// format date dd/mm/yyyy (đọc được cả "YYYY-MM-DD" hoặc ISO)
const formatDMY = (dateVal) => {
  if (!dateVal) return "";
  const d = dateVal instanceof Date ? dateVal : new Date(dateVal);
  if (Number.isNaN(d.getTime())) return String(dateVal);
  return d.toLocaleDateString("vi-VN"); // dd/mm/yyyy
};

export default function LoadingDisplay() {
  const { data, setData, error, total_loan, total_debt } = useLoanData();
  const { id: userId } = useUserInfo();

  const [showForm, setShowForm] = useState(false);
  const [updateModal, setUpdateModal] = useState({ show: false, item: null });
  const [showFormUpdateCurrent, setShowFormUpdateCurrent] = useState({
    show: false,
    item: null,
  });

  // ===== Xóa khoản vay / nợ =====
  const handleDelete = async (id) => {
    await DeleteLoan(id);
    setData((prev) => prev.filter((i) => i.id !== id));
  };

  // ===== Tạo mới =====
  const handleCreate = async (data) => {
    const res = await CreateLoan({
      ...data,
      status: data.status?.toLowerCase() || "pending",
    });
    setData((prev) => [...prev, res]);
  };

  // ===== Cập nhật =====
  const handleUpdate = async (id, change) => {
    const res = await UpdateLoan(id, {
      ...change,
      status: change.status?.toLowerCase(),
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
        {/* Total Debt: để số dương, màu đỏ do card quyết định */}
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
          <InputFormModal
            userId={userId}
            onClose={() => setShowForm(false)}
            onCreate={handleCreate}
          />
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

// ===== FORM CREATE =====
function InputFormModal({ userId, onClose, onCreate }) {
  const handleSubmit = async (data) => {
    try {
      await onCreate(data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Create failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] flex flex-col gap-4 shadow-lg relative">
        <LoanInputForm id={userId} onClose={onClose} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

// ===== FORM UPDATE =====
function UpdateFormModal({ loanid, datachange, onClose, onUpdate }) {
  const handleSubmit = async (change) => {
    try {
      await onUpdate(loanid, change);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] flex flex-col gap-4 shadow-lg relative">
        <LoanUpdateForm
          loanid={loanid}
          datachange={datachange}
          onClose={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

function UpdateCurrentLoan({ loanid, oldamount, currentType, onClose, onUpdate }) {
  const handleSubmit = async (change) => {
    try {
      await onUpdate(loanid, change);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <UpdateCurrentLoan_Debt
        loanid={loanid}
        oldAmount={oldamount}
        currentType={currentType}
        onClose={onClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

// ===== HIỂN THỊ ITEM =====
function LoanFormDisplay({
  id,
  amount,
  person,
  due_date,
  type,
  status,
  onDelete,
  onEdit,
  onUpdate,
}) {
  const isPaid = status?.toLowerCase() === "paid";
  const typeLabel = type?.toLowerCase() === "loan" ? "Owed to you" : "You owed";

  const statusClass = isPaid
    ? "bg-green-100 text-green-600 border border-green-400"
    : "bg-red-100 text-red-600 border border-red-400";

  return (
    <div
      className={`w-[70%] bg-gradient-to-br from-white to-slate-50 shadow-lg rounded-2xl p-5 mt-4 border transition-transform hover:scale-[1.01] ${
        isPaid ? "border-green-300" : "border-red-300"
      }`}
    >
      {/* Header: Amount + Status */}
      <div className="flex justify-between items-center">
        <p className="text-gray-700 font-semibold text-lg">
          Amount: <span className="text-blue-600 font-extrabold">{formatVND(amount)}</span>
        </p>
        <p
          className={`text-sm font-semibold uppercase tracking-wide px-4 py-1 rounded-full shadow-sm ${statusClass}`}
        >
          {isPaid ? "Paid" : "Pending"}
        </p>
      </div>

      {/* Type + Person */}
      <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
        <div
          className={`w-[25%] text-center font-semibold py-3 rounded-xl shadow-inner ${
            type === "loan"
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

      {/* Footer: Due date + Actions */}
      <div className="flex justify-between items-center mt-5">
        <div className="flex flex-row items-center gap-2 text-gray-500 text-sm font-medium bg-white shadow-inner rounded-xl px-4 py-2">
          <CalendarDays className="h-5 w-5 text-gray-400" />
          <span>Due: {formatDMY(due_date)}</span>
        </div>

        <div className="flex gap-4">
          <BadgeDollarSign
            className="cursor-pointer hover:text-green-400 transition-colors"
            onClick={onUpdate}
          />
          <Pencil
            className="cursor-pointer hover:text-blue-500 transition-colors"
            onClick={onEdit}
          />
          <Trash2
            className="cursor-pointer hover:text-red-500 transition-colors"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
