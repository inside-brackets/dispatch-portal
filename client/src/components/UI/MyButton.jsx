import React from "react";
import { Button } from "react-bootstrap";
import "./mybutton.css";

const MyButton = (props) => {
  return (
    <Button
      className={`mybutton ${props.color} ${props.className}`}
      color="primary"
      onClick={props.onClick}
      style={props.style}
      disabled={props.disabled}
    >
      {props.buttonText}
    </Button>
  );
};

export default MyButton;
