import React, { useContext, useEffect, useState } from "react";
import ExpenseTable from "../ExpenseTable";
import "./styles.css";
import ExpenseModal from "./ExpenseModal";
import UploadBillModal from "./UploadBillModal";
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from "react-bootstrap/Spinner";
import { getUserAmount, uploadUser } from "../../api/user/endpoints";
// @ts-ignore
import { UserContext } from "../../utils/userContext.js";
import { formatGroupDetails } from "../../utils";
import ItemTableModal from "./ItemTableModal";
import apiClient from "../../api";

interface GroupDetailsProps {
    setIsLoggedIn: (val: boolean) => void;
    isLoggedIn: boolean;
    groupDetails: any;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({
    setIsLoggedIn,
    isLoggedIn,
    groupDetails,
}) => {
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [showUploadBillModal, setShowUploadBillModal] = useState(false);
    const [showBillDetailModal, setShowBillDetailModal] = useState(false);
    const [billDetails, setBillDetails] = useState<any>([]);
    const userContext: any = useContext(UserContext);
    const { userId, setUserId } = userContext;
    const { getAccessTokenSilently, isLoading } = useAuth0();
    const [userAmount, setUserAmount] = useState(0);

    console.log(groupDetails)

    useEffect(() => {
        const fetchData = async () => {
            if (!isLoading) {
                const token = await getAccessTokenSilently();
                localStorage.setItem("token", token);
                setIsLoggedIn(true);

                // upload user data to db
                const data = await uploadUser();
                setUserId(data.user._id);
                const amt = await getUserAmount(data.user._id);
                setUserAmount(amt);
            } else if (localStorage.getItem("user_id")) {
                setUserId(localStorage.getItem("user_id"));
            }
        };

        fetchData();
    }, [isLoading]);

    useEffect(() => {
        let obj: any = {
            txn_name: 'bill',
            payees: {},
            payer_id: userId,
            name: localStorage.getItem('user_name'),
            amount: billDetails?.total,
            date: new Date().toLocaleDateString()
        }
        let totalMems = 0;
        let items: any = billDetails?.items || []
        if (!groupDetails?.members || items.length) {
            return
        }

        groupDetails.members.forEach((member: any) => {
            obj.payees[member.name] = {
                user_id: member.user_id,
                amount: 0
            };
            totalMems += 1;
        })

        Object.keys(items).forEach(item => {
            Object.keys(obj.payees).forEach((member: any) => {
                obj.payees[member].amount += billDetails.items[item] / totalMems;
            })
        });
        obj.payees = Object.values(obj.payees)

        apiClient.post(`/api/transaction/${groupDetails._id}`, obj)
    }, [billDetails])

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
                {Object.keys(groupDetails).length ? (
                    <>
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
                                    setShowBillDetailModal={setShowBillDetailModal}
                                    handleClose={handleCloseUploadBill}
                                    setBillDetails={setBillDetails}

                                />
                                <ItemTableModal
                                    showModal={showBillDetailModal}
                                    setShowModal={setShowBillDetailModal}
                                    billDetails={billDetails}
                                    members={groupDetails.members}
                                />
                            </div>
                        </header>
                        <ExpenseTable
                            expenses={formatGroupDetails(
                                groupDetails,
                                localStorage.getItem("user_id")
                            )}
                        />
                    </>
                ) : (
                    <>
                        <header>
                            <h1>Your account summary</h1>
                        </header>
                        <p style={{ display: "flex", fontSize: '24px', margin: 0}}>
                            {userAmount > 0 ? "You owe: " : "You are owed: "}
                            <p
                                style={{
                                    color: userAmount > 0 ? "red" : "green",
                                }}
                            >
                                {" "}
                                $ {Math.abs(userAmount).toString()}
                            </p>
                        </p>
                        <p style={{fontSize: 12}}>Click on group for more details</p>
                    </>
                )}
            </div>
        </>
    ) : (
        <Spinner />
    );
};

export default GroupDetails;
