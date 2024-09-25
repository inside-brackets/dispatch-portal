import React, { Fragment } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button, Row, Col, Card } from "react-bootstrap";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
// import "./pdf.css";
import Container from "react-bootstrap/Container";

const NewSalePDF = ({ carrier }) => {
  const ref = useRef();
  const reactToPrintContent = React.useCallback(() => {
    return ref.current;
  }, []);
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "AwesomeFileName",
    removeAfterPrint: true,
  });

  return (
    <div className="row">
      <div className="col">
        <div className="row px-5">
          <Button size="lg" onClick={handlePrint}>
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
          <br />
          <Row>
            <center>
              <h2>{carrier.company_name}</h2>
            </center>{" "}
          </Row>
          <hr />

          <table>
            <tbody>
              <tr>
                <th>MC:</th>
                <td>{carrier.mc_number}</td>
                <th>ADDRESS:</th>
                <td>{carrier.address}</td>
              </tr>
              <tr>
                <th>PHONE NO. :</th>
                <td>{carrier.phone_number}</td>
                <th>EMAIL:</th>
                <td>{carrier.email}</td>
              </tr>
              <tr></tr>
            </tbody>
          </table>

          <h3>Carrier details:</h3>
          <table>
            <tbody>
              <tr>
                <th>OWNER:</th>
                <td>{carrier.owner_name}</td>

                <th>TAX ID:</th>
                <td>{carrier.tax_id_number}</td>
              </tr>
              <tr>
                <th>DISPATCHER FEE:</th>
                <td>{carrier.dispatcher_fee}</td>
                <th>PAYMENT METHOD:</th>
                <td>{carrier.payment_method}</td>
              </tr>
            </tbody>
          </table>
          <br />
          <h3>Insurance detail</h3>
          <table>
            <tbody>
              <tr>
                <th>COMPANY NAME:</th>
                <td>{carrier.insurance?.name}</td>
                <th>ADDRESS:</th>
                <td>{carrier.insurance?.address}</td>
              </tr>
              <tr>
                <th>AGENT NAME:</th>
                <td>{carrier.insurance?.agent_name}</td>
                <th>AGENT CONTACT:</th>
                <td>{carrier.insurance?.phone_no}</td>
              </tr>
              <tr>
                <th>EMAIL:</th>
                <td>{carrier.insurance?.agent_email}</td>
              </tr>
            </tbody>
          </table>
          {carrier.factoring && (
            <>
              <br />
              <h3>Factoring detail:</h3>
              <table>
                <tbody>
                  <tr>
                    <th>COMPANY NAME:</th>
                    <td>{carrier.factoring?.name}</td>
                    <th>ADDRESS:</th>
                    <td>{carrier.factoring?.address}</td>
                  </tr>
                  <tr>
                    <th>AGENT NAME:</th>
                    <td>{carrier.factoring?.agent_name}</td>
                    <th>AGENT CONTACT:</th>
                    <td>{carrier.factoring?.phone_no}</td>
                  </tr>
                  <tr>
                    <th>EMAIL:</th>
                    <td>{carrier.factoring?.agent_email}</td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
          <br />
          <h3>Trucks:</h3>
          <br />
          {carrier.trucks?.map((truck) => (
            <>
              <h4>Truck Number: {truck.truck_number}</h4>
              <table>
                <tr>
                  <th>VIN Number</th>
                  <td>{truck.vin_number}</td>
                  <th>TRAILER TYPE</th>
                  <td>{truck.trailer_type}</td>
                  <th>CARRY LIMIT</th>
                  <td>{truck.carry_limit} lbs</td>
                </tr>
                <tr>
                  <th>REGION</th>
                  <td>{truck.region.join(", ")}</td>
                  <th>Trip Duration</th>
                  <td>{truck.trip_duration}</td>
                  <th>OFF DAYS</th>
                  <td>{truck.off_days.join(", ")}</td>
                </tr>
                <tr>
                  <th>DRIVER NAME</th>
                  <td>{truck.drivers[0].name}</td>
                  <th>DRIVER EMAIL:</th>
                  <td>{truck.drivers[0].email_address}</td>
                  <th>DRIVER CONTTACT:</th>
                  <td>{truck.drivers[0].phone_number}</td>
                </tr>
                <tr>
                  <th>TEAM DRIVER?</th>
                  <td>{truck.drivers.length > 1 ? "YES" : "NO"}</td>
                </tr>
              </table>
            </>
          ))}
        </div>
    </div>
     </div>
  );
};

export default NewSalePDF;
