import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Dropdown, Badge } from "react-bootstrap";
import { getAllUsers } from "../../api/user/endpoints";
import { createGroup } from "../../api/group";

interface CreateGroupModalProps {
    setShowCreateGroupModal: (val: boolean) => void;
    setGroups: (val: any) => void;
    showCreateGroupModal: boolean;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
    showCreateGroupModal,
    setShowCreateGroupModal,
    setGroups,
}) => {
    const [newGroupName, setNewGroupName] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState<any>([]);

    const handleGroupNameChange = (e: any) => {
        setNewGroupName(e.target.value);
    };

    useEffect(() => {
        getAllUsers().then((data:any) => setUsers(data));
    }, []);

    const handleClose = () => setShowCreateGroupModal(false);

    const handleCreateGroup = async () => {
        if (newGroupName.trim() !== "") {
            const newGroup = await createGroup(newGroupName, selectedUsers);
            setGroups(newGroup);
            setNewGroupName("");
            handleClose();
        }
    };

    const handleSelectFriends = (user: any) => {
        setSelectedUsers([...selectedUsers, user]);
    };

    const handleRemoveUser = (user: any) => {
        const temp = selectedUsers.filter(
            (selectedUser: any) => selectedUser._id !== user._id
        );
        setSelectedUsers(temp);
    };

    return (
        <Modal show={showCreateGroupModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create Group</Modal.Title>
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
                        <Form.Label>Choose Friends</Form.Label>
                        <div className="mb-3">
                            {selectedUsers.map((user: any, index: any) => (
                                <Badge
                                    key={index}
                                    pill
                                    className="mr-2"
                                    style={{ cursor: "pointer", margin: 3 }}
                                    onClick={() => handleRemoveUser(user)}
                                >
                                    {user.name} &times;
                                </Badge>
                            ))}
                        </div>

                        {/* Dropdown to select emails */}
                        <Dropdown>
                            <Dropdown.Toggle
                                variant="outline-primary"
                                id="dropdown-basic"
                            >
                                Select Friends
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {users.map((user: any, index) => (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() =>
                                            handleSelectFriends(user)
                                        }
                                        disabled={selectedUsers.some(
                                            (selectedUser: any) =>
                                                selectedUser._id === user._id
                                        )}
                                    >
                                        {user.name}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
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
    );
};

export default CreateGroupModal;
