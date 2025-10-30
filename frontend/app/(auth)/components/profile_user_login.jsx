"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function LoginUser() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn || !user) return;


    const login = async () => {
      try {
        const name = user.username || user.firstName || "user";

        if (!name) {
          console.warn("No username found, skipping login");
          return;
        }

        console.log("Logging in user:", name);

        // gửi name qua query string, không dùng body
        const res = await fetch(
          `http://localhost:8000/api/users/login?name=${encodeURIComponent(name)}`,
          {
            method: "POST",
            credentials: "include", // gửi cookie nếu backend set
          }
        );

        if (!res.ok) {
          let errMsg;
          try {
            const errJson = await res.json();
            errMsg = errJson.detail || JSON.stringify(errJson);
          } catch {
            errMsg = await res.text();
          }
          throw new Error(`HTTP ${res.status}: ${errMsg}`);
        }

        const data = await res.json();
        console.log("Login successful:", data);

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

      } catch (err) {
        console.error("Login failed:", err);
      }
    };

    login();
  }, [isSignedIn, user]);

  return null;
}
