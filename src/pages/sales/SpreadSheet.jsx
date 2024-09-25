import React from "react";
import Table from "../../components/table/SmartTable";
import Badge from "../../components/badge/Badge";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import status_map from "../../assets/JsonData/status_map.json";
import { checkPaying } from "../../utils/utils";

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

const Customers = () => {
  const history = useHistory();
  const { _id: currUserId } = useSelector((state) => state.user.user);

  const renderBody = (item, index, currPage) => {
    const flag = checkPaying(item);
    return (
      <tr
        key={index}
        onClick={() => history.push(`/carrierview/${item.mc_number}`)}
      >
        <td>{index + 1 + currPage * 10}</td>
        <td>{item.mc_number}</td>
        <td>
          {flag ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#198754"
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <></>
          )}{" "}
          {item.company_name}
        </td>
        <td>{item.address}</td>
        <td>{item.phone_number}</td>
        <td>{item.email}</td>
        <td>
          {<Badge type={status_map[item.c_status]} content={item.c_status} />}
        </td>
      </tr>
    );
  };

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
                  url: `/get-table-carriers`,
                  body: {
                    salesman: currUserId,
                  },
                }}
                placeholder={"MC / Carrier Name"}
                filter={{
                  status: [
                    { label: "Appointment ", value: "appointment" },
                    { label: "Registered", value: "registered" },
                    { label: "Deactivated ", value: "deactivated" },
                    { label: "Rejected ", value: "rejected" },
                  ],
                  "registered within": [
                    { label: "30 days", value: "30days" },
                    { label: "60 days", value: "60days" },
                  ],
                }}
                renderBody={(item, index, currPage) =>
                  renderBody(item, index, currPage)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
