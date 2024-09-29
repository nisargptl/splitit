import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
// @ts-ignore
import api from '../../utils/axios.ts';

interface UploadBillModalProps {
    show: boolean;
    handleClose: () => void;
    //   handleUpload: (file: File | null) => void;
}

const UploadBillModal: React.FC<UploadBillModalProps> = ({
    show,
    handleClose,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false)

    // This function handles file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setSelectedFile(file);

        // Set the image preview
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = async () => {
        if (!selectedFile) {
            return
        }

        setUploading(true)
        try {
            const response = await api.get('/generate-presigned-url', {
              params: {
                fileName: selectedFile.name,
                fileType: selectedFile.type,
              },
            });
      
            const { url } = response.data;
            await api.put(url, selectedFile, {
              headers: {
                'Content-Type': selectedFile.type,
              },
            });
      
            alert('File uploaded successfully!');
            handleModalHide();
          } catch (error) {
            console.error('Error uploading file:', error);
          } finally {
            setUploading(false);
          }
    };

    const handleModalHide = () => {
        setSelectedFile(null);
        setPreview(null);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleModalHide} centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Upload a Photo</Modal.Title>
            </Modal.Header>

            <Modal.Body className="modal-body">
                <Form>
                    <Form.Group>
                        <Form.Label>Choose a photo to upload</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </Form.Group>

                    {preview && (
                        <div className="mt-3">
                            <p>Photo Preview:</p>
                            <img
                                src={preview}
                                alt="Preview"
                                style={{ maxWidth: "100%", height: "auto" }}
                            />
                        </div>
                    )}
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleUploadClick}
                    disabled={!selectedFile}
                >
                    Upload Photo
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UploadBillModal;
