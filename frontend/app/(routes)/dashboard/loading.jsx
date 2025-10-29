'use client'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      {/* Spinner đơn giản */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-gray-200 mb-4"></div>
      
      {/* Text loading */}
      <p className="text-gray-700 text-lg font-medium">Đang tải dashboard...</p>
    </div>
  )
}