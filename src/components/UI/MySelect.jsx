import React from "react";
import { MultiSelect } from "react-multi-select-component";
import Select from "react-select";
import "./mySelect.css";

const MySelect = (props) => {
  return props.isMulti ? (
    <div className="">
      {props.label && <label htmlFor={props.label}>{props.label}</label>}
      {props.icon && <i className={`icon ${props.icon}`}></i>}
      <MultiSelect
        disableSearch={true}
        options={props.options}
        className={`select ${props.className}`}
        hasSelectAll={props.hasSelectAll ? props.hasSelectAll : false}
        value={props.value}
        onChange={props.onChange}
        labelledBy="Select"
      />
    </div>
  ) : (
    <div className="__input">
      {props.label && <label htmlFor={props.label} style={{padding:"3px"}}>{props.label}</label>}
      {props.icon && <i className={`icon ${props.icon}`}></i>}
      <Select
        options={props.options}
        className={`select ${props.className}`}
        value={props.value}
        onChange={props.onChange}
        onInputChange={props.onInputChange}
        isSearchable={true}
        isDisabled={props.isDisabled}
      />
    </div>
  );
};

export default MySelect;
