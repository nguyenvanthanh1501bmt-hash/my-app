import { useEffect, useState } from "react";
import { GetSummary } from "./API_setup";
import { useUserInfo } from "./necessary_info";

export default function SummarySection() {
    const [summary, setSummary] = useState(null);
    const { id: userId } = useUserInfo();

    // Lấy tháng hiện tại dạng YYYY-MM
    const getCurrentMonth = () => {
        return new Date().toISOString().slice(0, 7);
    };

    useEffect(() => {
        if (!userId) return; // đợi userId load xong

        async function fetchData() {
            try {
                const data = await GetSummary(userId, getCurrentMonth());
                setSummary(data);
            } catch (err) {
                console.error("Load summary error:", err);
            }
        }

        fetchData();
    }, [userId]);

    if (!summary) return <p>Đang tải...</p>;

    return (
        <div style={{ display: "flex", gap: "20px" }}>
            <div>
                <h3>Budget</h3>
                <p>{summary.total_budget}</p>
            </div>

            <div>
                <h3>Đã xài</h3>
                <p>{summary.total_spend}</p>
            </div>

            <div>
                <h3>Còn lại</h3>
                <p>{summary.current_balance}</p>
            </div>
        </div>
    );
}
