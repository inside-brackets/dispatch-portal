import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./MCSeries.css";

function MCSeries() {
  const [series, setSeries] = useState({
    order: "",
    isCustom: false,
    customFrom: 0,
    customTo: 999,
  });
  const { order } = series;

  const handleChange = (e) => {
    e.persist();
    console.log(e.target.value);

    setSeries((prevState) => ({
      ...prevState,
      order: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(series);
  };

  return (
    <div>
      <h2>MC Series</h2>
      <br />
      <div className="row">
        <div className="col-12">
          <div className="card" style={{ minHeight: "70vh" }}>
            <div className="card__body p-3">
              <h4>Series Order</h4>
              <div className="h-line"></div>
              <form onSubmit={handleSubmit} className="mt-3">
                <Form.Group controlId="order">
                  <Form.Check
                    value="asc"
                    type="radio"
                    aria-label="asc-order"
                    label="Ascending"
                    onChange={handleChange}
                    checked={order === "asc"}
                  />
                  <Form.Check
                    value="desc"
                    type="radio"
                    aria-label="desc-order"
                    label="Descending"
                    onChange={handleChange}
                    checked={order === "desc"}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Set Series
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MCSeries;
