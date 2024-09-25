import React from "react";
import "./backButton.css";
const BackButton = (props) => {
  return (
    <button onClick={props.onClick} className={`back-button ${props.truckBtn}`}>
      <i className="bx bx-arrow-back"></i>
    </button>
  );
};

export default BackButton;
