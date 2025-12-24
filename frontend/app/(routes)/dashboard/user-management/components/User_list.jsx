"use client";

import { useEffect, useState } from "react";
import { getUsers } from "./API_setup";
import UpdateForm from "./UpdateForm";
import ConfirmForm from "./Confirmform";
import { Edit2, Trash2 } from "lucide-react";

export default function User_list({
  filterName,
  filterId,
  filterRole,
  filterMonth,
}) {
  const [users, setUsers] = useState([]);
  const [isOpenUpdateForm, setIsOpenUpdateForm] = useState(false);
  const [isOpenConfirmForm, setIsOpenConfirmForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Hàm fetch lại users
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    if (filterName && !u.name.toLowerCase().includes(filterName.toLowerCase()))
      return false;

    if (filterId && u.id !== Number(filterId)) return false;

    if (filterRole !== "all" && u.role !== filterRole) return false;

    if (filterMonth?.month && filterMonth?.year) {
      const d = new Date(u.created_at);
      if (d.getMonth() + 1 !== filterMonth.month || d.getFullYear() !== filterMonth.year) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">ID</th>
            <th className="border px-3 py-2 text-left">Name</th>
            <th className="border px-3 py-2 text-left">Role</th>
            <th className="border px-3 py-2 text-left">Created at</th>
            <th className="border px-3 py-2 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          )}

          {filteredUsers.map((u,idx) => (
            <tr
              key={u.id}
              className={`hover:opacity-95 transition ${
                idx % 2 === 0 ? "bg-white" : "bg-[#41BCBE]/15"
              }`}
            >
              <td className="border px-3 py-2">{u.id}</td>
              <td className="border px-3 py-2 font-medium">{u.name}</td>
              <td className="border px-3 py-2">{u.role}</td>
              <td className="border px-3 py-2">
                {new Date(u.created_at).toLocaleDateString("vi-VN")}
              </td>
              <td className="border px-3 py-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="cursor-pointer text-blue-500 hover:text-blue-700 transition-transform hover:scale-110"
                    onClick={() => {
                      setSelectedUser(u);
                      setIsOpenUpdateForm(true);
                    }}
                    aria-label="Edit user"
                    title="Edit"
                  >
                    <Edit2 size={22} />
                  </button>

                  <button
                    type="button"
                    className="cursor-pointer text-red-500 hover:text-red-700 transition-transform hover:scale-110"
                    onClick={() => {
                      setSelectedUser(u);
                      setIsOpenConfirmForm(true);
                    }}
                    aria-label="Delete user"
                    title="Delete"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isOpenConfirmForm && (
        <ConfirmForm
          open={isOpenConfirmForm}
          user={selectedUser}
          onOpenChange={state => {
            setIsOpenConfirmForm(state);
            if (!state) fetchUsers(); // reload danh sách khi đóng form
          }}
        />
      )}

      {isOpenUpdateForm && (
        <UpdateForm
          open={isOpenUpdateForm}
          user={selectedUser}
          onOpenChange={state => {
            setIsOpenUpdateForm(state);
            if (!state) fetchUsers(); // reload danh sách khi đóng form
          }}
        />
      )}
    </div>
  );
}
