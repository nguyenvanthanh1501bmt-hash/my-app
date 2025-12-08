'use client'

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/components/ui/button";
import SummarySection from "./components/SumarySection"
import IncomeOutcomeChart from "./components/InOutcomeChart";

export default function DashboardPage() {
    return (
        <div className="p-5">
            <h1>Dashboard Page</h1>
            <SummarySection/>

            <IncomeOutcomeChart className="mt-5"/>
        </div>
    );
}
