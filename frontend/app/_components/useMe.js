"use client";
import { useEffect, useState } from "react";

export function useMe() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch("http://localhost:8000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setMe(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setMe(data);
      } catch (e) {
        setMe(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isAdmin = me?.role === "admin";
  return { me, loading, isAdmin };
}
