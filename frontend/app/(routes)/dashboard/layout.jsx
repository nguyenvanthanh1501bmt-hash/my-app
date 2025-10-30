'use client'  // Bắt buộc vì dùng useUser, useRouter và SideNav (client components)

import React, { useEffect } from "react";
import SidebarDemo from "./components/SideNav";           // Sidebar menu
import DashboardHeader from "./components/DashboardHeader"; // Header trên cùng
import { useUser } from "@clerk/nextjs";             // Hook kiểm tra trạng thái login
import { useRouter } from "next/navigation";        // Hook điều hướng client

export default function DashboardLayout({ children }) {
    const { isSignedIn } = useUser();  // Lấy trạng thái đăng nhập
    const router = useRouter();         // Hook điều hướng

    // Nếu chưa đăng nhập, redirect về trang sign-in
    useEffect(() => {
        if (isSignedIn === false) router.push("/sign-in");
    }, [isSignedIn, router]);

    return (
        <div className="flex h-screen">
            {/* Sidebar bên trái */}
            <SidebarDemo />

            {/* Phần còn lại của màn hình */}
            <div className="flex-1 flex flex-col">
                {/* Header phía trên */}
                <DashboardHeader />
                {/* Nội dung chính của từng page */}
                <main className="p-5 flex-1 overflow-auto">
                    {children}  {/* Đây là nơi page (ví dụ page.jsx) được render */}
                </main>
            </div>
        </div>
    );
}
