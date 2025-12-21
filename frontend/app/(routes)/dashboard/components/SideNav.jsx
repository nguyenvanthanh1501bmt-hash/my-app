"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  CircleDollarSign,
  UserCog,
} from "lucide-react";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMe } from "@/app/_components/useMe"; // chỉnh path nếu bạn đặt khác

function SideNav() {
  const path = usePathname();
  const { isAdmin, loading } = useMe();

  const menuList = [
    { id: 1, name: "Dashboard", icon: <LayoutGrid />, path: "/dashboard" },
    { id: 2, name: "Expenses", icon: <ReceiptText />, path: "/dashboard/expenses" },
    { id: 3, name: "Budget", icon: <ShieldCheck />, path: "/dashboard/budget" },
    { id: 4, name: "Saving Wallet", icon: <PiggyBank />, path: "/dashboard/saving-wallet" },
    { id: 5, name: "Your Loan/Debt", icon: <CircleDollarSign />, path: "/dashboard/your-debt" },
  ];

  // thêm tab admin khi đã load xong & là admin
  if (!loading && isAdmin) {
    menuList.push({
      id: 99,
      name: "Admin Test",
      icon: <UserCog />,
      path: "/dashboard/admin-test",
    });
  }

  useEffect(() => {
    console.log("Current path:", path);
  }, [path]);

  return (
    <div className="h-screen p-5 border shadow-sm flex flex-col">
      <div className="flex flex-row items-center">
        <Link href="/">
          <div className="flex flex-row items-center">
            <Image
              src="/LogoWeb-removebg-preview.png"
              alt="LOGO"
              width={40}
              height={40}
            />
            <span className="ml-2 font-bold text-lg text-green-400">Finman</span>
          </div>
        </Link>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {menuList.map((menu) => (
          <Link key={menu.id} href={menu.path}>
            <h2
              className={`
                flex gap-2 items-center
                text-gray-500 font-medium p-4
                rounded-full cursor-pointer
                hover:text-primary hover:bg-blue-100
                ${path === menu.path ? "text-primary bg-blue-100" : ""}
              `}
            >
              {menu.icon}
              <span>{menu.name}</span>
            </h2>
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-5 flex justify-center">
        <UserButton />
      </div>
    </div>
  );
}

export default SideNav;
