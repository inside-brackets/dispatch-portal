import React from "react";
import Table from "../../components/table/SmartTable";
import Badge from "../../components/badge/Badge";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import status_map from "../../assets/JsonData/status_map.json";

const carrierTableHead = [
  "#",
  "MC",
  "Carrier Name",
  "Phone Number",
  "Email",
  "Sales Person",
  "Status",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const Carriers = () => {
  const { company: selectedCompany } = useSelector((state) => state.user);

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.mc_number}</td>
      <td>{item.company_name}</td>
      <td style={{ width: "200px" }}>{item.phone_number}</td>
      <td>{item.email}</td>
      <td>{item.salesman ? item.salesman.user_name : "N/A"}</td>

      <td>
        {<Badge type={status_map[item.c_status]} content={item.c_status} />}
      </td>
    </tr>
  );

  return (
    <div>
      <h2> Carriers Database: </h2>
      <br />
      <Row>
        <Col></Col>
        <Col></Col>
      </Row>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit={3}
                headData={carrierTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                api={{
                  url: `${process.env.REACT_APP_BACKEND_URL}/get-table-carriers`,
                  body: {
                    company: selectedCompany.value,
                  },
                }}
                placeholder={"Company / Salesman / Dispatcher"}
                filter={[
                  { label: "Appointment ", value: "appointment" },
                  { label: "Registered", value: "registered" },
                  { label: "Deactivated ", value: "deactivated" },
                  { label: "Unreached ", value: "unreached" },
                ]}
                renderBody={(item, index) => renderBody(item, index)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carriers;
