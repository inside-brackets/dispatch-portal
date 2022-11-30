import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";

import SalaryDetailsCard from "../../components/SalaryDetailsCard/SalaryDetailsCard";

function SalaryDetails() {
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/getuser/` + id).then(({ data }) => {
      setUser(data);
    });
  }, [id]);

  return (
    <Row>
      <Col>{user && <SalaryDetailsCard user={user} readOnly={false} />}</Col>
    </Row>
  );
}

export default SalaryDetails;
