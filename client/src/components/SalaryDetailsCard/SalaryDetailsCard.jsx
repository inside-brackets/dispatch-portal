import React, { useState } from "react";
import { Card } from "react-bootstrap";
import Adjustments from "./Adjustments";

import "./SalaryDetailsCard.css";
import UserCard from "./UserCard";

function SalaryDetailsCard() {
  const [adjustments, setAdjustments] = useState([]);
  const [error, setError] = useState(false);

  const handleClick = () => {
    let check = true;
    if (adjustments.length >= 1) {
      if (
        adjustments[adjustments.length - 1].desc == "" ||
        adjustments[adjustments.length - 1].amount == ""
      ) {
        check = false;
      }
    }
    if (check) {
      setAdjustments([
        ...adjustments,
        {
          desc: "",
          amount: "",
        },
      ]);
    } else {
      setError(true);
    }
  };

  return (
    <Card className="p-32 border">
      <Card.Body className="p-0">
        <UserCard />
        <h1 className="txt-2 fon-bold mar-b-1">Overview</h1>
        <div className="mar-b-2 dis-flex dis-row dis-between">
          <div className="dis-flex dis-col">
            <span className="txt-125 line-1 fon-med mar-b-1">Base Salary</span>
            <input
              className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
              readOnly
              value="PKR 30000"
            />
          </div>
          <div className="dis-flex dis-col">
            <span className="txt-125 line-1 fon-med mar-b-1">Incentive</span>
            <input
              className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
              readOnly
              value="PKR 6000"
            />
          </div>
          <div className="dis-flex dis-col">
            <span className="txt-125 line-1 fon-med mar-b-1">Adjustment</span>
            <input
              className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
              readOnly
              value="PKR 1000"
            />
          </div>
          <div className="dis-flex dis-col">
            <span className="txt-125 line-1 fon-med mar-b-1">Total</span>
            <input
              className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
              readOnly
              value="PKR 37000"
            />
          </div>
        </div>
        <div className="mar-b-1 dis-flex dis-row dis-bottom">
          <h1 className="mar-b-0 mar-r-15 txt-2 fon-bold">Adjustment</h1>
          <span className="txt-875 fon-med custom-btn" onClick={handleClick}>
            Add+
          </span>
        </div>
        <Adjustments
          adjustments={adjustments}
          setAdjustments={setAdjustments}
          error={error}
          setError={setError}
        />
        <h1 className="txt-2 fon-bold mar-b-1">Incentive</h1>
        <div className="dis-flex dis-row dis-between">
          <div className="dis-flex dis-col">
            <span className="txt-125 line-1 fon-med txt-black mar-b-1">
              Exchange Rate
            </span>
            <input className="w-200 h-36 p-0-1 border border-r-025" />
          </div>
          <div className="dis-flex dis-col">
            <span className="txt-125 line-1 fon-med mar-b-1">Invoices</span>
            <input
              className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
              readOnly
              value="5"
            />
          </div>
          <div className="dis-flex dis-col">
            <span className="txt-125 line-1 fon-med mar-b-1">Total ($)</span>
            <input
              className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
              readOnly
              value="$ 26"
            />
          </div>
          <div className="dis-flex dis-col">
            <span className="txt-125 line-1 fon-med mar-b-1">Total (PKR)</span>
            <input
              className="w-200 h-36 p-0-1 border border-r-025 bg-smoke no-input"
              readOnly
              value="PKR 6000"
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default SalaryDetailsCard;
