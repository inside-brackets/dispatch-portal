import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

import SalaryDetailsCard from "../../components/SalaryDetailsCard/SalaryDetailsCard";

function SalaryDetails() {
  const [user, setUser] = useState(null);
  const [paid, setPaid] = useState(false);
  const [salary, setSalary] = useState(null);

  const { year, month, id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const today = new Date();
    const date = new Date(year, month, today.getDate(), 23, 59, 59);

    if (date > today) {
      history.replace(
        `/salary/${today.getFullYear()}/${today.getMonth() - 1}/${id}`
      );
    }

    axios.get(`/getuser/${id}`).then(({ data }) => {
      setUser(data);
    });

    axios.get(`/salary/check/${year}/${month}/${id}`).then(({ data }) => {
      setPaid(data.paid);
      setSalary(data.salary[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, year, month]);

  return (
    <Row>
      <Col>
        {user && (
          <SalaryDetailsCard
            user={user}
            readOnly={paid}
            setReadOnly={setPaid}
            salary={salary}
            year={year}
            month={month}
          />
        )}
      </Col>
    </Row>
  );
}

export default SalaryDetails;
