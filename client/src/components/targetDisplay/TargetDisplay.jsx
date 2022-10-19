import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import "./TargetDisplay.css";

const TargetDisplay = ({ designation }) => {
  const [percentage, setPercentage] = useState(0);
  const [currDials, setCurrDials] = useState(0);
  const [target, setTarget] = useState(100);
  const [newTarget, setNewTarget] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [showModal, setShowModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    countDaysLeft();
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/settings/target`)
      .then(({ data }) => {
        setTarget(data.curr_target);
        setNewTarget(data.curr_target);
      });
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/settings/registered`)
      .then(({ data }) => {
        console.log(data);
        setCurrDials(data);
      });
  }, []);

  useEffect(() => {
    let percent = (currDials / target) * 100;
    if (percent > 100) {
      percent = 100;
    }
    setPercentage(percent);
  }, [target, currDials]);

  const countDaysLeft = () => {
    const today = new Date();
    setDaysLeft(
      new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() -
        today.getDate()
    );
  };

  const handleTargetChange = async (e) => {
    e.persist();
    setNewTarget(Number(e.target.value));
  };

  const handleTargetSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKEND_URL}/settings/update`,
      headers: { "Content-Type": "application/json" },
      data: {
        target: {
          curr_target: newTarget,
        },
      },
    });
    setTarget(newTarget);
    setIsSubmitting(false);
    setShowModal(false);
  };

  return (
    <>
      <Card className="text-center no-pad">
        <Card.Header as="h4" className="crd-header">
          {new Date().toLocaleString("default", { month: "long" })} Target
        </Card.Header>
        <Card.Body>
          <div className="progress-wrapper">
            <CircularProgressbarWithChildren
              value={percentage}
              minValue={0}
              maxValue={100}
              styles={{
                path: {
                  stroke: percentage === 100 ? "#019707" : "#349eff",
                },
              }}
            >
              <strong
                style={{ color: percentage === 100 ? "#019707" : "#349eff" }}
                className="label-txt"
              >
                {currDials}/<span className="secondary-txt">{target}</span>
              </strong>
            </CircularProgressbarWithChildren>
          </div>
          <span className="days-label">{daysLeft} days left.</span>
          {designation === "manager" && (
            <div className="set-target-div">
              <span className="curr-target-label">
                Current Target: <strong>{target}</strong>
              </span>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                {percentage === 100 ? "Set Target" : "Change Target"}
              </Button>{" "}
            </div>
          )}
        </Card.Body>
      </Card>
      {designation === "manager" && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header>
            <Modal.Title>Change Target</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleTargetSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Monthly Target</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={target}
                  onChange={handleTargetChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleTargetSubmit}
              disabled={isSubmitting}
            >
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
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default TargetDisplay;
