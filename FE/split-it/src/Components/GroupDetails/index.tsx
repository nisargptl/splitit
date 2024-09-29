import React, { useEffect, useState } from "react";
import ExpenseTable from "../ExpenseTable";
import "./styles.css";
import ExpenseModal from "./ExpenseModal";
import UploadBillModal from "./UploadBillModal";
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from "react-bootstrap/Spinner";

interface GroupDetails {
    setIsLoggedIn: (val: boolean) => void;
    isLoggedIn: boolean;
}

const GroupDetails: React.FC<GroupDetails> = ({
    setIsLoggedIn,
    isLoggedIn,
}) => {
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [showUploadBillModal, setShowUploadBillModal] = useState(false);

    const { getAccessTokenSilently, isLoading } = useAuth0();

    useEffect(() => {
        console.log(isLoading);
        if (!isLoading) {
            getAccessTokenSilently().then((token) => {
                localStorage.setItem("token", token);
                setIsLoggedIn(true);
            });
        }
    }, [isLoading]);

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

    return isLoggedIn ? (
        <>
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
        </>
    ) : (
        <Spinner />
    );
};

export default GroupDetails;
