import React, { useState } from "react";
import EditButton from "../UI/EditButton";
import Table from "./SmartTable";
import "./loadtable.css";
import Modal from "../modals/MyModal";
import LoadForm from "../Form/NewLoadForm";
import { Row, Col, Button as BButton } from "react-bootstrap";
import moment from "moment";
import GenerateInvoice from "../GenerateInvoice";
import Badge from "../../components/badge/Badge";
import status_map from "../../assets/JsonData/load_status_map.json";

const customerTableHead = [
  "#",
  "Load Number",
  "Weight(lbs)",
  "Miles",
  "Pay",
  "Broker",
  "Pickup  ",
  "Drop ",
  "Status",
  "Actions",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const LoadTable = ({ truck_number, carrier,className }) => {
  const [rerenderTable, setRerenderTable] = useState(null);
  const [loadModal, setLoadModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [load, setLoad] = useState("");
  const closeEditModel = () => {
    setEditModal(false);
  };

  const closeLoadModal = () => {
    setLoadModal(false);
    setInvoiceModal(false);
  };
  const invoiceModalHandler = () => {
    setInvoiceModal(true);
  };

  const loadModalHandler = () => {
    setLoadModal(true);
  };

  const editModalHnadler = (item) => {
    setEditModal(true);
    setLoad(item);
  };

  const renderBody = (item, index,currPage) => (
    <tr key={index}>
      <td>{(index + 1) + (currPage*10)}</td>
      <td>{item.load_number ? item.load_number : "NA"}</td>
      <td>{item.weight ? item.weight : "NA"}</td>
      <td>{item.miles ? item.miles : "NA"}</td>
      <td>{item.pay ? item.pay : "NA"}</td>
      <td>{item.broker ? item.broker : "NA"}</td>
      <td>
        {item.pick_up ? item.pick_up.address : "NA"} <br />{" "}
        {item.pick_up
          ? moment(new Date(item.pick_up.date)).format("DD-MM-YY")
          : "NA"}
        <br />
        {item.pick_up
          ? moment(new Date(item.pick_up.date)).format("h:mm a")
          : "NA"}
      </td>
      <td>
        {item.drop ? item.drop.address : "NA"} <br />{" "}
        {item.drop
          ? // moment(item.drop.date).zone("+0500").format("LL")
            moment(new Date(item.drop.date)).format("DD-MM-YY")
          : "NA"}
        <br />
        {item.drop ? moment(new Date(item.drop.date)).format("h:mm a") : "NA"}
      </td>
      <td>
        <Badge
          type={status_map[item.l_status ? item.l_status : "NA"]}
          content={item.l_status ? item.l_status : "NA"}
        />
      </td>

      <td>
        <div className="edit__class"     >
          <EditButton
            type="edit"
            onClick={() => {
              editModalHnadler(item);
            }}
          />
          <EditButton
            type="view"
            onClick={() => {
              const pdfWindow = window.open();
              pdfWindow.location.href = `${item.ratecon}`;
            }}
          />
        </div>
      </td>
    </tr>
  );
  return (
    <div>
      <Row >
        
        <Col md="9"><h2>Loads:</h2></Col>
        <Col md='3' className="text-center mb-4">
          <BButton
            variant="success"
            size="lg"
            onClick={invoiceModalHandler}
            className=" "
          style={{margin:'0px'}}>
            Generate Invoice
          </BButton>{" "}
          <BButton size="lg" onClick={loadModalHandler}>
            Add Loads
          </BButton>
        </Col>
        {/* <Col className="text-center">
          {" "}

        </Col> */}
      </Row>
      <Row>
        <div className={`card ${className}`}>
          <div className="card__body">
            <Table
              key={rerenderTable}
              limit={10}
              headData={customerTableHead}
              renderHead={(item, index) => renderHead(item, index)}
              api={{
                url: `${process.env.REACT_APP_BACKEND_URL}/get-table-loads`,
                body: {
                  "carrier.mc_number": carrier.mc_number,
                  "carrier.truck_number": truck_number,
                },
              }}
              placeholder={"Load Number / Broker"}
              filter={{
                status: [
                  { label: "Booked ", value: "booked" },
                  { label: "Ongoing ", value: "ongoing" },
                  { label: "Delivered ", value: "delivered" },
                  { label: "Canceled ", value: "canceled" },
                ],
              }}
              renderBody={(item, index,currPage) => renderBody(item, index,currPage)}
            />
          </div>
        </div>
      </Row>
      <Modal
        size="lg"
        show={invoiceModal}
        heading="Generate Invoice"
        onClose={closeLoadModal}
        scrollInvoice="scrollInvoice"
      >
        <GenerateInvoice
          truck_number={truck_number}
          carrier={carrier}
          closeModal={() => setInvoiceModal(false)}
          scroll="scroll"
        />
      </Modal>

      <Modal
        size="lg"
        show={loadModal}
        heading="Add New Load"
        onClose={closeLoadModal}
        scroll="scroll"
      >
        <LoadForm
          truck_number={truck_number}
          carrier={carrier}
          setEditModal={(data) => {
            setLoadModal(data);
            setRerenderTable(Math.random());
          }}
        />
      </Modal>
      <Modal
        size="lg"
        show={editModal}
        heading="Edit Load"
        onClose={closeEditModel}
        style={{ width: "auto" }}
        scroll="scroll"
      >
        <LoadForm
          setEditModal={(data) => {
            setEditModal(data);
            setRerenderTable(Math.random());
          }}
          defaultValue={load}
          truck_number={truck_number}
          carrier={carrier}
        />
      </Modal>
    </div>
  );
};

export default LoadTable;
