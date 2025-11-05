'use client'
import React from "react";
import LoadingDisplay from "./components/display_loan_list"
import LoanDebtCard from "./components/loan_debt_card"

export default function LoanListPage() {
    return (
        <div className="flex flex-col">
            <LoadingDisplay />
        </div>
        
    )
}
