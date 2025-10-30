"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SendUsername() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const sendUsername = async () => {
      try {
        // Lấy name từ Clerk
        const name = user.username || user.firstName || "user";

        if (!name) {
          console.warn("No username found, skipping send");
          return;
        }

        console.log("Sending username to backend:", name);

        const res = await fetch("http://localhost:8000/api/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
          credentials: "include", // ❗ để gửi cookie nếu BE có set cookies
        });

        if (res.status === 400) {
          // User đã tồn tại -> không coi là lỗi
          console.log("User already exists, skipping");
          localStorage.setItem("sent_username", "true");
          return;
        }

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
        console.log("Username sent successfully:", name, "Backend response:", data);

      } catch (err) {
        console.error("Send username failed:", err);
      }
    };

    sendUsername();
  }, [isSignedIn, user]);

  return null;
}