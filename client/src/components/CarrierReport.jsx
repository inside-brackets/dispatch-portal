import React, { useRef, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Graphs from "./CarrierGraphs";
import "./carrier-report.css";
import { useReactToPrint } from "react-to-print";

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
  const reactToPrintContent = React.useCallback(() => {
    return ref.current;
  }, [ref.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "AwesomeFileName",
    // onBeforeGetContent: handleOnBeforeGetContent,
    // onBeforePrint: handleBeforePrint,
    // onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

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
      <Row id="div-to-print" ref={ref} className="justify-content-around m-3">
        <h3 className="text-center main-heading">{carrier.company_name}</h3>
        <h4 className="text-center mt-5 second-heading">Carrier Report</h4>
        <table>
          <tr>
            <td className="sub-heading">
              Carrier Name: {carrier.company_name}{" "}
            </td>
            <td className="sub-heading">Agent Name: {dispatcher.user_name} </td>
          </tr>
          <tr>
            <td className="sub-heading">MC:{carrier.mc_number}</td>
          </tr>
        </table>
        <h1 className="text-center">Statistics</h1>
        <h3 className="text-center mt-2">Loaded Miles Vs Deadhead</h3>
        <Graphs
          type="donut"
          loadedMiles={loadedMiles}
          deadHeadMiles={deadHeadMiles}
        />

        <table>
          <tr>
            <td className="loaded-miles">Loaded Miles: {loadedMiles}</td>
            <td className="deadhead-miles">DeadHead Miles:{deadHeadMiles}</td>
          </tr>
          <tr>
            <td className="total-miles">Total Miles:{totalMiles}</td>
          </tr>
          <tr>
            <td className="major-details">
              Dollar per Loaded Miles:{" "}
              {typeof dollarPerLoadedMiles === "NaN"
                ? 0
                : dollarPerLoadedMiles.toFixed(2)}
            </td>
            <td className="major-details">
              Dollar per Total Miles: {dollarPerTotalMiles.toFixed(2)}
            </td>
          </tr>
          <br />
          <br />
          <tr>
            <td className="major-details">Working Days:</td>
            <td className="major-details">
              <input
                className="form-group border"
                value={workingDays}
                disabled={defaultValue}
                onChange={(e) => setWorkingDays(e.target.value)}
                type="number"
              />
            </td>
          </tr>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <tr>
            <td className="major-details">Dispatcher Remarks:</td>
          </tr>
          <tr>
            <td>
              <textarea
                value={dispatcherComments}
                disabled={defaultValue}
                onChange={(e) => setDispatcherComments(e.target.value)}
                className="form-group border text-area"
              />
            </td>
          </tr>
        </table>

        <h2 className="text-center my-5">
          Have control of your business with our Statistical Analysis
        </h2>
        <Row className="justify-content-center my-5">
          <h5 className="text-center">Miles per month vs gross per month</h5>
          <Graphs type="line" data={lineGraphData} />
        </Row>

        <Row className="justify-content-center my-5">
          <h5 className="text-center">Dollar per mile</h5>
          <Graphs type="bar" data={barGraphData} />
        </Row>

        <h3 className="text-center mt-2">Your Loads With us</h3>
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
            <tr>
              <td></td>
              <td></td>
              {/* <td>Total</td> */}
              <td> {/* <p> {` $${invoice?.totalGross}`}</p> */}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <h4 className="total-miles">Regards,</h4>
        <h4 className="total-miles">Dispatcher {dispatcher.user_name}</h4>
        <h4 className="total-miles">Company {dispatcher.company}</h4>
      </Row>
      <Row className="justify-content-around">
        <Col md={8}>
          <Button
            className="w-100"
            variant={defaultValue ? "primary" : "success"}
            size="lg"
            onClick={handlePrint}
          >
            {defaultValue ? <>Print</> : <>Print and Save</>}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default CarrierReport;
