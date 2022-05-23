import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import Table from "../../components/table/SmartTable";
import EditButton from "../../components/UI/EditButton";
import moment from "moment";
import MyModal from "../../components/modals/MyModal";
import InvoiceModal from "../../components/modals/InvoiceModal";
import Badge from "../../components/badge/Badge";
import { useSelector } from "react-redux";
import invoice_status_map from "../../assets/JsonData/invoice_status_map.json";
import PdfTest from "../../components/PdfTest";
import axios from "axios";
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
  const [sales, setSales] = useState([]);
  const [dispatcher, setDispatcher] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const {data} = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/getusers`,
        {
          company: selectedCompany.value,
          department: ["sales", "dispatch"],
        }
      );
      setSales(
        data
          .filter((user) => user.department === "sales")
          .map((u) => {
            return {
              label: u.user_name,
              value: u._id,
            };
          })
      );
      setDispatcher(
        data
          .filter((user) => user.department === "dispatch")
          .map((u) => {
            return {
              label: u.user_name,
              value: u._id,
            };
          })
      );
    };
    getData();
  }, []);

  const renderBody = (item, index, currPage) => (
    <tr key={index}>
      <td>{index + 1 + currPage * 10}</td>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <EditButton type="open" onClick={() => viewInvoiceModal(item)} />
          <i
            class="bx bx-printer action-button"
            onClick={() => viewPdfModal(item)}
          ></i>
        </div>
      </td>
    </tr>
  );
  const [modalHandler, setModalHandler] = useState(false);
  const [PdfmodalHandler, setPdfModalHandler] = useState(false);
  const [loads, setLoads] = useState([]);
  const [invoice, setInvoice] = useState("");
  const [rerenderTable, setRerenderTable] = useState(null);
  const viewInvoiceModal = (item) => {
    setLoads(item.loads);
    setModalHandler(true);
    setInvoice(item);
  };
  const viewPdfModal = (item) => {
    setLoads(item.loads);
    setPdfModalHandler(true);
    setInvoice(item);
  };
  const [invoices, setInvoices] = useState([]);
  return (
    <>
      <Row>
        <div className="card">
          <div className="card__body">
            <Table
              key={rerenderTable}
              limit={10}
              headData={invoiceTableHead}
              renderHead={(item, index) => renderHead(item, index)}
              api={{
                url: `${process.env.REACT_APP_BACKEND_URL}/get-table-invoices`,
                body: {
                  company: selectedCompany.value,
                },
              }}
              placeholder={"MC"}
              filter={{
                status: [
                  { label: "cancelled", value: "cancelled" },
                  { label: "cleared ", value: "cleared" },
                  { label: "pending ", value: "pending" },
                ],
                sales: sales,
                dispatcher: dispatcher,
              }}
              renderBody={(item, index, currPage) =>
                renderBody(item, index, currPage)
              }
            />
          </div>
        </div>
      </Row>
      <MyModal
        show={modalHandler}
        heading="Invoice"
        size="lg"
        onClose={() => {
          setModalHandler(false);
        }}
      >
        <InvoiceModal
          setModalHandler={(data) => {
            setModalHandler(data);
            setRerenderTable(Math.random());
          }}
          load={loads}
          invoice={invoice}
          totalGross={invoices}
          setInvoices={setInvoices}
        />
      </MyModal>
      <MyModal
        show={PdfmodalHandler}
        size="xl"
        onClose={() => {
          setPdfModalHandler(false);
        }}
      >
        <PdfTest load={loads} invoice={invoice} />
      </MyModal>
    </>
  );
};

export default Invoice;
