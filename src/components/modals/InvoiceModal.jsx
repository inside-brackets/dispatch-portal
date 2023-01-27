import { Row, Col, Form, Button } from "react-bootstrap";
import moment from "moment";
import Table from "../table/Table";
import { useSelector } from "react-redux";
import axios from "axios";
import React, { useState, useRef } from "react";
import TextArea from "../../components/UI/TextArea";
import "./invoiceModal.css";

const customerTableHead = [
  "#",
  "Load Number",
  "Miles",
  "Pickup  ",
  "Drop ",
  "Status",
  "Pay",
];
const renderHead = (item, index) => <th key={index}>{item}</th>;

const InvoiceModal = ({
  carrier,
  truck_number,
  load,
  startDate,
  endDate,
  totalLoads,
  totalGross,
  totalLoadedMiles,
  dispatcherFee,
  invoice,
  setModalHandler,
  setInvoices,
  closeModal,
}) => {
  const [dispatchFee, setDispatchFee] = useState(
    invoice ? invoice.dispatcherFee : null
  );
  const commentRef = useRef();

  const {
    _id: currUserId,
    user_name: currUserName,
    department,
  } = useSelector((state) => state.user.user);
  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.load_number ? item.load_number : "NA"}</td>
      <td>{item.miles ? item.miles : "NA"}</td>

      <td>
        {item.pick_up ? item.pick_up.address : "NA"} <br />{" "}
        {item.pick_up ? moment(item.pick_up.date).format("ll") : "NA"}
        <br />
        {item.pick_up ? moment(item.pick_up.date).format("LT") : "NA"}
      </td>
      <td>
        {item.drop ? item.drop.address : "NA"} <br />{" "}
        {item.drop ? moment(item.drop.date).format("ll") : "NA"}
        <br />
        {item.drop ? moment(item.drop.date).format("LT") : "NA"}
      </td>
      <td>{item.l_status ? item.l_status : "NA"}</td>
      <td>{item.pay ? item.pay : "NA"}</td>
    </tr>
  );

  const submitHandler = async () => {
    const obj = {
      carrierCompany: carrier.company_name,
      truckNumber: truck_number,
      comment: commentRef.current.value,
      trailerType: totalLoads[0].carrier.trailer_type,
      dispatcher: currUserId,
      sales: carrier.salesman._id,
      startingDate: startDate,
      endingDate: endDate,
      loads: load.map((item) => item._id),
      dispatcherFee: dispatcherFee,
      totalLoadedMiles: totalLoadedMiles,
      totalGross: totalGross,
      invoiceStatus: "pending",
      carrier: carrier._id,
      mc_number: carrier.mc_number,

      driver: {
        name: totalLoads[0].carrier.driver.name,
        email_address: totalLoads[0].carrier.driver.email_address,
        phone_number: totalLoads[0].carrier.driver.phone_number,
      },
    };

    await axios
      .post(`/createinvoice`, obj)
      .then((res) => {
        closeModal();
      })
      .catch((err) => console.log(err));
  };

  const changeStatusHandler = async () => {
    let res = await axios.put(`/admin/clearinvoice`, {
      _id: invoice._id,
      dispatcherFee: dispatchFee,
      mc_number: invoice.mc_number,
      truck_number: invoice.truckNumber,
      sales:invoice.sales
    });

    


    setInvoices((prev) => {
      return prev.map((item) => (item._id === res.data._id ? res.data : item));
    });
    setModalHandler(false);
  };
  const cancelledStatusHandler = async () => {
    let res = await axios.put(`/updateinvoice`, {
      _id: invoice._id,
      invoiceStatus: "cancelled",
    });
    setModalHandler(false);
    setInvoices((prev) => {
      return prev.map((item) => (item._id === res.data._id ? res.data : item));
    });
  };

  return (
    <div>
      <Row>
        <Col>
          <Row className="align-items-center m-2">
            <Col className="text-bold"> MC </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Readonly input here..."
                readOnly
                value={invoice ? invoice.mc_number : carrier.mc_number}
              />
            </Col>
          </Row>
          <Row className="m-2 align-items-center">
            <Col> Company Name </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Readonly input here..."
                readOnly
                value={
                  invoice ? invoice.carrier?.company_name : carrier.company_name
                }
              />
            </Col>
          </Row>
          <Row className="m-2 align-items-center">
            <Col> Dispatcher Name</Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Readonly input here..."
                readOnly
                value={invoice ? invoice.dispatcher.user_name : currUserName}
              />
            </Col>
          </Row>
        </Col>
        <Col>
          <Row className="m-2 align-items-center">
            <Col>Truck Number</Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Readonly input here..."
                readOnly
                value={invoice ? invoice.truckNumber : truck_number}
              />
            </Col>
          </Row>
          <Row className="m-2 align-items-center">
            <Col>Trailer Type</Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Readonly input here..."
                readOnly
                value={
                  invoice
                    ? invoice.trailerType
                    : // eslint-disable-next-line
                      carrier.trucks.find((t) => t.truck_number == truck_number)
                        .trailer_type
                }
              />
            </Col>
          </Row>
          <Row className="m-2 align-items-center">
            <Col>Driver Name</Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Readonly input here..."
                readOnly
                value={
                  invoice
                    ? invoice.driver.name
                    : // eslint-disable-next-line
                      carrier.trucks.find((t) => t.truck_number == truck_number)
                        .drivers[0].name
                }
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row
        style={{
          justifyContent: "center",
          marginTop: "40px",
          height: "100px",
        }}
      >
        <Col md={9}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <TextArea
              style={{ width: "500px", marginLeft: "35px" }}
              placeholder="Add comments here"
              // value={comment}
              defaultValue={invoice ? invoice.comment : ""}
              // onChange={(e) => setComment(e.target.value)}
              ref={commentRef}
            />
          </Form.Group>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <div className="card">
            <div className="card__body"></div>
            <Table
              key={Math.random()}
              headData={customerTableHead}
              renderHead={(item, index) => renderHead(item, index)}
              bodyData={load}
              renderBody={(item, index) => renderBody(item, index)}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={6}></Col>
        <Col md={6}>
          <Row className="m-2 align-items-center">
            <Col>Total Gross </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Readonly input here..."
                readOnly
                value={invoice ? invoice.totalGross : totalGross}
              />
            </Col>
          </Row>
          <Row className="m-2 align-items-center">
            <Col>Total Loaded Miles </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Readonly input here..."
                readOnly
                value={invoice ? invoice.totalLoadedMiles : totalLoadedMiles}
              />
            </Col>
          </Row>
          {invoice && (
            <Row className="m-2 align-items-center">
              <Col>Dispatcher Fee </Col>
              <Col>
                <Form.Control
                  type="text"
                  defaultValue={invoice && invoice.dispatcherFee}
                  onChange={(e) => setDispatchFee(e.target.value)}
                  readOnly={department !== "admin"}
                  value={dispatchFee}
                />
              </Col>
            </Row>
          )}
        </Col>

        <hr style={{ marginTop: "2%" }}></hr>
        {load.length > 0 && !invoice ? (
          <Button onClick={submitHandler}>Submit</Button>
        ) : (
          invoice && (
            <div className="d-flex justify-content-between align-items-center btnWrapper">
              <Button
                disabled={department !== "admin"}
                className="button-size"
                variant="danger"
                onClick={cancelledStatusHandler}
              >
                Cancel
              </Button>
              <Button
                disabled={department !== "admin"}
                className="button-size"
                variant="success"
                onClick={changeStatusHandler}
              >
                Clear
              </Button>
            </div>
          )
        )}
      </Row>
    </div>
  );
};

export default InvoiceModal;
