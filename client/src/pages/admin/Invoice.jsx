import React, { useState } from "react";
import { Row } from "react-bootstrap";
import Table from "../../components/table/SmartTable";
import EditButton from "../../components/UI/EditButton";
import moment from "moment";
import MyModal from "../../components/modals/MyModal";
import InvoiceModal from "../../components/modals/InvoiceModal";
import Badge from "../../components/badge/Badge";
import { useSelector } from "react-redux";
import invoice_status_map from "../../assets/JsonData/invoice_status_map.json";

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

const Invoice = () => {
  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const { company: selectedCompany } = useSelector((state) => state.user);

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.mc_number ? item.mc_number : "NA"}</td>
      <td>{item.carrierCompany ? item.carrierCompany : "NA"}</td>
      <td>{item.truckNumber ? item.truckNumber : "NA"}</td>

      <td>
        {item.startingDate ? moment(item.startingDate).format("ll") : "NA"}
        <br />
        {item.startingDate ? moment(item.startingDate).format("LT") : "NA"}
      </td>
      <td>
        {item.endingDate ? moment(item.endingDate).format("ll") : "NA"}
        <br />
        {item.endingDate ? moment(item.endingDate).format("LT") : "NA"}
      </td>
      <td>{item.totalGross ? item.totalGross : "NA"}</td>

      <td>{item.dispatcherFee ? item.dispatcherFee : "NA"}</td>
      <td>
        {item.invoiceStatus ? (
          <Badge
            type={invoice_status_map[item.invoiceStatus]}
            content={item.invoiceStatus}
          />
        ) : (
          "NA"
        )}
      </td>
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

  return (
    <>
      <Row>
        <div className="card">
          <div className="card__body">
            <Table
              key={Math.random()}
              limit={3}
              headData={invoiceTableHead}
              renderHead={(item, index) => renderHead(item, index)}
              api={{
                url: `${process.env.REACT_APP_BACKEND_URL}/get-table-invoices`,
                body: {
                  company: selectedCompany.value,
                },
              }}
              placeholder={"MC"}
              filter={[
                { label: "cancelled", value: "cancelled" },
                { label: "cleared ", value: "cleared" },
                { label: "pending ", value: "pending" },
              ]}
              renderBody={(item, index) => renderBody(item, index)}
            />
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
