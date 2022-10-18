import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import axios from "axios";

import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import "./Dashboard.css";

const Dashboard = () => {
  const [percentage, setPercentage] = useState(0);
  const [currDials, setCurrDials] = useState(0);
  const [target, setTarget] = useState(100);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    countDaysLeft();
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/settings/target`)
      .then(({ data }) => {
        setTarget(data.curr_target);
      });
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/settings/dials`)
      .then(({ data }) => {
        console.log(data);
        setCurrDials(data);
      });
  }, []);

  useEffect(() => {
    let percent = (currDials / target) * 100;
    if (percent > 100) {
      percent = 100;
    }
    setPercentage(percent);
  }, [target, currDials]);

  const countDaysLeft = () => {
    const today = new Date();
    setDaysLeft(
      new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() -
        today.getDate()
    );
  };

  return (
    <>
      <h2 className="page-header">Manager Dashboard</h2>
      <Row>
        <Col xl={4} lg={6} md={8} sm={12}>
          <Card className="text-center no-pad">
            <Card.Header as="h4" className="crd-header">
              {new Date().toLocaleString("default", { month: "long" })} Target
            </Card.Header>
            <Card.Body>
              <div className="progress-wrapper">
                <CircularProgressbarWithChildren
                  value={percentage}
                  minValue={0}
                  maxValue={100}
                >
                  <strong className="label-txt">
                    {currDials} /<span className="secondary-txt">{target}</span>
                  </strong>
                </CircularProgressbarWithChildren>
              </div>
              <span className="days-label">{daysLeft} days left.</span>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
