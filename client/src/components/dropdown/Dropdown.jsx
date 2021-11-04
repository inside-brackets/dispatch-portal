import React, { useRef, useState } from "react";

import "./dropdown.css";

const clickOutsideRef = (content_ref, toggle_ref, setActive) => {
  document.addEventListener("mousedown", (e) => {
    // user click toggle
    if (toggle_ref.current && toggle_ref.current.contains(e.target)) {
    } else {
      // user click outside toggle and content
      if (content_ref.current && !content_ref.current.contains(e.target)) {
        setActive("");
      }
    }
  });
};

const Dropdown = (props) => {
  const dropdown_toggle_el = useRef(null);
  const dropdown_content_el = useRef(null);
  const [active, setActive] = useState("");
  clickOutsideRef(dropdown_content_el, dropdown_toggle_el, setActive);

  return (
    <div
      onClick={() => {
        setActive((prev) => {
          if (prev === "active") {
            return "";
          } else {
            return "active";
          }
        });
      }}
      className="dropdown"
    >
      <button ref={dropdown_toggle_el} className="dropdown__toggle">
        {props.icon ? <i className={props.icon}></i> : ""}
        {props.badge ? (
          <span className="dropdown__toggle-badge">{props.badge}</span>
        ) : (
          ""
        )}
        {props.customToggle ? props.customToggle() : ""}
      </button>
      <div
        ref={dropdown_content_el}
        className={`dropdown__content ${active ? "active" : ""}`}
      >
        {props.contentData && props.renderItems
          ? props.contentData.map((item, index) =>
              props.renderItems(item, index)
            )
          : ""}
        {props.renderFooter ? (
          <div className="dropdown__footer">{props.renderFooter()}</div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Dropdown;
