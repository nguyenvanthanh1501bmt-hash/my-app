'use client";'

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <SignUp />
    </div>
    
  );
}