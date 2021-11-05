import React, { forwardRef } from "react";

const TextArea = forwardRef((props, ref) => {
  return (
    <div className="__input">
      <textarea
        style={{
          height: "100px",
          width: "100%",
          padding: "15px",
        }}
        name={props.name}
        ref={ref}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        readOnly={props.readOnly}
      ></textarea>
    </div>
  );
});

export default TextArea;
