"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/app/_components/useMe";

import User_list from "./components/User_list";
import UserIdInput from "./components/SelectedbyID";
import RoleSelector from "./components/Selectedbyrole";
import MonthYearPicker from "./components/SelectedbyTime";
import UsernameInput from "./components/Selectedbyname";

export default function AdminTestPage() {
  const router = useRouter();
  const { me, loading, isAdmin } = useMe();

  // ===== FILTER STATE =====
  const [selectedId, setSelectedId] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!me || !isAdmin) router.replace("/dashboard");
  }, [loading, me, isAdmin, router]);

  if (loading || !me || !isAdmin) return null;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-3xl font-bold mb-6 ml-[15%]">User management</h1>
      </div>

      {/* ===== FILTER BAR ===== */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <UsernameInput
            value={selectedUsername}
            onChange={setSelectedUsername}
          />

          <UserIdInput
            value={selectedId}
            onChange={setSelectedId}
          />

          <RoleSelector
            value={selectedRole}
            onChange={setSelectedRole}
          />

          <MonthYearPicker
            onChange={setSelectedMonth}
          />
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white border rounded-lg shadow-sm p-4">
        <User_list
          filterName={selectedUsername}
          filterId={selectedId}
          filterRole={selectedRole}
          filterMonth={selectedMonth}
        />
      </div>
    </div>
  );
}
