// components/PieChart.js
"use client";
import React from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ transactions }) {
    const categoryData = transactions.reduce((acc, curr) => {
        const category = curr.category || "Uncategorized";
        acc[category] = (acc[category] || 0) + curr.amount;
        return acc;
    }, {});

    const data = {
        labels: Object.keys(categoryData),
        datasets: [
            {
                label: "Spending by Category",
                data: Object.values(categoryData),
                backgroundColor: [
                    "#6366F1",
                    "#22C55E",
                    "#F97316",
                    "#E11D48",
                    "#14B8A6",
                    "#8B5CF6",
                    "#F43F5E",
                    "#84CC16",
                ],
                borderColor: "#fff",
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "right",
                labels: {
                    color: "#fff",
                    font: {
                        size: 14,
                    },
                },
            },
            callbacks: {
                label: function (context) {
                    const label = context.label || "Unknown";
                    const value = context.parsed || 0;
                    return `${label}: ${formatter.format(value)}`;
                },
            },
        },
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            {data.labels.length > 0 ? (
                <Pie data={data} options={options} />
            ) : (
                <p>No transaction data available to display.</p>
            )}
        </div>
    );
}
