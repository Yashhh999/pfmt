"use client";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import LineGraph from "@/components/LineGraph";
import PieChart from "@/components/PieChart";

export default function BudgetPage() {
    const { data: session } = useSession();
    const [hasBudget, setHasBudget] = useState(true);
    const [budget, setBudget] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState("");
    const [currency, setCurrency] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD', 
    });

    const postTransaction = async () => {
        try {
            const response = await axios.post("/api/postPayment", {
                session,
                message,
                currency,
                amount,
                category
            });

            const newTransaction = response.data.transaction;
            setTransactions(prevTransactions => [...prevTransactions, newTransaction]);

            setMessage("");
            setCurrency("");
            setAmount("");
            setCategory("");

        } catch (error) {
            console.error("Error posting transaction:", error);
        }
        window.location.reload();
    }

    useEffect(() => {
        const checkBudget = async () => {
            try {
                const response = await axios.get("/api/getBudget", {
                    params: { email: session?.user?.email },
                });
                if (response.data.message === "No budget found") {
                    setHasBudget(false);
                } else {
                    setBudget(response.data[0].budget);
                }
            } catch (error) {
                console.error("Error checking budget:", error);
            }
        };

        if (session) {
            checkBudget();
        }
    }, [session]);

    useEffect(() => {
        const getTransactions = async () => {
            try {
                const response = await axios.get("/api/getPayment", {
                    params: { email: session?.user?.email },
                });
                if (response.data.message === "No transaction found") {
                    setTransactions([]);
                } else {
                    setTransactions(response.data);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };
        if (session) {
            getTransactions();
        }
    }, [session]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/postBudget", {
                session,
                Budget: budget,
            });
            if (response.data.message === "Budget created successfully") {
                setHasBudget(true);
            }
        } catch (error) {
            console.error("Error creating budget:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-10">
            
            <div className="bg-boxbg p-6 rounded-lg shadow-md flex justify-between items-center">
                <div className="text-white text-2xl font-bold">
                    {hasBudget ? (
                        <div>
                            <span className="text-slate-300">Your Monthly Budget is:</span> {budget}
                        </div>
                    ) : (
                        <div>
                            <h2>Create Your Budget</h2>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    placeholder="Enter your budget"
                                    className="p-2 rounded-md border border-gray-300"
                                />
                                <button type="submit" className="ml-4 p-2 bg-blue-500 text-white rounded-md">
                                    Save Budget
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-boxbg p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Add New Transaction</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <input
                        value={message}
                        placeholder="Message"
                        className="p-2 border rounded-md"
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <input
                        value={currency}
                        placeholder="Currency"
                        className="p-2 border rounded-md"
                        onChange={(e) => setCurrency(e.target.value)}
                    />
                    <input
                        value={amount}
                        placeholder="Amount"
                        className="p-2 border rounded-md"
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <input
                        value={category}
                        placeholder="Category"
                        className="p-2 border rounded-md"
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <button className="mt-4 p-2 bg-green-500 text-white rounded-md w-full sm:w-auto" onClick={() => setTimeout(postTransaction, 1000)}>
                    Add Transaction
                </button>
            </div>

            <div className="bg- p-6 rounded-lg ">
                <h3 className="text-2xl font-semibold mb-4 text-white ">Transaction History</h3>
                <ul className="space-y-2">
                    {transactions.map((transaction, index) => (
                        transaction && (
                            <li key={index} className="p-2 bg-gray-800 rounded-md">
                                {transaction.message ?? 'No message'} - {transaction.currency ?? 'No currency'} {formatter.format(transaction.amount)} ({transaction.category ?? 'No category'})
                            </li>
                        )
                    ))}
                </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-6 bg-boxbg rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Spending Over Time</h3>
                    <LineGraph transactions={transactions} />
                </div>
                <div className="p-6 bg-boxbg rounded-lg shadow-md h-96 text-white">
                    <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
                    <PieChart transactions={transactions} />
                </div>
            </div>
        </div>
    );
}
