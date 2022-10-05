import React from "react";
import Table from "../../components/table/SmartTable";
import { Row, Col } from "react-bootstrap";
import moment from "moment";
import EditButton from "../../components/UI/EditButton";
import Badge from "../../components/badge/Badge";

import { useSelector } from "react-redux";
import status_map from "../../assets/JsonData/load_status_map.json";

const loadTableHead = [
  "#",
  "Load Number",
  "Weight",
  "Miles",
  "Pay",
  "Dispatcher",
  "Broker",
  "Pick Up",
  "Drop",
  "Status",
  "Action",
  "",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index, currPage) => (
  <tr key={index}>
    <td>{index + 1 + currPage * 10}</td>
    <td>{item.load_number ? item.load_number : "NA"}</td>
    <td>{item.weight ? item.weight : "NA"}</td>
    <td>{item.miles ? item.miles : "NA"}</td>
    <td>{item.pay ? item.pay : "NA"}</td>
    <td>{`${item.dispatcher.user_name} ${
      item.dispatcher.first_name
        ? `( ${item.dispatcher.first_name} ${item.dispatcher.last_name} )`
        : ""
    } `}</td>

    {/* <td>{item.dispatcher.user_name ? `${item.dispatcher.user_name} ${item.dispatcher.first_name ? <><br/>`( ${item.dispatcher.first_name} ${item.dispatcher.last_name} )`</> : ""} ` : "NA"}</td> */}
    <td>{item.broker ? item.broker : "NA"}</td>
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

    <td>
      <Badge type={status_map[item.l_status]} content={item.l_status} />
    </td>

    <td>
      <div className="edit__class">
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

const Loads = () => {
  const { company: selectedCompany } = useSelector((state) => state.user);
  return (
    <>
      <div>
        <Row>
          <Col md={3}></Col>
          <Col style={{ display: "flex", alignItems: "center" }}></Col>

          <div className="card">
            <div className="card__body">
              <Table
                limit={10}
                headData={loadTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                api={{
                  url: `${process.env.REACT_APP_BACKEND_URL}/get-table-loads`,
                  body: {
                    company: selectedCompany.value,
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
                renderBody={(item, index, currPage) =>
                  renderBody(item, index, currPage)
                }
              />
            </div>
          </div>
        </Row>
      </div>
    </>
  );
};

export default Loads;
