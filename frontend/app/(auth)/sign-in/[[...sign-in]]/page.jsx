'use client'

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <SignIn
        path="/sign-in"           // URL page đăng nhập
        routing="path"            // cách routing của Clerk
        signUpUrl="/sign-up"      // link để chuyển sang SignUp
        redirectUrl="/dashboard"  // ← sau khi login xong sẽ chuyển đến /dashboard
      />
    </div>
  );
}
