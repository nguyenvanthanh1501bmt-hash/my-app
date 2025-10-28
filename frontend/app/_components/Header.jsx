'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/components/ui/button"
import { useUser, useClerk } from "@clerk/nextjs"

export default function Header() {
  const { isSignedIn } = useUser();
  //const isSignedIn = true // giả lập trạng thái đăng nhập
  const { signOut } = useClerk() // dùng cho nút Logout

  return (
    <header className="p-5 flex items-center border-b-2 border-gray-300">
      {/* Logo bên trái */}
      <div className="flex items-center ml-10">
        <Link href="/" className="flex items-center">
          <Image
            src="/LogoWeb-removebg-preview.png"
            alt="Logo"
            width={50}
            height={50}
          />
          <span className="ml-2 font-bold text-lg text-green-400">Finman</span>
        </Link>
      </div>

      {/* Navigation giữa */}
      <div className="flex gap-20 flex-1 justify-center">
        {isSignedIn && (
          <>
            <Link href="/dashboard">
              <Button variant="ghost" className="rounded-full">Home page</Button>
            </Link>

            <Link href="/dashboard/expenses">
              <Button variant="ghost" className="rounded-full">Expenses</Button>
            </Link>

            <Link href="/dashboard/budget">
              <Button variant="ghost" className="rounded-full">Budget</Button>
            </Link>

            <Link href="/dashboard/saving-wallet">
              <Button variant="ghost" className="rounded-full">Saving wallet</Button>
            </Link>

            <Link href="/dashboard/your-debt">
              <Button variant="ghost" className="rounded-full">Your debt</Button>
            </Link>
          </>
        )}
      </div>

      {/* Logout / SignIn / GetStarted bên phải */}
      <div className="flex gap-3 mr-10">
        {isSignedIn ? (
          <Button
            onClick={() => signOut(() => window.location.href = '/')}
            variant="destructive"
            className="rounded-full cursor-pointer"
          >
            Logout
          </Button>
        ) : ( 
          <>
            <Link href="/sign-in">
              <Button variant="outline" className="rounded-full">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="rounded-full">Get Started</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
