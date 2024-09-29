import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
// @ts-ignore
import api from '../../utils/axios.ts';

interface UploadBillModalProps {
    show: boolean;
    handleClose: () => void;
    setBillDetails: React.Dispatch<React.SetStateAction<never[]>>;
    setShowBillDetailModal: any,
    //   handleUpload: (file: File | null) => void;
}

const UploadBillModal: React.FC<UploadBillModalProps> = ({
    show,
    setShowBillDetailModal,
    handleClose,
    setBillDetails
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
            const timestamp = Date.now();
            const fileExtension = selectedFile.name.split('.').pop();
            const baseFilename = selectedFile.name.replace(`.${fileExtension}`, '');
            const fileName = `${baseFilename}-${timestamp}.${fileExtension}`;
            const response = await api.get('/generate-presigned-url', {
              params: {
                fileName: fileName,
                fileType: selectedFile.type,
              },
            });
      
            const { url } = response.data;
            await api.put(url, selectedFile, {
              headers: {
                'Content-Type': selectedFile.type,
              },
            });
            console.log(fileName)
            const parsedBillData: any = await api.post(`https://x38bl41jt4.execute-api.us-west-2.amazonaws.com/dev/ocr-process?bucket=${process.env.REACT_APP_BUCKET_NAME}&key=${fileName}`)
            console.log(parsedBillData);
            setBillDetails(parsedBillData.data);
            // alert('File uploaded successfully!');
            handleModalHide();
            setShowBillDetailModal(true);
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
