import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";

interface ExpenseModalProps {
    show: boolean;
    handleClose: () => void;
    // handleSave: (expenseData: { description: string; amount: number; date: string }) => void;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ show, handleClose }) => {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const handleSubmit = () => {
        const expenseData = {
            description,
            amount,
            date,
        };
        // handleSave(expenseData);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add an expense</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Select users and split */}
                    <Form.Group className="mb-3">
                        <Form.Label>With you and:</Form.Label>
                        <Form.Control
                            type="text"
                            value="All of ChatGPT"
                            readOnly
                        />
                    </Form.Group>

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
                        <Form.Text>($0.00/person)</Form.Text>
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
