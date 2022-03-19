import React from "react";
// import { Link } from "react-router-dom";
import usMap from "../../assets/images/us-map.jpg";
import UsClock from "../../components/usClock/UsClock";
import Timer from "../../components/Timer";
// import { socket } from "../../index";

const Dashboard = () => {
  // const notify = () => {
  //   socket.emit("notify", "test");
  // };

  return (
    <div>
  <Timer/>
      <h2 className="page-header">Dashboard</h2>
      <div className="row">
        <div className="col-8">
          <div className="row">
            <img className="main__img" src={usMap} alt="couldn't find" />
          </div>
        </div>
        <div className="col-4">
          {/* <UsClock /> */}
          <UsClock />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
