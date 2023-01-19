import React from "react";
import { Modal, Button } from "react-bootstrap";

const ChangeTicketStatusModal = ({
  showModal,
  hideModal,
  confirmModal,
  id,
  type,
  message,
  title,
}) => {
  return (
    <Modal show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-primary">{message}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={hideModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => confirmModal(type, id)}>
          I'm sure
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeTicketStatusModal;