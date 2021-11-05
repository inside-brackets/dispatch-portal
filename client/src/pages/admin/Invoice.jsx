import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Table from "../../components/table/Table";
import MySelect from "../../components/UI/MySelect";
import MyInput from "../../components/UI/MyInput";
import EditButton from "../../components/UI/EditButton";
import moment from "moment";
import axios from "axios";
import MyModal from "../../components/modals/MyModal";
import InvoiceModal from "../../components/modals/InvoiceModal";
import Badge from "../../components/badge/Badge";

const invoiceTableHead = [
  "#",
  "MC",
  "Company Name",
  "Truck Number",
  "From",
  "To",
  "Gross",
  "Payable",
  "Status",
  "Action",
];

const status_map = {
  pending: "warning",
  cleared: "success",
  cancelled: "danger",
};

const Invoice = () => {
  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.mc_number ? item.mc_number : "NA"}</td>
      <td>{item.carrierCompany ? item.carrierCompany : "NA"}</td>
      <td>{item.truckNumber ? item.truckNumber : "NA"}</td>

      <td>
        {item.startingDate
          ? moment(item.startingDate).format("MMMM Do YYYY")
          : "NA"}
        <br />
        {item.startingDate
          ? moment(item.startingDate).format("h:mm:ss a")
          : "NA"}
      </td>
      <td>
        {item.endingDate
          ? moment(item.endingDate).format("MMMM Do YYYY")
          : "NA"}
        <br />
        {item.endingDate ? moment(item.endingDate).format("h:mm:ss a") : "NA"}
      </td>
      <td>{item.totalGross ? item.totalGross : "NA"}</td>

      <td>{item.dispatcherFee ? item.dispatcherFee : "NA"}</td>
      <td>
        {item.invoiceStatus ? (
          <Badge
            type={status_map[item.invoiceStatus]}
            content={item.invoiceStatus}
          />
        ) : (
          "NA"
        )}
      </td>
      {/* {<Badge type={status_map[item.c_status]} content={item.c_status} />} */}
      <td>
        <div className="edit__class">
          <EditButton type="view" onClick={() => viewInvoiceModal(item)} />
        </div>
      </td>
    </tr>
  );
  const [modalHandler, setModalHandler] = useState(false);
  const [loads, setLoads] = useState([]);
  const [invoice, setInvoice] = useState("");
  const viewInvoiceModal = (item) => {
    setLoads(item.loads);
    setModalHandler(true);
    setInvoice(item);
  };
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchLoads = async () => {
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/getinvoices`, {})
        .then((res) => setInvoices(res.data))
        .catch((err) => console.log(err));
    };
    fetchLoads();
  }, []);
  //Search
  const searchRef = useRef();
  const [searchedCarrier, setSearchedCarrier] = useState([]);
  const search = (e) => {
    if (e.key === "Enter") {
      const searched = invoices.filter((inv) => {
        return inv.mc_number === parseInt(searchRef.current.value);
      });

      if (searched) {
        setSearchedCarrier(searched);
      } else {
        setSearchedCarrier([]);
      }
    }
  };
  // Filter
  const [filteredCarrier, setFilteredCarrier] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState([]);

  const searchByFilter = (values) => {
    setSelectedFilter(values);
    if (values.length !== 0) {
      const filters = values.map((item) => item.value);
      setFilteredCarrier(
        invoices.filter((item) => filters.includes(item.invoiceStatus))
      );
    } else {
      setFilteredCarrier(null);
    }
  };
  return (
    <>
      <Row>
        <Col md={3}>
          <MyInput
            type="text"
            placeholder="MC"
            icon="bx bx-search"
            ref={searchRef}
            // value={searchInput}
            onKeyDown={search}
            // onChange={(e) => setSearchInput(e.target.value)}
          />
        </Col>
        <Col>
          <MySelect
            isMulti={true}
            value={selectedFilter}
            onChange={searchByFilter}
            options={[
              { label: "cancelled", value: "cancelled" },
              { label: "cleared ", value: "cleared" },
              { label: "pending ", value: "pending" },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <div className="card">
          <div className="card__body">
            {searchedCarrier.length !== 0 && !filteredCarrier && (
              <Table
                key={Math.random()}
                headData={invoiceTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={searchedCarrier}
                renderBody={(item, index) => renderBody(item, index)}
              />
            )}
            {searchedCarrier.length === 0 && filteredCarrier && (
              <Table
                key={filteredCarrier.length}
                headData={invoiceTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={filteredCarrier}
                renderBody={(item, index) => renderBody(item, index)}
              />
            )}
            {searchedCarrier.length === 0 && !filteredCarrier && (
              <Table
                key={Math.random()}
                headData={invoiceTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={invoices}
                renderBody={(item, index) => renderBody(item, index)}
              />
            )}
          </div>
        </div>
      </Row>
      <MyModal
        show={modalHandler}
        heading="Invoice"
        // onConfirm={rejectHandler}
        size="lg"
        onClose={() => {
          setModalHandler(false);
        }}
      >
        <InvoiceModal
          setModalHandler={setModalHandler}
          load={loads}
          invoice={invoice}
          totalGross={invoices}
          setInvoices={setInvoices}
        />
      </MyModal>
    </>
  );
};

export default Invoice;
