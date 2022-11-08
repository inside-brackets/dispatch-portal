import React, { useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import SalarySlots from "../../components/SalarySlots/SalarySlots";

function DispatchSlots({ user }) {
  const [editable, setEditable] = useState(false);

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
                style={{ width: "100%" }}
                onClick={() => setEditable(false)}
              >
                Save
              </Button>
            ) : (
              <Button
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
          <SalarySlots user={user} editable={editable} />
        </Row>
      </Col>
    </Card>
  );
}

export default DispatchSlots;
