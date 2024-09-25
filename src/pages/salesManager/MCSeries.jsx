import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import Switch from "react-switch";
import { toast } from "react-toastify";
import axios from "axios";

import TargetDisplay from "../../components/targetDisplay/TargetDisplay";
import TimeLogs from "../../components/timeLogs/TimeLogs";
import "./MCSeries.css";

function MCSeries() {
  const { user } = useSelector((state) => state.user);
  const [series, setSeries] = useState({
    order: 1,
    isCustom: false,
    customFrom: 1,
    customTo: 999,
    includeRejected: false
  });
  const [leads, setLeads] = useState(0);
  const [refTime, setRefTime] = useState(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  const [isDirty, setIsDirty] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleChange = (e) => {
    e.persist();
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
    } else if (e.currentTarget.id === "rejectedCheckbox"){
      setSeries((prevState) => ({
        ...prevState,
        includeRejected: !prevState.includeRejected,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDirty(false);
    setIsSubmitting(true);
    await axios({
      method: "POST",
      url: `/settings/update`,
      headers: { "Content-Type": "application/json" },
      data: {
        mcSeries: series,
      },
    });
    setIsSubmitting(false);
    toast.success("Settings updated successfully");
    handleRefresh();
  };

  const handleRefresh = async (e) => {
    setAnimate(true);
    await axios.get(`/settings`).then(({ data }) => {
      setSeries(data);
      axios({
        method: "POST",
        url: `/count/leads`,
        headers: { "Content-Type": "application/json" },
        data: {
          series: data,
        },
      }).then(({ data }) => {
        setLeads(data);
      });
    });
    setAnimate(false);
    setIsDirty(false);
    setRefTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const handleFreeResource = async (e) => {
    setRefresh(true);
    await axios.get(`/free/leads/didnotpick`).catch((error) => {
      if (error.response) {
        toast.error("Something went wrong!");
      }
    });
    toast.success("Resources freed up!");
    handleRefresh();
    setRefresh(false);
  };

  return (
    <div>
      <h2>Settings</h2>
      <br />
      <Row>
        <Col sm={12} md={10} lg={8} xl={4}>
          <div className="card">
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
                  <Form.Check type="checkbox" label="Custom" onChange={handleChange} checked={series.isCustom} />
                </Form.Group>
                <Form.Group className="disp-flex">
                  <Form.Label className="mr-right">Range:</Form.Label>
                  <Form.Control
                    id="fromRange"
                    size="sm"
                    type="number"
                    min={1}
                    className="w-6rem"
                    placeholder={series.customFrom}
                    value={series.isCustom && series.customFrom}
                    disabled={!series.isCustom}
                    onChange={handleChange}
                  />
                  <span className="mr-left-right">to</span>
                  <Form.Control
                    id="toRange"
                    size="sm"
                    type="number"
                    min={1}
                    className="w-6rem"
                    placeholder={series.customTo}
                    value={series.isCustom && series.customTo}
                    disabled={!series.isCustom}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="rejectedCheckbox" className="mt-3">
                  <Form.Check type="checkbox" label="Include Rejected Leads" onChange={handleChange} checked={series.includeRejected} />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3 disp-flex" disabled={!isDirty}>
                  {isSubmitting && (
                    <svg
                      className="load-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  Set Series
                </Button>
              </Form>
              <h4>Resources</h4>
              <div className="h-line"></div>
              <Form className="mt-3 mb-3">
                <Form.Group className="disp-flex">
                  <Form.Label className="mr-right">Available Leads:</Form.Label>
                  <Form.Control size="sm" className="w-6rem" placeholder={leads} readOnly={true} />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width={24}
                    height={24}
                    className={`mr-left-right refresh-btn ${animate ? `refresh` : ``}`}
                    onClick={handleRefresh}
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Form.Group>
                <span className="time-text">Last refreshed: {refTime}</span>
                  <Form.Group className="mt-4">
                    <Button
                      variant="secondary"
                      className="sec-btn disp-flex"
                      onClick={handleFreeResource}
                      disabled={refresh}
                    >
                      {refresh && (
                        <svg
                          className="load-icon"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      )}
                      Free Resources
                    </Button>
                  </Form.Group>
              </Form>
            </div>
          </div>
        </Col>
        <Col sm={12} md={8} lg={6} xl={4}>
          <TargetDisplay designation={user.designation} />
        </Col>
        {user.department === "admin" && (
          <Col sm={12} md={8} lg={6} xl={4}>
            <TimeLogs designation={user.designation} />
          </Col>
        )}
      </Row>
    </div>
  );
}

export default MCSeries;
