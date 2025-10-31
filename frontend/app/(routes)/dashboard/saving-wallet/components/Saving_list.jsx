import { useEffect, useState } from "react";
import { useUserInfo } from "../../components/necessary_info";

export function useUserSavingList() {
  // Lấy userId và trạng thái loading từ hook useUserInfo
  const { id: userId, loading } = useUserInfo();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading || !userId) return;

    // Biến để hủy setState nếu component unmount trước khi fetch xong
    let canceled = false;

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/savings/by-user/${userId}`);

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        // Chuyển response sang JSON
        const json = await res.json();

        // Nếu component chưa unmount, set dữ liệu vào state
        if (!canceled) setData(json);
      } catch (err) {
        // Nếu component chưa unmount, set lỗi vào state
        if (!canceled) setError(err.message);
      }
    };

    // Gọi hàm fetch
    fetchData();

    // Cleanup function, đánh dấu canceled nếu component unmount
    return () => { canceled = true; };
  }, [userId, loading]); // Chạy lại effect nếu userId hoặc loading thay đổi

  // Trả về object chứa data và error để component dùng
  return { data, error };
}
