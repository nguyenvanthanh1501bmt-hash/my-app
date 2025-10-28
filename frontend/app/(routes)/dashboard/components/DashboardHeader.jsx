import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";

function DashboardHeader() {
    const { user } = useUser();

    return (
        <div className="p-5 shadow-sm border-b flex justify-between items-center">
            {/* Hello bên trái */}
            <span className="font-medium text-gray-700">
                Hello, {user?.firstName || "User"} welcome back!
            </span>

            {/* UserButton bên phải */}
            <UserButton afterSignOutUrl="/" />
        </div>
    );
}

export default DashboardHeader;
