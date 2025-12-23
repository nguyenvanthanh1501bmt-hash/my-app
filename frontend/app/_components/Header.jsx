'use client'

import Image from 'next/image'
import { Button } from "@/components/ui/components/ui/button"
import { useUser, useClerk } from "@clerk/nextjs"

export default function Header() {
  const { isSignedIn } = useUser()
  const { signOut } = useClerk()

  return (
    <header className="p-5 flex items-center justify-between border-b-2 border-gray-300">
      <div className="flex items-center">
        <Button
          variant="ghost"
          className="flex items-center"
          onClick={() => window.location.href = '/'}
        >
          <Image
            src="/LogoWeb-removebg-preview.png"
            alt="Logo"
            width={50}
            height={50}
          />
          <span className="ml-2 font-bold text-lg text-black">
            Finman
          </span>
        </Button>
      </div>

      <div className="flex flex-row gap-2 sm:gap-3">
        {isSignedIn ? (
          <>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => window.location.href = '/dashboard'}
            >
              Dashboard
            </Button>

            <Button
              variant="destructive"
              className="rounded-full"
              onClick={async () => {
                await signOut()
                window.location.href = '/'
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => window.location.href = '/sign-in'}
            >
              Sign In
            </Button>

            <Button
              className="rounded-full"
              onClick={() => window.location.href = '/sign-up'}
            >
              Get Started
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
