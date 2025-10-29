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
      <header className="p-5 flex items-center justify-between border-b-2 border-gray-300">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/LogoWeb-removebg-preview.png"
              alt="Logo"
              width={50}
              height={50}
            />
            <span className="ml-2 font-bold text-lg text-black">Finman</span>
          </Link>
        </div>
 
        <div className="flex flex-row sm:items-center sm:flex-row gap-2 sm:gap-3 sm:mt-0">
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" className="rounded-full">Dashboard</Button>
              </Link>
              <Button
                onClick={() => signOut().then(() => window.location.href = '/')}
                variant="destructive"
                className="rounded-full"
              >
                Logout
              </Button>
            </>
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
