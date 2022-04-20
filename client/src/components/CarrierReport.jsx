import React, { useRef } from "react";
import { Col, Row,Button } from "react-bootstrap";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CarrierReport = ({ load, carrier, truck, dispatcher }) => {
  console.log(carrier, truck);
  const ref = useRef();
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
  console.log(
    "dollar per loaded miles",
    dollarPerLoadedMiles,
    amounts,
    loadedMiles
  );

  const printDocument = () => {
    const input = document.getElementById("div-to-print");
    console.log(input);
    html2canvas(input).then((canvas) => {
      console.log("canvas", canvas);

      const imgData = canvas.toDataURL("image/png");
      console.log(imgData);
      console.log("hello");
      var pdf = new jsPDF({ orientation: "landscape" });
      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "JPEG", 0, 0, width, height);
      // pdf.output("dataurlnewwindow");
      pdf.save("download.pdf");
    });
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
                  <input className="form-group border" type="number" />
                </h5>
              </Col>
              <Col md={6}></Col>
            </Row>
            <Row className="justify-content-around mt-2">
              <Col md={6}>
                <h5>
                  Dispatcher Remarks:{" "}
                  <input className="form-group border" type="text-area" />
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
      <button size="lg" onClick={printDocument}>
        Print
      </button>
    </>
  );
};

export default CarrierReport;
