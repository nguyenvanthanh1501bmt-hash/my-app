import React, { useState } from "react";
import { CreateSaving, UpdateSaving } from "./API_setup"; // API gọi backend

// ======= Form tạo mới saving =======
export function InputForm({ id, onClose, onSubmit }) {
  const [goalName, setGoalName] = useState(""); // state lưu goal name
  const [targetAmount, setTargetAmount] = useState(""); // state lưu target amount

  // Hàm submit form
  const handleCreate = async (e) => {
    e.preventDefault(); // ngăn reload trang
    try {
      const data = {
        user_id: id, // id user
        goal_name: goalName,
        target_amount: parseFloat(targetAmount), // convert string -> number
      };

      // Nếu có callback onSubmit (tức gửi dữ liệu về component cha)
      if (onSubmit) {
        await onSubmit(data); // gọi callback về LoadingDisplay
      } else {
        await CreateSaving(data); // fallback: tự gọi API nếu không có callback
      }

      // reset form
      setGoalName("");
      setTargetAmount("");
      onClose(); // đóng modal
    } catch (err) {
      console.error(err);
      alert("Error creating saving"); // thông báo lỗi
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <form
        className="bg-white p-6 rounded-xl w-[400px] flex flex-col gap-4 shadow-lg relative"
        onSubmit={handleCreate} // gắn handler submit
      >
        <h1 className="font-bold text-xl">Create New Saving</h1>

        {/* Input Goal Name */}
        <div>
          <label className="font-medium mb-1 block">Goal Name</label>
          <input
            type="text"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Input Target Amount */}
        <div>
          <label className="font-medium mb-1 block">Target Amount</label>
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-2 justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-2xl hover:bg-green-300 w-[40%]"
          >
            Create
          </button>
          <button
            type="button"
            onClick={onClose} // đóng modal khi cancel
            className="bg-gray-300 text-black p-2 rounded-2xl hover:bg-red-400 w-[40%]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ======= Form cập nhật saving =======
export function Updateform({ savingid, datachange, onClose, onSubmit }) {
  const [goalName, setGoalName] = useState(datachange.goal_name); // state goal name khởi tạo từ data hiện tại
  const [targetAmount, setTargetAmount] = useState(datachange.target_amount); // state target amount khởi tạo từ data hiện tại

  // Hàm submit form update
  const handleCreate = async (e) => {
    e.preventDefault(); // ngăn reload trang
    try {
      const newData = {
        goal_name: goalName,
        target_amount: parseFloat(targetAmount),
      };

      if (onSubmit) {
        await onSubmit(newData); // gọi callback về LoadingDisplay
      } else {
        await UpdateSaving(savingid, newData); // fallback: tự gọi API nếu không có callback
      }

      onClose(); // đóng modal
    } catch (err) {
      console.error(err);
      alert("Error updating saving"); // thông báo lỗi
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <form
        className="bg-white p-6 rounded-xl w-[400px] flex flex-col gap-4 shadow-lg relative"
        onSubmit={handleCreate} // gắn handler submit
      >
        <h1 className="font-bold text-xl">Edit Saving</h1>

        {/* Input Goal Name */}
        <div>
          <label className="font-medium mb-1 block">Goal Name</label>
          <input
            type="text"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Input Target Amount */}
        <div>
          <label className="font-medium mb-1 block">Target Amount</label>
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-2 justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-2xl hover:bg-green-400 w-[40%]"
          >
            Update
          </button>
          <button
            type="button"
            onClick={onClose} // đóng modal khi cancel
            className="bg-gray-300 text-black p-2 rounded-2xl hover:bg-red-500 w-[40%]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
