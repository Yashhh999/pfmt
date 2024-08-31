"use client";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function BudgetPage() {
    const { data: session } = useSession();
    const [hasBudget, setHasBudget] = useState(true);
    const [budget, setBudget] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState("");
    const [currency, setCurrency] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");

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
    }

    useEffect(() => {
        const checkBudget = async () => {
            try {
                const response = await axios.get("/api/getBudget", {
                    params: { email: session?.user?.email },
                });
                if (response.data.message === "No budget found") {
                    setHasBudget(false);
                }
                setBudget(response.data[0].budget);
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
        <>
            {!hasBudget && (
                <div>
                    <h2>Create Your Budget</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="Enter your budget"
                        />
                        <button type="submit">Save Budget</button>
                    </form>
                </div>
            )}
            {hasBudget && <div>Your budget is already set: {budget}</div>}

            <div > 
                <input
                    value={message}
                    placeholder="Message"
                    className="m-5"
                    onChange={(e) => setMessage(e.target.value)}
                />
                <input
                    value={currency}
                    placeholder="Currency"
                    className="m-5"
                    onChange={(e) => setCurrency(e.target.value)}
                />
                <input
                    value={amount}
                    placeholder="Amount"
                    className="m-5"
                    onChange={(e) => setAmount(e.target.value)}
                />
                <input
                    value={category}
                    placeholder="Category"
                    className="m-5"
                    onChange={(e) => setCategory(e.target.value)}
                />
                <button className="btn" onClick={() => setTimeout(postTransaction, 1000)}>
                    <Link href="/dash" >
                    Add Transaction Info
                    </Link>
                </button>
                

            </div>

            <div>
                <h3>Transaction History</h3>
                <ul>
                    {transactions.map((transaction, index) => (
                        transaction && (
                            <li key={index}>
                                {transaction.message ?? 'No message'} - {transaction.currency ?? 'No currency'} {transaction.amount ?? 'No amount'} ({transaction.category ?? 'No category'})
                            </li>
                        )
                    ))}
                </ul>
            </div>


        </>
    );
}
