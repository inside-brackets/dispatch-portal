import React, { useState, useEffect } from "react";
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
    <div>
      <h2 className="page-header">Manager Dashboard</h2>
      <div className="row">
        <div className="col-xl-4 col-lg-6 col-md-8 col-sm-12">
          <div className="card">
            <div className="card__body p-3">
              <h4 className="text-center">
                {new Date().toLocaleString("default", { month: "long" })} Target
              </h4>
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
              <div className="days-wrapper">
                <span className="days-label">{daysLeft} days left.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
