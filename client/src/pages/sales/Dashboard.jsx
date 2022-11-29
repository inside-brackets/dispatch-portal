import React from "react";
import { useSelector } from "react-redux";
import usMap from "../../assets/images/us-map.jpg";
import UsClock from "../../components/usClock/UsClock";
import TargetDisplay from "../../components/targetDisplay/TargetDisplay";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <div>
      <div className="row" style={{ marginTop: "30px" }}>
        <div className="col-8">
          <div className="row">
            <img className="main__img" src={usMap} alt="couldn't find" />
          </div>
        </div>
        <div className="col-4">
          {user.department === "sales" ? (
            <TargetDisplay designation={user.designation} />
          ) : null}
          <UsClock />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
