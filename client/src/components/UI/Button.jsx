import React from "react";
import MaterialButton from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import "./button.css";

const StyledButton = withStyles({
  root: {
    background: "var(--main-color)",
    borderRadius: "var(--border-radius)",
    border: 0,
    color: "var(--txt-color)",
    height: 48,
    padding: "0 30px",
  },
  label: {
    textTransform: "capitalize",
    fontSize: "medium",
  },
})(MaterialButton);
const Button = (props) => {
  return (
    <StyledButton
      className={`button__dialer ${props.color} ${props.className}`}
      variant="contained"
      color="primary"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.buttonText}
    </StyledButton>
  );
};

export default Button;
