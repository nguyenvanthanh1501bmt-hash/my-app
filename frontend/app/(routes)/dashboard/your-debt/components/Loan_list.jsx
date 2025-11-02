import { useState, useEffect } from "react";
import { useUserInfo } from "../../components/necessary_info";

export function useUserLoanList() {
  const { id: userId, loading } = useUserInfo();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading || !userId) return;

    let canceled = false;

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/loans/find-by-user/${userId}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        if (!canceled) setData(json);
      } catch (err) {
        if (!canceled) setError(err.message);
      }
    };

    fetchData();
    return () => {
      canceled = true;
    };
  }, [userId, loading]);

  // Trả setData để component có thể cập nhật UI khi thêm/xoá
  return { data, setData, error };
}
