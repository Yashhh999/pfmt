"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    TimeScale
);

export default function LineGraph({ transactions }) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD', // Default to USD
    });

    const data = {
        labels: transactions.map((txn) =>
            new Date(parseInt(txn.timeStamp)).toLocaleDateString()
        ),
        datasets: [
            {
                label: "Spending Over Time",
                data: transactions.map((txn) => txn.amount),
                fill: false,
                backgroundColor: "#6366F1", // Indigo-500
                borderColor: "#6366F1", // Indigo-500
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: "#E5E7EB", // Gray-200
                    font: {
                        size: 14,
                    },
                },
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function (context) {
                        return `Amount: ${formatter.format(context.parsed.y)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                type: "time",
                time: {
                    unit: "day",
                    displayFormats: {
                        day: "MMM dd",
                    },
                },
                title: {
                    display: true,
                    text: "Date",
                    color: "#E5E7EB", // Gray-200
                    font: {
                        size: 14,
                        weight: "bold",
                    },
                },
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#E5E7EB", // Gray-200
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Amount",
                    color: "#E5E7EB", // Gray-200
                    font: {
                        size: 14,
                        weight: "bold",
                    },
                },
                grid: {
                    color: "#374151", 
                },
                ticks: {
                    color: "#E5E7EB", 
                },
            },
        },
    };

    return (
        <div className="w-full h-full">
            <Line data={data} options={options} />
        </div>
    );
}