import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";

import SalarySlots from "../../components/SalarySlots/SalarySlots";

function DispatchSlots({ user }) {
  const [editable, setEditable] = useState(false);
  const [first, setFirst] = useState({});
  const [second, setSecond] = useState({});
  const [third, setThird] = useState({});

  useEffect(() => {
    setFirst({
      lower_bound: user.dispatch_salary_slots.first.lower_bound,
      upper_bound: user.dispatch_salary_slots.first.upper_bound,
      percentage: user.dispatch_salary_slots.first.percentage,
    });
    setSecond({
      upper_bound: user.dispatch_salary_slots.second.upper_bound,
      percentage: user.dispatch_salary_slots.second.percentage,
    });
    setThird({
      upper_bound: user.dispatch_salary_slots.third.upper_bound,
      percentage: user.dispatch_salary_slots.third.percentage,
    });
  }, [user]);

  const handleSave = async (e) => {
    setEditable(false);
    await axios({
      method: "POST",
      url: `/salary/update/slots/${user._id}`,
      headers: { "Content-Type": "application/json" },
      data: {
        dispatch_salary_slots: {
          first: first,
          second: second,
          third: third,
        },
      },
    });
  };

  return (
    <Card style={{ border: "none", minHeight: "100vh" }}>
      <Col className="mx-3">
        <Row className="mt-3 mb-3">
          <Col className="mb-4" md={10}>
            <h4>Salary Slots</h4>
          </Col>
          <Col className="mb-4" md={2} style={{ textAlign: "end" }}>
            {editable ? (
              <Button
                variant="success"
                style={{ width: "100%" }}
                onClick={handleSave}
              >
                Save
              </Button>
            ) : (
              <Button
                variant="primary"
                style={{ width: "100%" }}
                onClick={() => setEditable(true)}
              >
                Edit
              </Button>
            )}
          </Col>
          <hr />
        </Row>
        <Row>
          {first && second && third && (
            <SalarySlots
              first={first}
              setFirst={setFirst}
              second={second}
              setSecond={setSecond}
              third={third}
              setThird={setThird}
              editable={editable}
            />
          )}
        </Row>
      </Col>
    </Card>
  );
}

export default DispatchSlots;
