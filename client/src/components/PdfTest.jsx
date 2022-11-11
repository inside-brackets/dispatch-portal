import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button, Row } from "react-bootstrap";
import { useRef } from "react";
import moment from "moment";
import "./pdf.css";

const PdfTest = ({ load, invoice }) => {
  const ref = useRef();
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
    <div className="row">
      <div className="col">
        <div className="row px-5">
          <Button size="lg" onClick={printDocument}>
            Print
          </Button>
        </div>
        <div
          id="div-to-print"
          ref={ref}
          style={{
            backgroundColor: "#fffff",
            width: "265mm",
            minHeight: "200mm",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h1
            style={{ marginBottom: "50px", marginTop: "20px" }}
            className="text-center"
          >
            Customer Report
          </h1>
          <h5 className="div text-start">
              <span className="header">MC Number</span>
              <span className="name me-5">{invoice?.carrier?.mc_number}</span>
            </h5>
          
          <div className="row">
            <h5 className="div col-5">
              <span className="header">Owner Name </span>
              <span className="name me-5">{invoice?.carrier?.owner_name}</span>
            </h5>
            <h5 className="col-7">
              <span className="header">Carrier Name</span>
              <span className="name me-5">
                {invoice?.carrier?.company_name}
              </span>
            </h5>
          </div>
          <div className="row" style={{marginTop: "0px"}}>
          <h5 className="col-5">
              <span className="header">Agent Name </span>
              <span className="name me-5">{invoice?.dispatcher.user_name}</span>
            </h5>
            <h5 className="div col-7">
              <span className="header">Email </span>
              <span className="name me-5">{invoice?.carrier?.email}</span>
            </h5>
          </div>
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
                <td>Total</td>
                <td>
                  {" "}
                  <p> {` $${invoice?.totalGross}`}</p>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <p className="d-flex justify-content-around" style={{marginTop:"8%"}}>
            <p className="d-flex flex-column justify-content-center align-items-center">
              <span className="box"></span> <p>Issuance Sign and Stamp</p>
            </p>
            <p className="d-flex flex-column align-items-center">
              <span className="box"></span> <p> Agent Signature</p>
            </p>
            <p className="d-flex flex-column align-items-center">
              <span className="box"></span> <p>Supervisor's Signature</p>
            </p>
            <p className="d-flex flex-column align-items-center">
              <span className="box"></span> <p>Accounts Signature</p>
            </p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PdfTest;
