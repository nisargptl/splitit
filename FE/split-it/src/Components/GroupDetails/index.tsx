import React, { useContext, useEffect, useState } from "react";
import ExpenseTable from "../ExpenseTable";
import "./styles.css";
import ExpenseModal from "./ExpenseModal";
import UploadBillModal from "./UploadBillModal";
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from "react-bootstrap/Spinner";
import { uploadUser } from "../../api/user/endpoints";
// @ts-ignore
import { UserContext } from '../../utils/userContext.js';
interface GroupDetailsProps {

    setIsLoggedIn: (val: boolean) => void;
    isLoggedIn: boolean;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({
    setIsLoggedIn,
    isLoggedIn,
}) => {
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [showUploadBillModal, setShowUploadBillModal] = useState(false);
    const userContext: any = useContext(UserContext);
    const {setUserId} = userContext;
    const { getAccessTokenSilently, isLoading } = useAuth0();

    useEffect(() => {
        const fetchData = async () => {
            if (!isLoading) {
                const token = await getAccessTokenSilently();
                localStorage.setItem("token", token);
                setIsLoggedIn(true);
    
                // upload user data to db
                const data = await uploadUser();
                setUserId(data.user._id);
            } else if (localStorage.getItem('userId')) {
                setUserId(localStorage.getItem('userId'))
            }
        };
    
        fetchData();
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
