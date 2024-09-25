import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";

import dummy_img from "../../assets/images/taut.png";

function UserCard({ user, readOnly, year, month }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date(year, month, 1));

  return (
    <>
      <Row>
        <Col>
          <h1 className="txt-2 fon-bold mar-b-1">User Details</h1>
          <div className="w-100 h-96 p-0-2 mar-b-2 dis-flex dis-row dis-center dis-between bg-smoke border border-r-1">
            <div className="dis-flex dis-row dis-center">
              <img
                className="salary-user-img"
                src={user.profile_image ?? dummy_img}
                alt="user_image"
              />
              <div className="dis-flex dis-col dis-start">
                <span className="txt-1 line-1 fon-med mar-b-025 txt-black">
                  {user.user_name}
                </span>
                <span className="txt-1 line-1 fon-reg txt-grey">
                  {(user.first_name ?? "Someone") +
                    " " +
                    (user.last_name ?? "Lazy")}
                </span>
              </div>
            </div>
            <div className="dis-flex dis-col">
              <div>
                <span className="txt-1 line-1 fon-med mar-b-025 mar-r-075 txt-black">
                  Department:
                </span>
                <span className="txt-1 line-1 fon-reg mar-b-025 txt-grey">
                  {user.department}
                </span>
              </div>
              <div>
                <span className="txt-1 line-1 fon-med mar-r-075 txt-black">
                  Designation:
                </span>
                <span className="txt-1 line-1 fon-reg txt-grey">
                  {user.designation}
                </span>
              </div>
            </div>
            <div className="dis-flex dis-col">
              <div>
                <span className="txt-1 line-1 fon-med mar-b-025 mar-r-075 txt-black">
                  Year:
                </span>
                <span className="txt-1 line-1 fon-reg mar-b-025 txt-grey">
                  {selectedMonth.getFullYear() ?? "-"}
                </span>
              </div>
              <div>
                <span className="txt-1 line-1 fon-med mar-r-075 txt-black">
                  Month:
                </span>
                <span className="txt-1 line-1 fon-reg txt-grey">
                  {selectedMonth.toLocaleString("default", {
                    month: "long",
                  }) ?? "-"}
                </span>
              </div>
            </div>
            <div className="dis-flex dis-col">
              <div>
                <span className="txt-1 line-1 fon-med mar-r-075 txt-black">
                  Salary:
                </span>
                <span
                  className={`txt-1 line-1 fon-reg ${
                    readOnly ? "txt-green" : "txt-red"
                  }`}
                >
                  {readOnly ? "Paid" : "Unpaid"}
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default UserCard;
