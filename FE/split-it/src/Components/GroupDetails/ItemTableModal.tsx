import React, { useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap'; // Modal and Button from Bootstrap

interface Item {
  id: number;
  name: string;
  price: number;
}

interface CheckedItems {
    [itemId: number]: {
    [userName: string]: boolean;
  };
}



interface ItemTableModalProps {
    show: boolean;
    handleClose: () => void;
    setBillDetails: React.Dispatch<React.SetStateAction<never[]>>;
    //   handleUpload: (file: File | null) => void;
}

const ItemTableModal: any = ({
    showModal,
    setShowModal,
    billDetails,
    members
}: any) => {
    const [checkedItems, setCheckedItems] = useState<CheckedItems>({});
    // Example data for items and users
    const items: Item[] = [];
    Object.keys(billDetails?.items || {}).forEach((item: any, idx: any) => {
        items.push({
            id: idx,
            name: item,
            price: billDetails.items[item]
        })
    })

    if (billDetails?.taxes) {
        let key: any = Object.keys(billDetails.taxes) || ''
        items.push({
            id: items.length,
            name: 'taxes',
            price: billDetails.taxes[key]
        })
    }

    const users: string[] = members.map((member: any) => member.name);

    // Toggle the modal
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // Handle checkbox change for each user and item
    const handleCheckboxChange = (itemId: number, userName: string) => {
        setCheckedItems((prevCheckedItems) => ({
            ...prevCheckedItems,
            [itemId]: {
                ...prevCheckedItems[itemId],
                [userName]: !prevCheckedItems[itemId]?.[userName],
            },
        }));
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Items List</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Item Name</th>
                    <th>Price</th>
                    {/* Dynamically generate user columns */}
                    {users.map((user) => (
                        <th key={user}>{user}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {/* Dynamically generate rows for each item */}
                    {items.map((item) => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.price}</td>
                        {users.map((user) => (
                        <td key={user}>
                            <input
                            type="checkbox"
                            checked={true}
                            onChange={() => handleCheckboxChange(item.id, user)}
                            />
                        </td>
                        ))}
                    </tr>
                    ))}
                </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ItemTableModal;