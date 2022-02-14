import React, { useEffect, useRef, useState } from "react";
import EditButton from "../UI/EditButton";
import Table from "./SmartTable";
import "./loadtable.css";
import useHttp from "../../hooks/use-https";
import Modal from "../modals/MyModal";
import LoadForm from "../Form/NewLoadForm";
import { Row, Col, Button as BButton } from "react-bootstrap";
import MySelect from "../../components/UI/MySelect";
import Input from "../../components/UI/MyInput";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { loadsActions } from "../../store/loads";
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
  "",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const LoadTable = ({ truck_number, carrier }) => {
  const { sendRequest: fetchLoads } = useHttp();
  const [loadModal, setLoadModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const { loads: getLoads } = useSelector((state) => state.loads);
  const [invoiceModal, setInvoiceModal] = useState(false);
  // console.log(getLoads);
  const [load, setLoad] = useState("");
  const closeEditModel = () => {
    setEditModal(false);
  };

  //Search
  const searchRef = useRef();
  const [searchedCarrier, setSearchedCarrier] = useState(null);
  const search = (e) => {
    if (e.key === "Enter") {
      var searchValue = searchRef.current.value.trim();
      const searched = getLoads.filter((load) => {
        if (!isNaN(searchValue)) {
          return load.load_number === parseInt(searchRef.current.value.trim());
        } else {
          searchValue = searchValue.toLowerCase();
          if (load.broker.toLowerCase().includes(searchValue.toLowerCase())) {
            return true;
          }
          return false;
        }
      });
      if (searched.length !== 0) {
        setSearchedCarrier(searched);
      } else {
        setSearchedCarrier(null);
      }
    }
  };

  // filter
  const [filteredCarrier, setFilteredCarrier] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState([]);

  const searchByFilter = (values) => {
    setSelectedFilter(values);
    if (values.length !== 0) {
      const filters = values.map((item) => item.value);
      setFilteredCarrier(
        getLoads.filter((item) => filters.includes(item.l_status))
      );
    } else {
      setFilteredCarrier(null);
    }
  };

  const dispatch = useDispatch();

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

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
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
        <div className="edit__class">
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
  // console.log(searchedCarrier);
  return (
    <div>
      <Row>
        <h2>Loads:</h2>
        <Col></Col>
        <Col className="text-center">
          <BButton
            variant="success"
            size="lg"
            onClick={invoiceModalHandler}
            className="mb-4"
            disabled
          >
            Generate Invoice
          </BButton>{" "}
        </Col>
        <Col className="text-center">
          {" "}
          <BButton size="lg" onClick={loadModalHandler}>
            Add Loads
          </BButton>
        </Col>
      </Row>
      <Row>
        <div className="card">
          <div className="card__body">
            <Table
              key={Math.random()}
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
              filter={[
                { label: "Booked ", value: "booked" },
                { label: "Ongoing ", value: "ongoing" },
                { label: "Delivered ", value: "delivered" },
                { label: "Canceled ", value: "canceled" },
              ]}
              renderBody={(item, index) => renderBody(item, index)}
            />
          </div>
        </div>
      </Row>
      <Modal
        size="lg"
        show={invoiceModal}
        heading="Generate Invoice"
        onClose={closeLoadModal}
      >
        <GenerateInvoice
          truck_number={truck_number}
          carrier={carrier}
          loads={getLoads}
          closeModal={() => setInvoiceModal(false)}
        />
      </Modal>

      <Modal
        size="lg"
        show={loadModal}
        heading="Add New Load"
        onClose={closeLoadModal}
      >
        <LoadForm
          truck_number={truck_number}
          carrier={carrier}
          setEditModal={setLoadModal}
        />
      </Modal>
      <Modal
        size="lg"
        show={editModal}
        heading="Edit Load"
        onClose={closeEditModel}
        style={{ width: "auto" }}
      >
        <LoadForm
          setEditModal={setEditModal}
          defaultValue={load}
          truck_number={truck_number}
          carrier={carrier}
        />
      </Modal>
    </div>
  );
};

export default LoadTable;
