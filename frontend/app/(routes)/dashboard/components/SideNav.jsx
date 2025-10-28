
import Image from 'next/image';


import React, { useEffect } from "react";

// Import các icon từ thư viện lucide-react
import {
    LayoutGrid,
    PiggyBank,
    ReceiptText,
    ShieldCheck,
    CircleDollarSign
} from 'lucide-react';

// Import component của Clerk (nút user/sign out)
import { UserButton } from '@clerk/nextjs';
// Lấy pathname hiện tại để biết đang ở route nào
import { usePathname } from 'next/navigation';
import Link from 'next/link';


// Component SideNav
function SideNav() {
    // Danh sách menu sidebar: mỗi item có id, tên, icon và đường dẫn
    const menuList = [
        { id: 1, name: 'Dashboard', icon: <LayoutGrid />, path: '/dashboard' },
        { id: 2, name: 'Expenses', icon: <ReceiptText />, path: '/dashboard/expenses' },
        { id: 3, name: 'Budget', icon: <ShieldCheck />, path: '/dashboard/budget' },
        { id: 4, name: 'Saving Wallet', icon: <PiggyBank />, path: '/dashboard/saving-wallet' },
        { id: 5, name: 'Your Debt', icon: <CircleDollarSign />, path: '/dashboard/your-debt' }
    ];

    // Lấy đường dẫn hiện tại của trang
    const path = usePathname();

    // Debug: in ra console mỗi khi route thay đổi
    useEffect(() => {
        console.log('Current path:', path);
    }, [path]);

    return (
        <div className="h-screen p-5 border shadow-sm flex flex-col">
            {/* Container chính:
                - Chiều cao 100% màn hình (h-screen)
                - Padding 1.25rem (p-5)
                - Border và shadow nhỏ
                - Flex cột để xếp logo → menu → user button
            */}

            {/* Logo trên cùng */}
            <div className="flex flex-row items-center">
                {/* Link về trang chủ khi click logo */}
                <Link href="/">
                <div className="flex flex-row items-center">
                    <Image 
                        src="/LogoWeb-removebg-preview.png" 
                        alt="LOGO" 
                        width={40} 
                        height={40} 
                    />
                    {/* Tên app */}
                    <span className="ml-2 font-bold text-lg text-green-400">Finman</span>
                </div>
                    
                </Link>
                {/* Image logo */}
                
            </div>

            {/* Menu items */}
            <div className="mt-5 flex flex-col gap-2">
                {/* Lặp qua danh sách menu */}
                {menuList.map((menu) => (
                    <Link key={menu.id} href={menu.path}>
                        <h2
                            className={`
                                flex gap-2 items-center               /* icon + tên nằm ngang */
                                text-gray-500 font-medium p-4       /* màu chữ, font, padding */
                                rounded-full cursor-pointer          /* bo tròn + con trỏ pointer */
                                hover:text-primary hover:bg-blue-100 /* hiệu ứng hover */
                                ${path === menu.path ? 'text-primary bg-blue-100' : ''} /* highlight menu active */
                            `}
                        >
                            {menu.icon} {/* Icon menu */}
                            <span>{menu.name}</span> {/* Tên menu */}
                        </h2>
                    </Link>
                ))}
            </div>

            {/* User button ở dưới cùng */}
            <div className="mt-auto pt-5 flex justify-center">
                {/* Nút user do Clerk cung cấp (avatar + menu sign out) */}
                <UserButton />
            </div>
        </div>
    );

}

export default SideNav;