import React, { useRef, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Graphs from "./CarrierGraphs";
import "./carrier-report.css";

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
  console.log("deadHead", deadHead);
  const ref = useRef();
  const history = useHistory();
  const [workingDays, setWorkingDays] = useState(
    defaultValue ? defaultValue.working_days : null
  );
  const [dispatcherComments, setDispatcherComments] = useState(
    defaultValue ? defaultValue.dispatcher_comment : null
  );

  const loadedMiles = load.reduce(
    (previousValue, currentValue) => previousValue + currentValue.miles,
    0
  );
  const amounts = load.reduce(
    (previousValue, currentValue) => previousValue + currentValue.pay,
    0
  );

  const deadHeadMiles = deadHead.reduce((previousValue, currentValue) => {
    if (currentValue.distance) {
      return (
        previousValue + parseFloat(currentValue.distance.text.split(" ")[0])
      );
    } else return previousValue + 0;
  }, 0);

  let dollarPerLoadedMiles;
  if (amounts === 0 || loadedMiles === 0) {
    dollarPerLoadedMiles = 0;
  } else {
    dollarPerLoadedMiles = amounts / loadedMiles;
  }

  const totalMiles = loadedMiles + deadHeadMiles;
  let dollarPerTotalMiles;
  if (amounts === 0 || loadedMiles === 0) {
    dollarPerTotalMiles = 0;
  } else {
    dollarPerTotalMiles = amounts / totalMiles;
  }
  const printDocument = async () => {
    if (!workingDays || !dispatcherComments) {
      return alert("Please add working days and dispatcher comments");
    }
    const input = document.getElementById("div-to-print");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      var pdf = new jsPDF({ orientation: "potrait" });
      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "JPEG", 0, 0, width, height);
       pdf.output("dataurlnewwindow");
            pdf.save("download.pdf");
    });

    if (!defaultValue) {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/dispatch/addcarrierreport`,
        {
          carrier: carrier._id,
          truck: truck.value,
          from: startDate,
          to: endDate,
          working_days: workingDays,
          dispatcher_comment: dispatcherComments,
          loads: load,
          deadHead: deadHead,
        }
      );
    }
    // history.push("/report");
  };
  return (
    <>
      <Row
        id="div-to-print"
        ref={ref}
        style={{
          backgroundColor: "#fffff",
          width: "600mm",
          minHeight: "200mm",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        className="justify-content-around"
      >
        <Col md={10}>
          <h1 className="text-center main-heading">{carrier.company_name}</h1>
          <h2 className="text-center mt-5 second-heading">Carrier Report</h2>
          <Row className="justify-content-around mt-5">
            <Col md={6}>
              <h5>Carrier Name: {carrier.company_name}</h5>
            </Col>
            <Col md={6}>
              <h5>Agent Name: {dispatcher.user_name}</h5>
            </Col>
          </Row>
          <Row className="justify-content-around mt-2">
            <Col md={6}>
              <h5>MC:{carrier.mc_number}</h5>
            </Col>
            <Col md={6}></Col>
          </Row>
          <Row>{/* <Map /> */}</Row>
          <Row className="justify-content-around mt-5">
            <h1 className="text-center">Statistics</h1>
            <Row className="justify-content-center">
              <h3>Loaded Miles Vs Deadhead</h3>
              <Graphs
                type="donut"
                loadedMiles={loadedMiles}
                deadHeadMiles={deadHeadMiles}
              />
            </Row>
            <Row className="justify-content-around mt-2">
              <Col md={6}>
                <h5 className="loaded-miles">Loaded Miles: {loadedMiles}</h5>
              </Col>
              <Col md={6}>
                <h5 className="deadhead-miles">
                  DeadHead Miles:{deadHeadMiles}
                </h5>
              </Col>
            </Row>
            <Row className="justify-content-around mt-4">
              <Col md={6}>
                <h5 className="total-miles">Total Miles:{totalMiles}</h5>
              </Col>
              <Col md={6}></Col>
            </Row>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            <Row className="justify-content-around mt-2">
              <Col md={6}>
                <h5 className="major-details">
                  Dollar per Loaded Miles:{" "}
                  {typeof dollarPerLoadedMiles === "NaN"
                    ? 0
                    : dollarPerLoadedMiles.toFixed(2)}
                </h5>
              </Col>
              <Col md={6}>
                <h5 className="major-details">
                  Dollar per Total Miles: {dollarPerTotalMiles.toFixed(2)}
                </h5>
              </Col>
            </Row>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            <Row className="justify-content-around mt-2">
              <>
                <h5 className="major-details">
                  Working Days:{" "}
                  <input
                    className="form-group border"
                    value={workingDays}
                    disabled={defaultValue}
                    onChange={(e) => setWorkingDays(e.target.value)}
                    type="number"
                  />
                </h5>
              </>
              <Col md={6}></Col>
            </Row>
            <br />
            <br />
            <br />
            <br />
            <Row className="mt-2">
              <Col md={4}>
                <h5 className="major-details">Dispatcher Remarks:</h5>
              </Col>
              <Col md={12}>
                <textarea
                  value={dispatcherComments}
                  disabled={defaultValue}
                  onChange={(e) => setDispatcherComments(e.target.value)}
                  className="form-group border text-area"
                />
              </Col>
            </Row>
          </Row>
          <br />
          <br />
          <br />
          <Row className="justify-content-center">
            <h2 className="text-center">
              Have control of your business with our Statistical Analysis
            </h2>
            <br />
            <br />
            <br />
            <h5 className="text-center">Miles per month vs gross per month</h5>
            <Graphs type="line" data={lineGraphData} />
            <h5 className="text-center">Dollar per mile</h5>
            <Graphs type="bar" data={barGraphData} />
          </Row>

          <Row className="mt-5">
            <h3 className="text-center mt-3">Your Loads With us</h3>
            <Col>
              <table className="table invoice">
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
                          ? `${moment(item.pick_up.date).format(
                              "ll"
                            )} to ${moment(item.drop.date).format("ll")} `
                          : "NA"}
                      </td>
                      <td>{item.pay ? item.pay : "NA"}</td>
                      <td>{item.l_status ? item.l_status : "NA"}</td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    {/* <td>Total</td> */}
                    <td> {/* <p> {` $${invoice?.totalGross}`}</p> */}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

          <Row>
            <h1 className="total-miles">Regards,</h1>
            <h1 className="total-miles">Dispatcher {dispatcher.user_name}</h1>
            <h1 className="total-miles">Company {dispatcher.company}</h1>
          </Row>
        </Col>
      </Row>
      <Row className="justify-content-around">
        <Col md={8}>
          <Button
            className="w-100"
            variant={defaultValue ? "primary" : "success"}
            size="lg"
            onClick={printDocument}
          >
            {defaultValue ? <>Print</> : <>Print and Save</>}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default CarrierReport;
