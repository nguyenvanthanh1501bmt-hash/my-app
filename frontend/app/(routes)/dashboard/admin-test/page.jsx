"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/app/_components/useMe";

export default function AdminTestPage() {
  const router = useRouter();
  const { me, loading, isAdmin } = useMe();

  useEffect(() => {
    if (loading) return;
    if (!me) router.replace("/dashboard");      // chưa login token backend
    else if (!isAdmin) router.replace("/dashboard");
  }, [loading, me, isAdmin, router]);

  if (loading) return null;
  if (!me || !isAdmin) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Test (DB role)</h1>
      <p className="mt-2 text-gray-600">
        Nếu bạn thấy trang này nghĩa là backend trả role = <b>admin</b>.
      </p>

      <div className="mt-4 p-4 border rounded-xl">
        <div><b>ID:</b> {me.id}</div>
        <div><b>Name:</b> {me.name}</div>
        <div><b>Role:</b> {me.role}</div>
      </div>
    </div>
  );
}
