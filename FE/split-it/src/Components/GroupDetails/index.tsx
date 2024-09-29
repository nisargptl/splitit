import React, { useState } from "react";
import ExpenseTable from "../ExpenseTable";
import "./styles.css";
import ExpenseModal from "./ExpenseModal";
import UploadBillModal from "./UploadBillModal";

const GroupDetails: React.FC = () => {
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [showUploadBillModal, setShowUploadBillModal] = useState(false);

    const handleAddExpense = () => {
        if (!showAddExpenseModal) {
            setShowAddExpenseModal(true);
        }
    };

    const handleCloseExpense = () => {
        if (showAddExpenseModal) {
            setShowAddExpenseModal(false);
        }
    };

    const handleUploadBill = () => {
        if (!showUploadBillModal) {
            setShowUploadBillModal(true);
        }
    };

    const handleCloseUploadBill = () => {
        if (showUploadBillModal) {
            setShowUploadBillModal(false);
        }
    };

    return (
        <div className="app-container">
            <header>
                <h1>Group Expenses</h1>
                <div className="button-container">
                    <button
                        className="add-expense-btn"
                        onClick={handleAddExpense}
                    >
                        Add an expense
                    </button>
                    <button
                        className="upload-bill-btn"
                        onClick={handleUploadBill}
                    >
                        Upload Bill
                    </button>
                    <ExpenseModal
                        show={showAddExpenseModal}
                        handleClose={handleCloseExpense}
                    />
                    <UploadBillModal
                        show={showUploadBillModal}
                        handleClose={handleCloseUploadBill}
                    />
                </div>
            </header>
            <ExpenseTable />
        </div>
    );
};

export default GroupDetails;
