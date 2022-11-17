import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import moment from "moment";

import dummy_img from "../../assets/images/taut.png";

function UserCard({ user }) {
  const [month, setMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );

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
                  Status:
                </span>
                <span className="txt-1 line-1 fon-reg mar-b-025 txt-grey">
                  {user.u_status}
                </span>
              </div>
              <div>
                <span className="txt-1 line-1 fon-med mar-r-075 txt-black">
                  Joined Date:
                </span>
                <span className="txt-1 line-1 fon-reg txt-grey">
                  {moment(user.joining_date).format("ll")}
                </span>
              </div>
            </div>
            <div className="dis-flex dis-col">
              <div>
                <span className="txt-1 line-1 fon-med mar-b-025 mar-r-075 txt-black">
                  Month:
                </span>
                <span className="txt-1 line-1 fon-reg mar-b-025 txt-grey">
                  {month ?? "-"}
                </span>
              </div>
              <div>
                <span className="txt-1 line-1 fon-med mar-r-075 txt-black">
                  Salary:
                </span>
                <span className="txt-1 line-1 fon-reg txt-grey">Unpaid</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default UserCard;
