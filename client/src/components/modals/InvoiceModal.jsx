import { Row, Col, Form, Button } from "react-bootstrap";
import moment from "moment";
import Table from "../table/Table";
import { useSelector } from "react-redux";
import axios from "axios";
import React, { useState, useRef } from "react";
import TextArea from "../../components/UI/TextArea";

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
  const [dispatchFee, setDispatchFee] = useState(dispatcherFee);
  const commentRef = useRef();

  const { _id: currUserId, user_name: currUserName } = useSelector(
    (state) => state.user.user
  );
  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.load_number ? item.load_number : "NA"}</td>
      <td>{item.miles ? item.miles : "NA"}</td>

      <td>
        {item.pick_up ? item.pick_up.address : "NA"} <br />{" "}
        {item.pick_up ? moment(item.pick_up.date).format("MMMM Do YYYY") : "NA"}
        <br />
        {item.pick_up ? moment(item.pick_up.date).format("h:mm:ss a") : "NA"}
      </td>
      <td>
        {item.drop ? item.drop.address : "NA"} <br />{" "}
        {item.drop ? moment(item.drop.date).format("MMMM Do YYYY") : "NA"}
        <br />
        {item.drop ? moment(item.drop.date).format("h:mm:ss a") : "NA"}
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
      dispatcher: {
        _id: currUserId,
        name: currUserName,
      },
      sales: {
        _id: carrier.salesman._id,
        name: carrier.salesman.name,
      },
      startingDate: startDate,
      endingDate: endDate,
      loads: load,
      dispatcherFee: dispatcherFee,
      totalLoadedMiles: totalLoadedMiles,
      totalGross: totalGross,
      invoiceStatus: "pending",

      mc_number: carrier.mc_number,

      driver: {
        name: totalLoads[0].carrier.driver.name,
        email_address: totalLoads[0].carrier.driver.email_address,
        phone_number: totalLoads[0].carrier.driver.phone_number,
      },
    };

    await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/createinvoice`, obj)
      .then((res) => {
        console.log(res);
        closeModal();
      })
      .catch((err) => console.log(err));
  };

  const changeStatusHandler = async () => {
    setModalHandler(false);
    let res = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updateinvoice`,
      {
        _id: invoice._id,
        invoiceStatus: "cleared",
        dispatcherFee: dispatchFee,
      }
    );
    setInvoices((prev) => {
      return prev.map((item) => (item._id === res.data._id ? res.data : item));
    });
  };
  const cancelledStatusHandler = async () => {
    setModalHandler(false);
    let res = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/updateinvoice`,
      {
        _id: invoice._id,
        invoiceStatus: "cancelled",
      }
    );
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
                value={invoice ? invoice.carrierCompany : carrier.company_name}
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
                value={invoice ? invoice.dispatcher.name : currUserName}
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
                    : totalLoads[0].carrier.trailer_type
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
                    : totalLoads[0].carrier.driver.name
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
        {/* <Col md={1}></Col>
        <Col md={2}>Driver Name: </Col> */}
        <Col md={9}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <TextArea
              style={{ width: "500px" }}
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
                  value={dispatchFee}
                />
              </Col>
            </Row>
          )}
        </Col>

        {load.length > 0 && !invoice ? (
          <Button onClick={submitHandler}>Submit</Button>
        ) : (
          invoice && (
            <Row className="justify-content-center align-items-center">
              <Col className="text-center">
                <Button onClick={changeStatusHandler}>Cleared</Button>
              </Col>
              <Col className="text-center">
                <Button onClick={cancelledStatusHandler}>Canceled</Button>
              </Col>
            </Row>
          )
        )}
      </Row>
    </div>
  );
};

export default InvoiceModal;
