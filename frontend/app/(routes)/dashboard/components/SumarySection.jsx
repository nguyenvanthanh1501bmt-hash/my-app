import { useEffect, useState } from "react";
import { GetSummary } from "./API_setup";

export default function SummarySection({ userId, month }) {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        if (!userId || !month) return; // đợi userId và month có giá trị

        async function fetchData() {
            try {
                const data = await GetSummary(userId, month);
                setSummary(data);
            } catch (err) {
                console.error("Load summary error:", err);
            }
        }

        fetchData();
    }, [userId, month]);

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
