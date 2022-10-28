import React from "react";
import usMap from "../../assets/images/us-map.jpg";
import UsClock from "../../components/usClock/UsClock";

const Dashboard = () => {
  
  return (
    <div>
      {/* <Timer/> */}
      <div className="row" style={{marginTop: "30px"}}>
        <div className="col-8">
          <div className="row">
            <img className="main__img" src={usMap} alt="couldn't find"/>
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
