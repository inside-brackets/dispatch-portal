import React from "react";

const EditButton = (props) => {
  return (
    <>
      <span className="table__row__edit" onClick={props.onClick}>
        {props.type === "edit" ? (
          <i className="bx bx-edit"></i>
        ) : props.type === "view" ? (
          <i className="bx bx-file"></i>
        ) : props.type === "open" ? (
          <i class='bx bx-window-open'></i>
        ) : (
          <i className="bx bx-trash-alt"></i>
        )}
      </span>
    </>
  );
};

export default EditButton;
