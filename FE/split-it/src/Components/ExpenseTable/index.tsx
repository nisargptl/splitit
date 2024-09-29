import React from "react";
import ExpenseItem from "./ExpenseItem";
import "./styles.css"

interface Expense {
    id: number;
    date: string;
    title: string;
    paid: number;
    lent: number;
    received?: number;
}

const expenses: Expense[] = [
    {
        id: 1,
        date: "September 2024",
        title: "Visarg S. paid SJ",
        paid: 0,
        lent: 0,
        received: 5.41,
    },
    {
        id: 2,
        date: "August 2024",
        title: "Subscription",
        paid: 21.62,
        lent: 16.22,
    },
    {
        id: 3,
        date: "August 2024",
        title: "Visarg S. paid SJ",
        paid: 0,
        lent: 0,
        received: 16.22,
    },
    { id: 4, date: "July 2024", title: "ChatGPT", paid: 21.62, lent: 16.21 },
    { id: 5, date: "June 2024", title: "ChatGPT", paid: 21.62, lent: 16.21 },
    {
        id: 6,
        date: "June 2024",
        title: "Settle all balances",
        paid: 5.41,
        lent: 0,
        received: 5.41,
    },
    {
        id: 7,
        date: "May 2024",
        title: "Subscription",
        paid: 21.62,
        lent: 16.22,
    },
];

const ExpenseTable: React.FC = () => {
    return (
        <div className="expense-table">
            {expenses.map((expense) => (
                <ExpenseItem key={expense.id} expense={expense} />
            ))}
        </div>
    );
};

export default ExpenseTable;
