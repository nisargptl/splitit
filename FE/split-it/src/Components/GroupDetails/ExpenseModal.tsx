import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import apiClient from "../../api";

interface ExpenseModalProps {
    show: boolean;
    handleClose: () => void;
    groupDetails: any;
    // handleSave: (expenseData: { description: string; amount: number; date: string }) => void;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ show, handleClose, groupDetails }) => {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const handleSubmit = () => {
        let obj: any = {
            txn_name: description,
            payees: {},
            payer_id: localStorage.getItem('user_id'),
            name: localStorage.getItem('user_name'),
            amount: amount,
            date: date
        }
        let totalMems = groupDetails.members.length;
        if (!groupDetails.members.length) {
            return
        }

        groupDetails.members.forEach((member: any) => {
            obj.payees[member.name] = {
                user_id: member.user_id,
                user_name: member.name,
                amount: amount / totalMems
            };
        })

        obj.payees = Object.values(obj.payees)

        apiClient.post(`/api/transaction/${groupDetails._id}`, obj)

        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add an expense</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>

                    {/* Description */}
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter a description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    {/* Amount */}
                    <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>
                                <p style={{margin: 0}}>$</p>
                            </InputGroup.Text>
                            <Form.Control
                                type="number"
                                placeholder="Enter Amount"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(parseFloat(e.target.value))
                                }
                            />
                        </InputGroup>
                    </Form.Group>

                    {/* Paid by and split */}
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Paid by <strong>you</strong> and split{" "}
                            <strong>equally</strong>.
                        </Form.Label>
                        <Form.Text>({'$' + `${amount / groupDetails.members.length}/person`})</Form.Text>
                    </Form.Group>

                    {/* Date */}
                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handleSubmit}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ExpenseModal;
