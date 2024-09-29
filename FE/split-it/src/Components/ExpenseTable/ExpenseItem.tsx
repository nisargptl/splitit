import React from "react";
import "./styles.css";

interface ExpenseItemProps {
    expense: {
        date: string;
        title: string;
        paid: number;
        lent: number;
        received?: number;
    };
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense }) => {
    return (
        <div className="expense-item">
            <div className="expense-date">{expense.date}</div>
            <div className="expense-title">{expense.title}</div>
            <div className="expense-paid">
                <p style={{ margin: 5, color: "gray", fontSize: 12 }}>You paid:</p>
                <p
                    style={{
                        margin: 5,
                        fontWeight: "bold",
                        color:
                            expense.paid.toFixed(2) !== "0.00"
                                ? "red"
                                : "black",
                    }}
                >
                    {" "}
                    ${expense.paid.toFixed(2)}
                </p>
            </div>
            <div className="expense-lent">
                <p style={{ margin: 5, color: "gray",  fontSize: 12 }}>You lent:</p>
                <p
                    style={{
                        margin: 5,
                        fontWeight: "bold",
                        color:
                            expense.paid.toFixed(2) !== "0.00"
                                ? "green"
                                : "black",
                    }}
                >
                    {" "}
                    ${expense.lent.toFixed(2)}
                </p>
            </div>
        </div>
    );
};

export default ExpenseItem;
