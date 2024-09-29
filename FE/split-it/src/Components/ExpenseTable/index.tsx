import React from "react";
import ExpenseItem from "./ExpenseItem";
import "./styles.css";

interface Expense {
    id: number;
    date: string;
    name: string;
    paid: number;
    lent: number;
    received?: number;
    paidBy: string;
}

interface ExpenseProps {
    expenses: any;
}

const ExpenseTable: React.FC<ExpenseProps> = ({ expenses }) => {
    return (
        <div className="expense-table">
            {expenses.map((expense: any) => (
                <ExpenseItem key={expense.id} expense={expense} />
            ))}
        </div>
    );
};

export default ExpenseTable;
