import { Fragment } from "react";
import ReactDOM from "react-dom";
import { Modal } from "react-bootstrap";
import Button from "../UI/MyButton";
import "./modal.css";

const portalElement = document.getElementById("overlays");

const ModalToAssignSale = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Modal
          size={props.size ? props.size : ""}
          show={props.show}
          className="rounded-lg"
          onHide={props.onClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>{props.heading}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modalBody">{props.children}</Modal.Body>
          {props.onConfirm && (
            <Modal.Footer>
              {" "}
              <Button
                buttonText="Submit"
                color="inherit"
                disabled={props.disabled}
                onClick={props.onConfirm}
                className="button__class"
              />
            </Modal.Footer>
          )}
        </Modal>,
        portalElement
      )}
    </Fragment>
  );
};

export default ModalToAssignSale;
