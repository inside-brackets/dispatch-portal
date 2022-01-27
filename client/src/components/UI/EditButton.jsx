import React from "react";

const EditButton = (props) => {
  return (
    <>
      <span className="table__row__edit" onClick={props.onClick}>
        {props.type === "edit" ? (
          <i class="bx bx-edit"></i>
        ) : props.type === "view" ? (
          <i class="bx bx-file"></i>
        ) : (
          <i class="bx bx-trash-alt"></i>
        )}
      </span>
    </>
  );
};

export default EditButton;
