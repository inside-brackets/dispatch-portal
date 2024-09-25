import React from "react";
// import { Link } from "react-router-dom";
import "./simplecard.css";

const SimpleCard = (props) => {
  return (
    <div className={`card show ${props.className}`}>
      <div
        className={`card__header ${props.textCentre && "card__text__center"}`}
      >
        <h3>{props.Header}</h3>
      </div>
      <p className={`card__body ${props.textCentre && "card__text__center"}`}>
        {props.Body}
      </p>
      <div className="card__footer">{props.Footer}</div>
    </div>
  );
};

export default SimpleCard;
