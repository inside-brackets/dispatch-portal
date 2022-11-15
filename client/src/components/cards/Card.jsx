import React from "react";
import "boxicons";
import "./card.css";
import MyButton from "../UI/MyButton";

const DialerCard = (props) => {
  return (
    <div className={`dialer__card ${props.className}`}>
      {props.title && <h3 className="dialer__header">{props.title}</h3>}
      <div className="dialer__body">{props.children}</div>

      {props.buttons && (
        <div className="card__footer">
          {props.buttons.map((item, index) => (
            <MyButton
              key={index}
              color={item.color}
              onClick={item.onClick}
              buttonText={item.buttonText}
              disabled={item.disabled}
              className={item.className}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DialerCard;
