"use client";

import { useUserSavingList } from "./Saving_list";
import { Button } from "../../../../../components/ui/components/ui/button";
import { useState } from "react";
import { Pencil, Trash2, Plus, Target, BadgeDollarSign } from "lucide-react";
import { DeleteSaving, CreateSaving, UpdateSaving } from "./API_setup";
import { InputForm, Updateform, SavingInCome } from "./update_create_form";
import { useUserInfo } from "../../components/necessary_info";

export default function LoadingDisplay() {
  const { data, setData, error } = useUserSavingList();
  const [showForm, setShowForm] = useState(false);
  const [updateModal, setUpdateModal] = useState({ show: false, item: null });
  const [showformupdatecurrent, setshowformsetupcurrent] = useState({ show: false, item: null });
  const { id: userId } = useUserInfo();

  // Xóa saving
  const handleDelete = async (id) => {
    await DeleteSaving(id);
    setData(prev => prev.filter(item => item.id !== id));
  };

  // Tạo saving mới
  const handleCreate = async (savingData) => {
    const res = await CreateSaving(savingData);
    setData(prev => [...prev, res]);
  };

  // Cập nhật saving
  const handleUpdate = async (id, datachange) => {
    const res = await UpdateSaving(id, datachange);
    setData(prev => prev.map(item => item.id === id ? res : item));
  };

  if (!data) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2 ml-[10%]">Your goal</h2>
      <div className="flex justify-center flex-col items-center">
        {data.map(item => (
          <SavingFormDisplay
            key={item.id}
            goal_name={item.goal_name}
            target_amount={item.target_amount}
            current_amount={item.current_amount}
            onDelete={() => handleDelete(item.id)}
            onEdit={() => setUpdateModal({ show: true, item })}
            onUpdateCurrent={() => setshowformsetupcurrent({ show: true, item })}
          />
        ))}

        <Button
          className="mt-4 border-2 border-dotted rounded-2xl w-[70%] bg-transparent text-black py-15 cursor-pointer hover:scale-[1.02] hover:bg-slate-100 transition-transform"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-5 w-5 rounded-full bg-gray-200 p-1 border border-gray-400" />
          Create New Saving Goal
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
            savingid={updateModal.item.id}
            datachange={updateModal.item}
            onClose={() => setUpdateModal({ show: false, item: null })}
            onUpdate={handleUpdate}
          />
        )}

        {showformupdatecurrent.show && (
          <InputCurrentSaving
            savingid={showformupdatecurrent.item.id}
            oldCurrent = {showformupdatecurrent.item.current_amount}
            onClose={() => setshowformsetupcurrent({ show: false, item: null })}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
}

// Modal tạo mới 
function InputFormModal({ userId, onClose, onCreate }) {
  const handleSubmit = async (data) => {
    await onCreate(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] flex flex-col gap-4 shadow-lg relative">
        <InputForm id={userId} onClose={onClose} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

// Modal cập nhật current amount
function InputCurrentSaving({ savingid, oldCurrent, onClose, onUpdate }) {
  const handleSubmit = async (change) => {
    await onUpdate(savingid, change);
    onClose();
  };

  return (
    <SavingInCome
      savingid={savingid}
      oldCurrent = {oldCurrent}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
}

// Modal update saving
function UpdateFormModal({ savingid, datachange, onClose, onUpdate }) {
  const handleSubmit = async (change) => {
    await onUpdate(savingid, change);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] flex flex-col gap-4 shadow-lg relative">
        <Updateform
          savingid={savingid}
          datachange={datachange}
          onClose={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

// Component hiển thị 1 saving goal
const SavingFormDisplay = ({ goal_name, target_amount, current_amount, onDelete, onEdit, onUpdateCurrent }) => (
  <div className="flex flex-col border-2 rounded-xl p-5 mt-5 w-[70%] gap-1 hover:bg-slate-100 transition-transform">
    <div className="flex justify-between items-center">
      <span className="font-bold">{goal_name}</span>
      <span className="text-indigo-400 font-bold flex items-center gap-1">
        <Target className="h-4 w-4" /> Target: {target_amount}đ
      </span>
    </div>

    <div className="text-green-600 font-bold flex justify-between items-center">
      <p>{current_amount}đ</p>
      <p className={Number(current_amount) >= Number(target_amount)
          ? "text-green-300"
          : "text-gray-400"}>
        {Number(current_amount) >= Number(target_amount)
          ? "Complete"
          : `${(Number(target_amount) - Number(current_amount)).toFixed(2)} left`}
      </p>
    </div>

    <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
      <div
        className="bg-green-400 h-4 rounded-full"
        style={{ width: `${Math.min((current_amount / target_amount) * 100, 100)}%` }}
      />
    </div>

    <div className="text-gray-400 font-bold flex justify-between mt-1">
      <p>{target_amount ? ((current_amount / target_amount) * 100).toFixed(1) : 0}% completed</p>
      <div className="flex gap-2">
        <BadgeDollarSign className="text-green-400 cursor-pointer" onClick={onUpdateCurrent} />
        <Pencil className="text-pink-400 cursor-pointer" onClick={onEdit} />
        <Trash2 className="text-red-500 cursor-pointer" onClick={onDelete} />
      </div>
    </div>
  </div>
);
