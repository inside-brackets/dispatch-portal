import React, { useEffect, useRef, useState } from "react";
import EditButton from "../UI/EditButton";
import Table from "./Table";
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
const status_map = {
  booked: "primary",
  ongoing: "warning",
  delivered: "success",
  canceled: "danger",
};

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
  useEffect(() => {
    const transformData = (data) => {
      dispatch(loadsActions.set(data));
    };
    fetchLoads(
      {
        url: `${process.env.REACT_APP_BACKEND_URL}/getloads`,
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: {
          "carrier.mc_number": carrier.mc_number,
          "carrier.truck_number": truck_number,
        },
      },
      transformData
    );
  }, [fetchLoads, carrier, truck_number, dispatch]);

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
      {/* <td>{item.l_status ? item.l_status : "NA"}</td> */}
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
              pdfWindow.location.href = `${process.env.REACT_APP_BACKEND_URL}${item.ratecons}`;
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

        <Col style={{ display: "flex", alignItems: "center" }}>
          <MySelect
            isMulti={true}
            value={selectedFilter}
            onChange={searchByFilter}
            options={[
              { label: "Booked ", value: "booked" },
              { label: "Ongoing ", value: "ongoing" },
              { label: "Delivered ", value: "delivered" },
              { label: "Canceled ", value: "canceled" },
            ]}
          />
        </Col>
        <Col>
          <Input
            type="text"
            placeholder="Load Number / Br"
            icon="bx bx-search"
            ref={searchRef}
            onKeyDown={search}
            // ref={Driver1NameRef}
          />
        </Col>
        <Col className="text-center">
          <BButton variant="success" size="lg" onClick={invoiceModalHandler}>
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
        /
        <div className="card">
          <div className="card__body">
            {searchedCarrier && !filteredCarrier && (
              <Table
                key={Math.random()}
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={searchedCarrier}
                renderBody={(item, index) => renderBody(item, index)}
              />
            )}
            {!searchedCarrier && filteredCarrier && (
              <Table
                key={filteredCarrier.length}
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={filteredCarrier}
                renderBody={(item, index) => renderBody(item, index)}
              />
            )}
            {!searchedCarrier && !filteredCarrier && (
              <Table
                key={Math.random()}
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={getLoads}
                renderBody={(item, index) => renderBody(item, index)}
              />
            )}
            {searchedCarrier && filteredCarrier && (
              <Table
                key={Math.random()}
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={[]}
                renderBody={(item, index) => renderBody(item, index)}
              />
            )}
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
