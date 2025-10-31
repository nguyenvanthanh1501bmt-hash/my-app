'use client'

import React from "react";
import { useUserSavingList } from "./components/Saving_list";

export default function TestSavingPage() {
    const data = useUserSavingList();

    if (!data) return <p>Đang tải dữ liệu...</p>;
    if (data.length === 0) return <p>Chưa có dữ liệu Saving</p>;

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Dữ liệu Saving của bạn</h1>
            <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
