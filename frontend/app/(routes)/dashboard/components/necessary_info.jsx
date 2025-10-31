"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function useUserInfo() {
  // Lấy user object và trạng thái đăng nhập từ Clerk
  const { user, isSignedIn, isLoaded } = useUser();

  const [id, setId] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Nếu dữ liệu Clerk chưa load xong, user chưa đăng nhập hoặc user null thì return
    if (!isLoaded || !isSignedIn || !user) return;

    const login = async () => {
      setLoading(true); // Bắt đầu loading
      setError(null);   // Reset lỗi

      try {
        const name = user.username || user.firstName || "user";

        const res = await fetch(
          `http://localhost:8000/api/users/login?name=${encodeURIComponent(name)}`,
          {
            method: "POST",          // Backend yêu cầu POST
            credentials: "include",  // Gửi cookie nếu cần
          }
        );

        // Nếu response không OK, ném lỗi
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Login failed: ${res.status} - ${text}`);
        }

        // Chuyển response sang JSON
        const data = await res.json();
        console.log("Login response test thử xem như nào2345:", data);

        // Nếu backend trả về user.id, lưu vào state
        if (data.user.id) setId(data.user.id);

        // Nếu backend trả về token, lưu vào state và localStorage
        if (data.token) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
        }

      } catch (err) {
        // Nếu lỗi xảy ra, log và lưu vào state error
        console.error("Login error:", err);
        setError(err?.message || "Unknown error");
      } finally {
        // Kết thúc loading
        setLoading(false);
      }
    };

    // Gọi hàm login async
    login();
  }, [isLoaded, isSignedIn, user]); // Chạy lại effect khi trạng thái Clerk thay đổi

  // Trả về thông tin user để các component khác dùng
  return { id, token, loading, error };
}
