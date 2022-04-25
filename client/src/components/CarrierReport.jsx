import React, { useRef, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { useHistory } from "react-router-dom";

const CarrierReport = ({
  load,
  carrier,
  truck,
  dispatcher,
  startDate,
  endDate,
  defaultValue,
}) => {
  console.log(carrier, truck);
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
  let dollarPerLoadedMiles;
  if (amounts === 0 || loadedMiles === 0) {
    dollarPerLoadedMiles = 0;
  } else {
    dollarPerLoadedMiles = amounts / loadedMiles;
  }

  console.log("start and end date", startDate, endDate, carrier);

  const printDocument = async () => {
    if (!workingDays || !dispatcherComments) {
      return alert("Please add working days and dispatcher comments");
    }
    const input = document.getElementById("div-to-print");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      var pdf = new jsPDF({ orientation: "landscape" });
      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "JPEG", 0, 0, width, height);
      // pdf.output("dataurlnewwindow");
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
        }
      );
    }
    history.push("/report");
  };
  return (
    <>
      <Row
        id="div-to-print"
        ref={ref}
        style={{
          backgroundColor: "#fffff",
          width: "350mm",
          minHeight: "200mm",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        className="justify-content-around"
      >
        <Col md={10}>
          <h1 className="text-center">{carrier.company_name}</h1>
          <h2 className="text-center mt-5">Carrier Report</h2>
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
          {/* <Row>
            <h1>Your Journey With us</h1>
        </Row> */}
          <Row className="justify-content-around mt-5">
            <h1 className="text-center">Statistics</h1>
            <Row className="justify-content-around mt-5">
              <Col md={6}>
                <h5>Loaded Miles: {loadedMiles}</h5>
              </Col>
              <Col md={6}>
                <h5>DeadHead Miles:</h5>
              </Col>
            </Row>
            <Row className="justify-content-around mt-2">
              <Col md={6}>
                <h5>Total Miles:</h5>
              </Col>
              <Col md={6}></Col>
            </Row>
            <Row className="justify-content-around mt-2">
              <Col md={6}>
                <h5>
                  Dollar per Loaded Miles:{" "}
                  {typeof dollarPerLoadedMiles === "NaN"
                    ? 0
                    : dollarPerLoadedMiles}
                </h5>
              </Col>
              <Col md={6}>
                <h5>Dollar per Total Miles: XXX</h5>
              </Col>
            </Row>
            <Row className="justify-content-around mt-2">
              <Col md={6}>
                <h5>
                  Working Days:{" "}
                  <input
                    className="form-group border"
                    value={workingDays}
                    onChange={(e) => setWorkingDays(e.target.value)}
                    type="number"
                  />
                </h5>
              </Col>
              <Col md={6}></Col>
            </Row>
            <Row className="justify-content-around mt-2">
              <Col md={6}>
                <h5>
                  Dispatcher Remarks:{" "}
                  <textarea
                    value={dispatcherComments}
                    onChange={(e) => setDispatcherComments(e.target.value)}
                    className="form-group border"
                  />
                </h5>
              </Col>
              <Col md={6}></Col>
            </Row>
          </Row>
          <Row className="mt-5">
            <h2 className="text-center">
              Have control of your business with our Statistical Analysis
            </h2>
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
        </Col>
      </Row>
      <Button
        variant={defaultValue ? "primary" : "success"}
        size="lg"
        onClick={printDocument}
      >
        {defaultValue ? <>Print</> : <>Print and Ssave</>}
      </Button>
    </>
  );
};

export default CarrierReport;
