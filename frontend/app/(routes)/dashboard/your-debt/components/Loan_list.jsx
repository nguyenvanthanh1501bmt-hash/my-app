// ================= HOOK useLoanData =================
import { useState, useEffect, useMemo } from "react";
import { useUserInfo } from "../../components/necessary_info";

export function useLoanData() {
  const { id: userId, loading } = useUserInfo();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch dữ liệu từ API
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
    return () => { canceled = true; };
  }, [userId, loading]);

  // Tách loans và debts, tính tổng
  const loans = useMemo(
    () => (Array.isArray(data) ? data.filter(item => item.type?.toLowerCase() === "loan") : []),
    [data]
  );

  const debts = useMemo(
    () => (Array.isArray(data) ? data.filter(item => item.type?.toLowerCase() === "debt") : []),
    [data]
  );

  const total_loan = useMemo(
    () => loans.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [loans]
  );

  const total_debt = useMemo(
    () => debts.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [debts]
  );

  return { data, setData, loans, debts, total_loan, total_debt, error };
}
