import React from "react";
import Table from "../../components/table/SmartTable";
import Badge from "../../components/badge/Badge";
import { useSelector } from "react-redux";
import status_map from "../../assets/JsonData/status_map.json";

const customerTableHead = [
  "#",
  "MC",
  "Carrier Name",
  "Address",
  "Phone Number",
  "Email",
  "Status",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index) => (
  <tr key={index}>
    <td>{index + 1}</td>
    <td>{item.mc_number}</td>
    <td>{item.company_name}</td>
    <td>{item.address}</td>
    <td>{item.phone_number}</td>
    <td>{item.email}</td>
    <td>
      {<Badge type={status_map[item.c_status]} content={item.c_status} />}
    </td>
  </tr>
);

const Customers = () => {
  const { _id: currUserId } = useSelector((state) => state.user.user);

  return (
    <div>
      <h2 className="page-header">Spread Sheet</h2>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit={10}
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                api={{
                  url: `${process.env.REACT_APP_BACKEND_URL}/get-table-carriers`,
                  body: {
                    salesman: currUserId,
                  },
                }}
                placeholder={"MC / Carrier Name"}
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

export default Customers;
