import React, { useRef, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Graphs from "./CarrierGraphs";
import "./carrier-report.css";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";

const CarrierReport = ({
  load,
  carrier,
  truck,
  dispatcher,
  startDate,
  endDate,
  defaultValue,
  lineGraphData,
  barGraphData,
  deadHead,
}) => {
  const ref = useRef();
  const history = useHistory();
  const { label } = useSelector((state) => state.user.company);
  const { department } = useSelector((state) => state.user.user);
  const [workingDays, setWorkingDays] = useState(
    defaultValue ? defaultValue.working_days : null
  );
  console.log("hello", department);
  const [dispatcherComments, setDispatcherComments] = useState(
    defaultValue ? defaultValue.dispatcher_comment : null
  );
  const [managerComments, setManagerComments] = useState(
    defaultValue
      ? defaultValue.manager_comment && defaultValue.manager_comment
      : null
  );
  const [deadHeadValue, setDeadHeadValue] = useState(
    deadHead.reduce((previousValue, currentValue) => {
      if (currentValue.distance) {
        return (
          previousValue +
          parseFloat(
            currentValue.distance.text.split(" ")[0].replaceAll(",", "")
          )
        );
      } else return previousValue + 0;
    }, 0)
  );

  const loadedMiles = load
    .filter((l) => l.l_status === "delivered")
    .reduce(
      (previousValue, currentValue) => previousValue + currentValue.miles,
      0
    );
  const amounts = load.reduce(
    (previousValue, currentValue) => previousValue + currentValue.pay,
    0
  );

  let dollarPerLoadedMiles;
  if (amounts === 0 || loadedMiles === 0) {
    dollarPerLoadedMiles = 0;
  } else {
    dollarPerLoadedMiles = amounts / loadedMiles;
  }

  const totalMiles = loadedMiles + parseInt(deadHeadValue);
  const totalGross = load.reduce((pre, curr) => pre + curr.pay, 0);
  let dollarPerTotalMiles;
  if (amounts === 0 || loadedMiles === 0) {
    dollarPerTotalMiles = 0;
  } else {
    dollarPerTotalMiles = amounts / totalMiles;
  }
  const reactToPrintContent = React.useCallback(() => {
    return ref.current;
  }, [ref.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "AwesomeFileName",
    removeAfterPrint: true,
  });

  const handleSubmit = async () => {
    if (!workingDays || !dispatcherComments || !managerComments) {
      return alert("Please add working days and dispatcher comments");
    }
    if (!defaultValue) {
      await axios.post(`/dispatch/addcarrierreport`, {
        carrier: carrier._id,
        truck: truck.value,
        from: startDate,
        to: endDate,
        working_days: workingDays,
        dispatcher_comment: dispatcherComments,
        loads: load.map((l) => l._id),
        deadHead: deadHead,
        dispatcher: dispatcher._id,
        manager_comment: managerComments,
      });
    }
    history.push("/reports");
  };
  return (
    <>
      <Row id="div-to-print" ref={ref} className="justify-content-around m-3">
        <h3 className="text-center main-heading">{carrier?.company_name}</h3>
        <h5 className="text-center mt-3">({carrier?.mc_number})</h5>
        <h4 className="text-center mt-3 second-heading">Carrier Report</h4>
        <h5 className="text-center mt-3">
          (
          {`${moment(startDate).format("MMMM D, YYYY")} - ${moment(
            endDate
          ).format("MMMM D, YYYY")}`}
          )
        </h5>
        <br />
        <h1 className="text-center my-4">Statistics</h1>
        <table>
          <tr>
            <td className="major-details">Total Miles: </td>
            <td className="major-details">{totalMiles} </td>
            <td className="major-details">Total Gross </td>
            <td className="major-details"> {totalGross} </td>
          </tr>
          <tr>
            <td className="major-details">Dollar per Loaded Miles: </td>
            <td className="major-details">
              {typeof dollarPerLoadedMiles === "NaN"
                ? 0
                : dollarPerLoadedMiles.toFixed(2)}
            </td>
            <td className="major-details">Dollar per Total Miles:</td>
            <td className="major-details">{dollarPerTotalMiles.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="major-details">Working Days:</td>
            <td className="major-details">
              <input
                className="form-group border"
                value={workingDays}
                // disabled={defaultValue}
                onChange={(e) => setWorkingDays(e.target.value)}
                type="number"
              />
            </td>
          </tr>
        </table>
        <Row className="my-4">
          <h1 className="text-center mt-2">Loaded Miles Vs Deadhead</h1>
          <Col>
            <Graphs
              type="donut"
              loadedMiles={loadedMiles}
              deadHeadMiles={parseInt(deadHeadValue)}
            />
          </Col>
          <Col
            style={{
              marginTop: "150px",
            }}
          >
            <Row>
              <Col className="loaded-miles my-3">
                Loaded Miles:
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {loadedMiles}
              </Col>
            </Row>
            <Row>
              <Col className="deadhead-miles">
                <Row>
                  <Col md={5}> DeadHead Miles:</Col>
                  <Col md={5}>
                    <input
                      type="number"
                      className="form-group border"
                      value={deadHeadValue}
                      onChange={(e) => setDeadHeadValue(e.target.value)}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col className="major-details">Dispatcher Remarks:</Col>
        </Row>
        <Row>
          <Col>
            <textarea
              value={dispatcherComments}
              // disabled={defaultValue}
              onChange={(e) => setDispatcherComments(e.target.value)}
              className="form-group border text-area"
            />
          </Col>
        </Row>
        <h2
          style={{
            marginTop: "170px",
          }}
          className="text-center"
        >
          Have control of your business with our Statistical Analysis
        </h2>
        <Row className="justify-content-center mt-5">
          <h5 className="text-center">Miles per month vs gross per month</h5>
          <Graphs type="line" data={lineGraphData.reverse()} />
        </Row>

        <Row className="justify-content-center my-5">
          <h5 className="text-center">Dollar per mile</h5>
          <Graphs type="bar" data={barGraphData.reverse()} />
        </Row>

        <h3
          style={{
            marginTop: "320px",
          }}
          className="text-center"
        >
          Your Loads With us
        </h3>
        <table className="table invoice mx-5">
          <thead
            style={{
              backgroundColor: "#000",
              color: "#fff",
              textAlign: "left",
              paddingBottom: "12px",
              border: "1px solid #ddd",
            }}
          >
            <tr>
              <th scope="col">Load #</th>
              <th scope="col">Load Details</th>
              <th scope="col">Duration</th>
              <th scope="col">Amount</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {load.map((item) => (
              <tr>
                <td>{item.load_number ? item.load_number : "NA"}</td>
                <td>
                  {item.pick_up && item.drop
                    ? `${item.pick_up.address} to ${item.drop.address} `
                    : "NA"}
                </td>
                <td>
                  {item.pick_up && item.drop
                    ? `${moment(item.pick_up.date).format("ll")} to ${moment(
                        item.drop.date
                      ).format("ll")} `
                    : "NA"}
                </td>
                <td>{item.pay ? item.pay : "NA"}</td>
                <td>{item.l_status ? item.l_status : "NA"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table>
          <tr>
            <td className="major-details">Manager Remarks:</td>
          </tr>
          <tr>
            <td>
              <textarea
                value={managerComments}
                // disabled={defaultValue}
                onChange={(e) => setManagerComments(e.target.value)}
                className="form-group border text-area2"
                disabled={department === "dispatch"}
              />
            </td>
          </tr>
        </table>
        <h4 className="total-miles mt-5">Regards,</h4>
        <h4 className="total-miles">
          {dispatcher.department === "dispatch" && !defaultValue
            ? dispatcher.user_name
            : defaultValue.dispatcher.user_name}
        </h4>
        <h4 className="total-miles">{label}</h4>
      </Row>
      <Row className="justify-content-center">
        {
          <Col md={defaultValue ? 8 : 4}>
            <Button
              className="w-100"
              variant={"success"}
              size="lg"
              onClick={handlePrint}
            >
              Print
            </Button>
          </Col>
        }
        {!defaultValue && (
          <Col md={4}>
            <Button
              className="w-100"
              variant="primary"
              size="lg"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Col>
        )}
      </Row>
    </>
  );
};

export default CarrierReport;
