import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import "./MCSeries.css";

function MCSeries() {
  const [series, setSeries] = useState({
    order: 1,
    isCustom: false,
    customFrom: 1,
    customTo: 999,
  });
  const [refresh, setRefresh] = useState(new Date().toLocaleString() + "");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/settings`)
      .then(({ data }) => {
        setSeries(data.mcSeries);
      });
  }, []);

  const handleChange = (e) => {
    e.persist();
    console.log(e.currentTarget.id);
    setIsDirty(true);

    if (e.currentTarget.id === "seriesOrder") {
      setSeries((prevState) => ({
        ...prevState,
        order: Number(e.target.value),
      }));
    } else if (e.currentTarget.id === "customCheckbox") {
      setSeries((prevState) => ({
        ...prevState,
        isCustom: !series.isCustom,
      }));
    } else if (e.currentTarget.id === "fromRange") {
      setSeries((prevState) => ({
        ...prevState,
        customFrom: Number(e.target.value),
      }));
    } else if (e.currentTarget.id === "toRange") {
      setSeries((prevState) => ({
        ...prevState,
        customTo: Number(e.target.value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(series);
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/settings/update`,
      headers: { "Content-Type": "application/json" },
      data: {
        mcSeries: series,
      },
    });
    setIsDirty(false);
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
              <Form onSubmit={handleSubmit} className="mt-3 mb-3">
                <Form.Group controlId="seriesOrder">
                  <Form.Check
                    value={1}
                    type="radio"
                    label="Ascending"
                    onChange={handleChange}
                    checked={series.order === 1}
                  />
                  <Form.Check
                    value={-1}
                    type="radio"
                    label="Descending"
                    onChange={handleChange}
                    checked={series.order === -1}
                  />
                </Form.Group>
                <Form.Group controlId="customCheckbox" className="mt-3">
                  <Form.Check
                    type="checkbox"
                    label="Custom"
                    onChange={handleChange}
                    checked={series.isCustom}
                  />
                </Form.Group>
                <Form.Group className="range-input-group">
                  <Form.Label className="range-input-label">Range:</Form.Label>
                  <Form.Control
                    id="fromRange"
                    size="sm"
                    type="number"
                    min={1}
                    max={999}
                    className="range-input"
                    placeholder={series.customFrom}
                    value={series.isCustom && series.customFrom}
                    disabled={!series.isCustom}
                    onChange={handleChange}
                  />
                  <span className="to-label">to</span>
                  <Form.Control
                    id="toRange"
                    size="sm"
                    type="number"
                    min={1}
                    max={999}
                    className="range-input"
                    placeholder={series.customTo}
                    value={series.isCustom && series.customTo}
                    disabled={!series.isCustom}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="mt-3"
                  disabled={!isDirty}
                >
                  Set Series
                </Button>
              </Form>
              <h4>Resources</h4>
              <div className="h-line"></div>
              <Form className="mt-3 mb-3">
                <Form.Group className="range-input-group">
                  <Form.Label className="range-input-label">
                    Available:
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    className="range-input"
                    placeholder="999"
                    readOnly={true}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width={24}
                    height={24}
                    className="to-label"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Form.Group>
                <span className="dateTime">Last refreshed: {refresh}</span>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MCSeries;
