import React, { forwardRef } from "react";
import "./myinput.css";
const MyInput = forwardRef((props, ref) => {
  return props.type !== "file" ? (
    <div className="__input">
      {props.label && <label htmlFor={props.label}>{props.label}</label>}
      {props.icon && <i className={`input__icon ${props.icon}`}></i>}
      <input
        className={`input ${props.className}`}
        type={props.type}
        id={props.label}
        name={props.name}
        ref={ref}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        onKeyDown={props.onKeyDown}
        style={props.style}
        onChange={props.onChange}
        onBlur={props.onBlur}
        disabled={props.disabled}
      />
    </div>
  ) : (
    <div className="file__input__contaier">
      {props.label && <label htmlFor={props.label}>{props.label}</label>}
      <input
        type={props.type}
        id={props.label}
        name={props.label}
        className="file__input"
        placeholder={props.placeholder}
        onChange={props.onChange}
        ref={ref}
        
        style={props.style}
        onBlur={props.onBlur}
      />
    </div>
  );
});

export default MyInput;
