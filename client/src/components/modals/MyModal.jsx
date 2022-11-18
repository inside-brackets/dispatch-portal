import { Fragment } from "react";
import ReactDOM from "react-dom";
import { Modal } from "react-bootstrap";
import Button from "../UI/MyButton";
import "./modal.css";

const portalElement = document.getElementById("overlays");

const MyModal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Modal
          size={props.size ? props.size : ""}
          show={props.show}
          className={`rounded-lg `}
          onHide={props.onClose}
        >
          {/* <Modal.Header className="modal-header-scroll" closeButton> */}
          <Modal.Header  closeButton>
            <Modal.Title>{props.heading}</Modal.Title>
          </Modal.Header>
          {/* <Modal.Body className={`${props.scroll ? props.scroll : 'modalBody'}`}>{props.children}</Modal.Body> */}
          <Modal.Body className={`${props.scroll}Body ${props.scrollInvoice}Body `}><div className={`${props.scroll} ${props.scrollInvoice}`}>{props.children}</div></Modal.Body>
          {props.onConfirm && (
            <Modal.Footer >
              {" "}
              <Button
                buttonText={props.btnText?props.btnText:"Submit"}
                color="inherit"
                mc={props.mc}
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

export default MyModal;
