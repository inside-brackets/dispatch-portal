import React from "react";
import { useSelector } from "react-redux";
import TargetDisplay from "../../components/targetDisplay/TargetDisplay";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <>
      <h2 className="page-header">Manager Dashboard</h2>
      <Row>
        <Col xl={4} lg={6} md={8} sm={12}>
          <TargetDisplay designation={user.designation} />
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
