import React from "react";
import "./searchbar.css";

const SearchBar = (props) => {
  return (
    <div className={`${props.className}`}>
      <input type={`${props.type}`} placeholder={`${props.placeholder}`} />
      <i className="bx bx-search"></i>
    </div>
  );
};

export default SearchBar;
