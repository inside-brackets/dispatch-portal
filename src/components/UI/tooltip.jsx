import React from "react";
import "./tooltip.css";
const tooltip = ({ children }) => {
  return (
    <div className="tp">
      {children}
      <div className="point"></div>
      <span className="tp-text">tooltip</span>
    </div>
  );
};

export default tooltip;
