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
          <UsClock />
        </div>
      </div>
      <Row>
        <Col xl={4} lg={6} md={8} sm={12}>
          <TargetDisplay designation={user.designation} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
