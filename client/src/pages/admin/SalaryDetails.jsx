import React from "react";
import { Col, Row } from "react-bootstrap";
import SalaryDetailsCard from "../../components/SalaryDetailsCard/SalaryDetailsCard";

function SalaryDetails() {
  return (
    <Row>
      <Col>
        <SalaryDetailsCard />
      </Col>
    </Row>
  );
}

export default SalaryDetails;
