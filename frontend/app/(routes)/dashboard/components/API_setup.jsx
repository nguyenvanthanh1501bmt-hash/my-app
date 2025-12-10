const BASE = "http://localhost:8000/api/dashboard";

// =============================
// 1. SUMMARY
// =============================
export async function GetSummary(userId, month) {
    const url = `${BASE}/summary?user_id=${userId}&month=${month}`;
    const res = await fetch(url);

    if (!res.ok) {
        const text = await res.text();
        try {
            const parsed = JSON.parse(text);
            if (parsed.detail === "Không có budget cho tháng này") {
                return {
                    month,
                    total_budget: 0,
                    total_spend: 0,
                    current_balance: 0,
                };
            }
        } catch {}

        throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
}

// =============================
// 2. INCOME – OUTCOME
// =============================
export async function GetIncomeOutcome(userId, month, mode = "weekly") {
    const url = `${BASE}/income-outcome?user_id=${userId}&month=${month}&mode=${mode}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
}

// =============================
// 3. CATEGORY EXPENSE
// =============================
export async function GetCategoryExpense(userId, month) {
    const url = `${BASE}/category-expense?user_id=${userId}&month=${month}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
}

// =============================
// 4. RECENT TRANSACTIONS
// =============================
export async function GetRecentTransactions(userId, month, limit = 5) {
    const url = `${BASE}/recent-transactions?user_id=${userId}&month=${month}&limit=${limit}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
}
