"use client";

import { useUserSavingList } from "./Saving_list"; // hook custom lấy danh sách saving goals của user
import { Button } from "../../../../../components/ui/components/ui/button"; // component nút UI
import { useState } from "react"; // hook quản lý state cục bộ
import { Eye, Pencil, Trash2, Plus, Target } from "lucide-react"; // icon UI
import { DeleteSaving, CreateSaving, UpdateSaving } from "./API_setup"; // API gọi backend
import { InputForm, Updateform } from "./update_create_form"; // form modal tạo mới & update
import { useUserInfo } from "../../components/necessary_info"; // lấy thông tin user

export default function LoadingDisplay() {
  const { data, setData, error } = useUserSavingList(); // lấy dữ liệu saving goals & setter
  const [showForm, setShowForm] = useState(false); // state bật/tắt modal tạo mới
  const [updateModal, setUpdateModal] = useState({ show: false, item: null }); // state modal update: show + item cần sửa
  const { id: userId } = useUserInfo(); // lấy userId hiện tại
  
  // Hàm xóa saving
  const handleDelete = async (id) => {
    await DeleteSaving(id); // gọi API xóa
    setData(prev => prev.filter(item => item.id !== id)); // cập nhật state: loại bỏ item vừa xóa
  };

  // Hàm tạo saving mới
  const handleCreate = async (savingData) => {
    const res = await CreateSaving(savingData); // gọi API tạo mới
    setData(prev => [...prev, res]); // thêm saving mới vào state => UI tự động render
  };

  // Hàm cập nhật saving
  const handleUpdate = async (id, datachange) => {
    const res = await UpdateSaving(id, datachange); // gọi API update
    setData(prev => prev.map(item => item.id === id ? res : item)); // update item trong state
  };

  if (!data) return <p>Loading...</p>; // loading khi chưa có data
  if (error) return <p>Error: {error}</p>; // hiển thị lỗi nếu có

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2 ml-[10%]">Your goal</h2>
      <div className="flex justify-center flex-col items-center">
        {/* Hiển thị danh sách saving goals */}
        {data.map(item => (
          <SavingFormDisplay
            key={item.id}
            goal_name={item.goal_name}
            target_amount={item.target_amount}
            current_amount={item.current_amount}
            onDelete={() => handleDelete(item.id)} // gọi hàm xóa khi click
            onEdit={() => setUpdateModal({ show: true, item })} // bật modal update
          />
        ))}

        {/* Nút tạo saving mới */}
        <Button
          className="mt-4 border-2 border-dotted rounded-2xl w-[70%] bg-transparent text-black py-15 cursor-pointer hover:scale-[1.02] hover:bg-slate-100 transition-transform"
          onClick={() => setShowForm(true)} // bật modal tạo mới
        >
          <Plus className="h-5 w-5 rounded-full bg-gray-200 p-1 border border-gray-400" />
          Create New Saving Goal
        </Button>

        {/* Modal tạo mới */}
        {showForm && (
          <InputFormModal
            userId={userId} // truyền userId
            onClose={() => setShowForm(false)} // đóng modal
            onCreate={handleCreate} // callback tạo mới
          />
        )}

        {/* Modal update */}
        {updateModal.show && (
          <UpdateFormModal
            savingid={updateModal.item.id} // id saving cần update
            datachange={updateModal.item} // data hiện tại của saving
            onClose={() => setUpdateModal({ show: false, item: null })} // đóng modal
            onUpdate={handleUpdate} // callback update
          />
        )}
      </div>
    </div>
  );
}

// Modal wrapper cho InputForm
function InputFormModal({ userId, onClose, onCreate }) {
  const handleSubmit = async (data) => {
    await onCreate(data); // gọi callback tạo mới
    onClose(); // đóng modal sau khi tạo xong
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] flex flex-col gap-4 shadow-lg relative">
        <InputForm id={userId} onClose={onClose} onSubmit={handleSubmit} /> {/* form tạo mới */}
      </div>
    </div>
  );
}

// Modal wrapper cho UpdateForm
function UpdateFormModal({ savingid, datachange, onClose, onUpdate }) {
  const handleSubmit = async (change) => {
    await onUpdate(savingid, change); // gọi callback update
    onClose(); // đóng modal sau khi update
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] flex flex-col gap-4 shadow-lg relative">
        <Updateform 
          savingid={savingid} 
          datachange={datachange} 
          onClose={onClose} 
          onSubmit={handleSubmit} 
        /> {/* form update */}
      </div>
    </div>
  );
}

// Component hiển thị 1 saving goal
const SavingFormDisplay = ({ goal_name, target_amount, current_amount, onDelete, onEdit }) => (
  <div className="flex flex-col border-2 rounded-xl p-5 mt-5 w-[70%] gap-1 hover:bg-slate-100 transition-transform">
    <div className="flex justify-between items-center">
      <span className="font-bold">{goal_name}</span>
      <span className="text-indigo-400 font-bold flex items-center gap-1">
        <Target className="h-4 w-4" /> Target: {target_amount}đ
      </span>
    </div>

    <div className="text-green-600 font-bold flex justify-between items-center">
      <p>{current_amount}đ</p>
      <p className="text-gray-400">{target_amount - current_amount} left</p> {/* còn bao nhiêu tiền */}
    </div>

    {/* progress bar */}
    <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
      <div
        className="bg-green-400 h-4 rounded-full"
        style={{ width: `${(current_amount / target_amount) * 100}%` }} // tính % hoàn thành
      />
    </div>

    <div className="text-gray-400 font-bold flex justify-between mt-1">
      <p>{((current_amount / target_amount) * 100).toFixed(1)}% completed</p>
      <div className="flex gap-2">
        <Pencil className="text-pink-400 cursor-pointer" onClick={onEdit}/> {/* edit */}
        <Trash2 className="text-red-500 cursor-pointer" onClick={onDelete} /> {/* delete */}
      </div>
    </div>
  </div>
);
