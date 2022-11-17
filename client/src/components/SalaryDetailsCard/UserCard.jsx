import React from "react";
import { Col, Row } from "react-bootstrap";

function UserCard() {
  return (
    <>
      <Row>
        <Col>
          <h1 className="txt-2 fon-bold mar-b-1">User Details</h1>
          <div className="w-100 h-96 p-0-2 mar-b-2 dis-flex dis-row dis-center dis-between bg-smoke border border-r-1">
            <div className="dis-flex dis-row dis-center">
              <img className="salary-user-img" src="./temp.png" />
              <div className="dis-flex dis-col dis-start">
                <span className="txt-1 line-1 fon-med mar-b-025 txt-black">
                  Username
                </span>
                <span className="txt-1 line-1 fon-reg txt-grey">Full Name</span>
              </div>
            </div>
            <div className="dis-flex dis-col">
              <div>
                <span className="txt-1 line-1 fon-med mar-b-025 mar-r-075 txt-black">
                  Department:
                </span>
                <span className="txt-1 line-1 fon-reg mar-b-025 txt-grey">
                  Dispatch
                </span>
              </div>
              <div>
                <span className="txt-1 line-1 fon-med mar-r-075 txt-black">
                  Designation:
                </span>
                <span className="txt-1 line-1 fon-reg txt-grey">Employee</span>
              </div>
            </div>
            <div className="dis-flex dis-col">
              <div>
                <span className="txt-1 line-1 fon-med mar-b-025 mar-r-075 txt-black">
                  Status:
                </span>
                <span className="txt-1 line-1 fon-reg mar-b-025 txt-grey">
                  Active
                </span>
              </div>
              <div>
                <span className="txt-1 line-1 fon-med mar-r-075 txt-black">
                  Joined Date:
                </span>
                <span className="txt-1 line-1 fon-reg txt-grey">
                  18 Dec, 2021
                </span>
              </div>
            </div>
            <div className="dis-flex dis-col">
              <div>
                <span className="txt-1 line-1 fon-med mar-b-025 mar-r-075 txt-black">
                  Month:
                </span>
                <span className="txt-1 line-1 fon-reg mar-b-025 txt-grey">
                  November
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
