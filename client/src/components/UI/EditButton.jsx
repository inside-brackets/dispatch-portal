import React from "react";

const EditButton = (props) => {
  return (
    <>
      <span className="table__row__edit" onClick={props.onClick}>
        {props.type === "eye" ? (
          <i className="bx bx-show-alt action-button"></i>
        ) :props.type === "edit" ? (
          <i className="bx bx-edit action-button"></i>
        ) : props.type === "view" ? (
          <i className="bx bx-file action-button"></i>
        ) : props.type === "open" ? (
          <i className="bx bx-window-open action-button"></i>
        ) : (
          <i className="bx bx-trash-alt action-button"></i>
        )}
      </span>
    </>
  );
};

export default EditButton;
