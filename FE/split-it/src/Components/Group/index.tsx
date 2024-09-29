import React, { useState } from "react";
import "./index.css";
import { Button, Modal, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
// @ts-ignore
import api from "../../utils/axios.ts";

const Group = () => {
    const [groups, setGroups] = useState([
        { id: 1, name: "Group1" },
        { id: 2, name: "Group2" },
        { id: 3, name: "Group3" },
        { id: 4, name: "Group4" },
        { id: 5, name: "Group5" },
    ]);
    const [friends, setFriends] = useState([
        { id: 1, name: "Friend1" },
        { id: 2, name: "Friend2" },
        { id: 3, name: "Friend3" },
        { id: 4, name: "Friend4" },
        { id: 5, name: "Friend5" },
    ]);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [friendEmails, setFriendEmails] = useState([""]); // Start with one email input

    // Handlers for the modal
    const handleClose = () => setShowCreateGroupModal(false);
    const handleShow = () => setShowCreateGroupModal(true);

    const handleGroupNameChange = (e: any) => {
        setNewGroupName(e.target.value);
    };

    const handleFriendsSelection = (e: any) => {
        const options = e.target.options;
        const selectedValues: any = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedValues.push(options[i].value);
            }
        }
    };

    const handleEmailChange = (index: number, e: any) => {
        const updatedEmails = [...friendEmails];
        updatedEmails[index] = e.target.value;
        setFriendEmails(updatedEmails);
    };

    const handleAddEmailField = () => {
        setFriendEmails([...friendEmails, ""]);
    };

    const handleCreateGroup = async () => {
        if (newGroupName.trim() !== "") {
            const newGroup: any = await api.post("/api/group", {
                groupName: newGroupName,
                emails: friendEmails,
            });
            setGroups([...groups, newGroup]);
            setNewGroupName("");
            handleClose();
        }
    };

    return (
        <div className="sidebar">
            {/* Recent Activity */}
            <div className="recent-activity">
                <h3 className="fs-3">Recent Activity</h3>
                <input type="text" placeholder="Filter by name" />
                <button className="expenses-button">All expenses</button>
            </div>

            {/* Groups Section */}
            <div className="groups-section">
                <h4 className="fs-3">GROUPS</h4>
                <ul>
                    {groups.map((group: any) => (
                        <li key={group.id} role="button">
                            <span className="group-icon fs-5">
                                🏷️{group.name}
                            </span>
                        </li>
                    ))}
                </ul>
                <button className="add-group-button" onClick={handleShow}>
                    + add
                </button>
            </div>

            {/* Friends Section */}
            <div className="friends-section">
                <h4 className="fs-3">FRIENDS</h4>
                <ul>
                    {friends.map((friend: any) => (
                        <li key={friend.id} className="fs-5" role="button">
                            {friend.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Invite Friends */}
            <div className="invite-friends">
                <h4 className="fs-3">Invite Friends</h4>
                <input type="email" placeholder="Enter an email address" />
                <button className="invite-button">Send invite</button>
            </div>

            {/* Modal for creating a group and inviting friends */}
            <Modal show={showCreateGroupModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Group & Invite Friends</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Group Name */}
                        <Form.Group
                            controlId="formGroupName"
                            style={{ padding: 10 }}
                        >
                            <Form.Label>Group Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter group name"
                                value={newGroupName}
                                onChange={handleGroupNameChange}
                            />
                        </Form.Group>

                        {/* Input Emails of Friends */}
                        <Form.Group
                            controlId="formFriendEmails"
                            style={{ padding: 10 }}
                        >
                            <Form.Label>Enter Friend's Email</Form.Label>
                            {friendEmails.map((email, index) => (
                                <div
                                    key={index}
                                    className="d-flex align-items-center mb-2"
                                >
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter friend's email"
                                        value={email}
                                        onChange={(e) =>
                                            handleEmailChange(index, e)
                                        }
                                    />
                                    {/* Add a plus icon to add more emails */}
                                    {index === friendEmails.length - 1 && (
                                        <Button
                                            variant="link"
                                            onClick={handleAddEmailField}
                                        >
                                            <FaPlus />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreateGroup}>
                        Create Group
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Group;
